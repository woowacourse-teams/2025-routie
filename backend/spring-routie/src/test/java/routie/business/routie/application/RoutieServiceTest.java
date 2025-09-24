package routie.business.routie.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceBuilder;
import routie.business.place.domain.PlaceRepository;
import routie.business.routie.domain.RoutiePlace;
import routie.business.routie.domain.RoutiePlaceRepository;
import routie.business.routie.ui.dto.request.RoutiePlaceCreateRequest;
import routie.business.routie.ui.dto.request.RoutieUpdateRequest;
import routie.business.routie.ui.dto.request.RoutieUpdateRequest.RoutiePlaceRequest;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceBuilder;
import routie.business.routiespace.domain.RoutieSpaceFixture;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.business.user.domain.User;
import routie.business.user.domain.UserBuilder;
import routie.business.user.domain.UserRepository;
import routie.global.exception.domain.BusinessException;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
class RoutieServiceTest {

    @Autowired
    private RoutieService routieService;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RoutiePlaceRepository routiePlaceRepository;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private UserRepository userRepository;

    private User user;
    private RoutieSpace testRoutieSpace;
    private Place testPlace1;
    private Place testPlace2;
    private Place testPlace3;

    @BeforeEach
    void setUp() {
        routiePlaceRepository.deleteAll();
        placeRepository.deleteAll();
        routieSpaceRepository.deleteAll();
        userRepository.deleteAll();

        user = new UserBuilder().build();
        testRoutieSpace = new RoutieSpaceBuilder()
                .owner(user)
                .places(RoutieSpaceFixture.emptyPlaces())
                .build();
        user.getRoutieSpaces().add(testRoutieSpace);

        testPlace1 = new PlaceBuilder()
                .routieSpace(testRoutieSpace)
                .build();

        testPlace2 = new PlaceBuilder()
                .routieSpace(testRoutieSpace)
                .build();

        testPlace3 = new PlaceBuilder()
                .routieSpace(testRoutieSpace)
                .build();

        testRoutieSpace.getPlaces().addAll(List.of(testPlace1, testPlace2, testPlace3));

        userRepository.save(user);
        routieSpaceRepository.save(testRoutieSpace);
    }

    @Test
    @DisplayName("루티 장소 추가 시 동시성 테스트")
    void testConcurrentAddRoutiePlace() throws InterruptedException {
        // Given
        String routieSpaceIdentifier = testRoutieSpace.getIdentifier();
        RoutiePlaceCreateRequest request = new RoutiePlaceCreateRequest(testPlace1.getId());

        int threadCount = 10;
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);

        CyclicBarrier barrier = new CyclicBarrier(threadCount);
        try (ExecutorService executorService = Executors.newFixedThreadPool(threadCount)) {
            // When
            for (int i = 0; i < threadCount; i++) {
                executorService.submit(() -> {
                    try {
                        barrier.await();
                        transactionTemplate.execute(status -> {
                            routieService.addRoutiePlace(routieSpaceIdentifier, request);
                            return null;
                        });
                        successCount.incrementAndGet();
                    } catch (final Exception e) {
                        // 실패는 무시
                    } finally {
                        latch.countDown();
                    }
                });
            }
            boolean finished = latch.await(10, TimeUnit.SECONDS);

            // Then
            assertThat(finished).isTrue();
            assertThat(successCount.get()).isEqualTo(1);
        }

        Long finalCount = transactionTemplate.execute(status ->
                (long) routiePlaceRepository.findAll().size());
        assertThat(finalCount).isEqualTo(1);
    }

    @Test
    @DisplayName("루티 순서 수정 테스트 - 순서 변경")
    @Transactional
    void testModifyRoutieOrder() {
        // Given
        String routieSpaceIdentifier = testRoutieSpace.getIdentifier();

        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace1.getId()));
        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace2.getId()));
        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace3.getId()));

        List<RoutiePlace> initialPlaces = routiePlaceRepository.findAll();
        assertThat(initialPlaces).hasSize(3);

        // When
        RoutieUpdateRequest updateRequest = new RoutieUpdateRequest(List.of(
                new RoutiePlaceRequest(testPlace3.getId(), 1),
                new RoutiePlaceRequest(testPlace1.getId(), 2),
                new RoutiePlaceRequest(testPlace2.getId(), 3)
        ));

        routieService.modifyRoutie(routieSpaceIdentifier, updateRequest);

        // Then
        List<RoutiePlace> updatedPlaces = routiePlaceRepository.findAll();
        updatedPlaces.sort(Comparator.comparingInt(RoutiePlace::getSequence));

        assertThat(updatedPlaces).hasSize(3);

        assertThat(updatedPlaces.get(0).getPlace().getId()).isEqualTo(testPlace3.getId());
        assertThat(updatedPlaces.get(0).getSequence()).isEqualTo(1);

        assertThat(updatedPlaces.get(1).getPlace().getId()).isEqualTo(testPlace1.getId());
        assertThat(updatedPlaces.get(1).getSequence()).isEqualTo(2);

        assertThat(updatedPlaces.get(2).getPlace().getId()).isEqualTo(testPlace2.getId());
        assertThat(updatedPlaces.get(2).getSequence()).isEqualTo(3);
    }

    @Test
    @DisplayName("루티 수정 테스트 - 전체 교체")
    @Transactional
    void testModifyRoutieCompleteReplacement() {
        // Given
        String routieSpaceIdentifier = testRoutieSpace.getIdentifier();

        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace1.getId()));
        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace2.getId()));

        // When
        RoutieUpdateRequest updateRequest = new RoutieUpdateRequest(List.of(
                new RoutiePlaceRequest(testPlace3.getId(), 1)
        ));

        routieService.modifyRoutie(routieSpaceIdentifier, updateRequest);

        // Then
        List<RoutiePlace> updatedPlaces = routiePlaceRepository.findAll();
        assertThat(updatedPlaces).hasSize(1);
        assertThat(updatedPlaces.getFirst().getPlace().getId()).isEqualTo(testPlace3.getId());
        assertThat(updatedPlaces.getFirst().getSequence()).isEqualTo(1);
    }

    @Test
    @DisplayName("루티 수정 시 DELETE 성공 후 INSERT 실패 시 롤백 테스트")
    void testModifyRoutieRollbackOnFailure() {
        // Given
        String routieSpaceIdentifier = testRoutieSpace.getIdentifier();

        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace1.getId()));
        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace2.getId()));

        List<RoutiePlace> initialPlaces = routiePlaceRepository.findAll();
        assertThat(initialPlaces).hasSize(2);

        // When
        RoutieUpdateRequest invalidRequest = new RoutieUpdateRequest(List.of(
                new RoutiePlaceRequest(testPlace1.getId(), 1),
                new RoutiePlaceRequest(99999L, 2)
        ));

        // Then
        assertThatThrownBy(() -> routieService.modifyRoutie(routieSpaceIdentifier, invalidRequest))
                .isInstanceOf(BusinessException.class);

        List<RoutiePlace> afterFailurePlaces = routiePlaceRepository.findAll();
        assertThat(afterFailurePlaces).hasSize(2);

        afterFailurePlaces.sort(Comparator.comparingInt(RoutiePlace::getSequence));
        assertThat(afterFailurePlaces.get(0).getPlace().getId()).isEqualTo(testPlace1.getId());
        assertThat(afterFailurePlaces.get(1).getPlace().getId()).isEqualTo(testPlace2.getId());
    }
}
