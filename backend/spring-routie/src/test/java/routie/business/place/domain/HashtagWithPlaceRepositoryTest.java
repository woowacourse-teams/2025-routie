package routie.business.place.domain;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;
import routie.business.hashtag.domain.Hashtag;
import routie.business.hashtag.domain.HashtagRepository;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.participant.domain.UserRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceBuilder;
import routie.business.routiespace.domain.RoutieSpaceRepository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Transactional
@TestPropertySource(
        properties = {
                "spring.flyway.enabled=false"
        }
)
class HashtagWithPlaceRepositoryTest {

    @Autowired
    private PlaceRepository placeRepository;
    @Autowired
    private HashtagRepository hashtagRepository;
    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EntityManager entityManager;

    private User user;
    private RoutieSpace routieSpace;

    @BeforeEach
    void setUp() {
        user = UserFixture.emptyUser();
        userRepository.save(user);

        routieSpace = new RoutieSpaceBuilder().owner(user).build();
        routieSpaceRepository.save(routieSpace);
    }

    @Test
    @DisplayName("장소에 해시태그를 추가하고 저장할 수 있다")
    void savePlaceWithHashtagsSuccess() {
        // given
        final Place place = createPlace(routieSpace);
        final List<String> hashtagNames = List.of("저녁", "식사");
        final List<Hashtag> hashtags = createHashtags(routieSpace, hashtagNames);
        hashtags.stream()
                .map(hashtag -> new PlaceHashtag(place, hashtag))
                .forEach(placeHashtag -> place.getPlaceHashtags().add(placeHashtag));

        // when
        placeRepository.save(place);

        entityManager.clear();

        // then
        final Place savedPlace = placeRepository.findByIdAndRoutieSpace(place.getId(), routieSpace).orElseThrow();
        assertThat(savedPlace.getPlaceHashtags()).hasSize(2);
    }

    @Test
    @DisplayName("장소의 해시태그를 전체 교체할 수 있다")
    void updatePlaceWithNewHashtagsSuccess() {
        // given
        final Place place = createPlaceWithHashtags(routieSpace, List.of("저녁", "식사"));
        final List<String> newHashtagNames = List.of("식사", "점심");
        final List<Hashtag> newHashtags = createHashtags(routieSpace, newHashtagNames);

        // when
        final Place savedPlace = placeRepository.findByIdAndRoutieSpace(place.getId(), routieSpace).orElseThrow();
        savedPlace.updateHashtags(newHashtags);

        entityManager.flush();
        entityManager.clear();

        // then
        final Place updatedPlace = placeRepository.findByIdAndRoutieSpace(place.getId(), routieSpace).orElseThrow();
        assertThat(updatedPlace.getHashtags()).hasSize(2);
        assertThat(updatedPlace.getHashtags().stream().map(Hashtag::getName)).containsAll(newHashtagNames);
    }

    @Test
    @DisplayName("빈 리스트로 업데이트하면 모든 해시태그가 제거된다")
    void updatePlaceWithEmptyListRemovesAllHashtags() {
        // given
        final Place place = createPlaceWithHashtags(routieSpace, List.of("산책", "드라이브"));

        // when
        final Place savedPlace = placeRepository.findByIdAndRoutieSpace(place.getId(), routieSpace).orElseThrow();
        savedPlace.updateHashtags(List.of());

        entityManager.flush();
        entityManager.clear();

        // then
        final Place updatedPlace = placeRepository.findByIdAndRoutieSpace(place.getId(), routieSpace).orElseThrow();
        assertThat(updatedPlace.getPlaceHashtags()).isEmpty();
        assertThat(updatedPlace.getHashtags()).isEmpty();
    }

    @Test
    @DisplayName("장소를 삭제해도 Hashtag는 유지된다")
    void deletePlaceKeepsHashtags() {
        // given
        final Place place = createPlaceWithHashtags(routieSpace, List.of("산책", "드라이브"));
        final Long placeId = place.getId();

        entityManager.flush();
        entityManager.clear();

        // when
        placeRepository.deleteById(placeId);
        entityManager.flush();
        entityManager.clear();

        // then
        final List<Hashtag> hashtags = findAllHashtags(routieSpace);
        assertThat(hashtags).hasSize(2);
        assertThat(hashtags).extracting(Hashtag::getName)
                .containsExactlyInAnyOrder("산책", "드라이브");
    }

    @Test
    @DisplayName("중복된 해시태그 이름은 재사용할 수 있다")
    void reuseHashtagWhenNameAlreadyExists() {
        // given
        final Place place1 = createPlaceWithHashtags(routieSpace, List.of("산책", "드라이브"));
        final Hashtag existingHashtag = hashtagRepository.findByRoutieSpaceAndName(
                routieSpace,
                "산책"
        ).orElseThrow();

        // when
        final Place place2 = createPlace(routieSpace);
        final List<Hashtag> reusedHashtags = List.of(existingHashtag);
        place2.updateHashtags(reusedHashtags);
        placeRepository.save(place2);

        entityManager.flush();
        entityManager.clear();

        // then
        final List<Hashtag> allHashtags = findAllHashtags(routieSpace);
        assertThat(allHashtags).hasSize(2);
        assertThat(allHashtags).extracting(Hashtag::getName)
                .containsExactlyInAnyOrder("산책", "드라이브");

        final Place savedPlace2 = placeRepository.findByIdAndRoutieSpace(place2.getId(), routieSpace).orElseThrow();
        assertThat(savedPlace2.getPlaceHashtags()).hasSize(1);
        assertThat(savedPlace2.getHashtags().stream().map(Hashtag::getName)).containsExactly("산책");
    }

    @Test
    @DisplayName("RoutieSpace의 모든 해시태그를 조회할 수 있다")
    void findAllHashtagsInRoutieSpace() {
        // given
        final Place place1 = createPlaceWithHashtags(routieSpace, List.of("산책", "드라이브"));
        final Place place2 = createPlaceWithHashtags(routieSpace, List.of("산책", "저녁"));
        final Place place3 = createPlaceWithHashtags(routieSpace, List.of("점심"));

        entityManager.flush();
        entityManager.clear();

        // when
        final List<Hashtag> hashtags = findAllHashtags(routieSpace);

        // then
        assertThat(hashtags).hasSize(4);
        assertThat(hashtags).extracting(Hashtag::getName)
                .containsExactlyInAnyOrder("산책", "드라이브", "저녁", "점심");
    }

    @Test
    @DisplayName("다른 RoutieSpace의 해시태그는 조회되지 않는다")
    void findHashtagsIsolatedByRoutieSpace() {
        // given
        final RoutieSpace otherSpace = new RoutieSpaceBuilder()
                .owner(user)
                .build();
        routieSpaceRepository.save(otherSpace);

        createPlaceWithHashtags(routieSpace, List.of("산책"));

        final Place otherPlace = new PlaceBuilder()
                .routieSpace(otherSpace)
                .build();
        final Hashtag otherHashtag = hashtagRepository.save(new Hashtag("산책", otherSpace));
        otherPlace.updateHashtags(List.of(otherHashtag));
        placeRepository.save(otherPlace);

        entityManager.flush();
        entityManager.clear();

        // when
        final List<Hashtag> hashtags = findAllHashtags(routieSpace);

        // then
        assertThat(hashtags).hasSize(1);
        assertThat(hashtags.getFirst().getRoutieSpace().getId()).isEqualTo(routieSpace.getId());
    }

    @Test
    @DisplayName("해시태그 이름으로 존재 여부를 확인할 수 있다")
    void checkHashtagExistenceByName() {
        // given
        createPlaceWithHashtags(routieSpace, List.of("산책", "드라이브"));

        entityManager.flush();
        entityManager.clear();

        // when
        final Optional<Hashtag> found = hashtagRepository.findByRoutieSpaceAndName(
                routieSpace,
                "산책"
        );
        final Optional<Hashtag> notFound = hashtagRepository.findByRoutieSpaceAndName(
                routieSpace,
                "존재하지않음"
        );

        // then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("산책");
        assertThat(notFound).isEmpty();
    }

    private Place createPlace(final RoutieSpace routieSpace) {
        return new PlaceBuilder()
                .routieSpace(routieSpace)
                .build();
    }

    private Place createPlaceWithHashtags(final RoutieSpace routieSpace, final List<String> hashtagNames) {
        final Place place = createPlace(routieSpace);
        final List<Hashtag> hashtags = createHashtags(routieSpace, hashtagNames);
        hashtags.stream()
                .map(hashtag -> new PlaceHashtag(place, hashtag))
                .forEach(placeHashtag -> place.getPlaceHashtags().add(placeHashtag));
        return placeRepository.save(place);
    }

    private List<Hashtag> createHashtags(final RoutieSpace routieSpace, final List<String> hashtagNames) {
        return hashtagNames.stream()
                .map(name -> createHashtagIfNotExist(routieSpace, name))
                .toList();
    }

    private Hashtag createHashtagIfNotExist(final RoutieSpace routieSpace, final String name) {
        return hashtagRepository.findByRoutieSpaceAndName(routieSpace, name)
                .orElseGet(() -> hashtagRepository.save(new Hashtag(name, routieSpace)));
    }

    private List<Hashtag> findAllHashtags(final RoutieSpace routieSpace) {
        return hashtagRepository.findByRoutieSpace(routieSpace);
    }
}
