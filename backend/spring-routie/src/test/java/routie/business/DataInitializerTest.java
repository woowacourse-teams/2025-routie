package routie.business;

import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.business.routiespace.infrastructure.UUIDBaseRandomRoutieSpaceIdentifierProvider;

@Slf4j
@SpringBootTest
public class DataInitializerTest {

    private static final int ROUTIE_SPACE_COUNT = 10_000;
    private static final int PLACES_PER_SPACE = 20;
    private static final int ROUTIE_PLACES_PER_SPACE = 10;
    // Place와 RoutieSpace를 함께 저장할 배치 단위
    private static final int BATCH_UNIT_SIZE = 50; // 50개의 RoutieSpace와 1000개의 Place를 한 묶음으로 처리

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;
    @Autowired
    private PlaceRepository placeRepository;
    @Autowired
    private EntityManager entityManager;

    @Test
    @Commit
    @Transactional
    void generateLargeScaleTestData() {
        log.info("대규모 테스트 데이터 생성을 시작합니다...");
        Faker faker = new Faker(new Locale("ko"));
        RoutieSpaceIdentifierProvider identifierProvider = new UUIDBaseRandomRoutieSpaceIdentifierProvider();

        List<Place> placeBatch = new ArrayList<>();
        // ✅ 1. RoutieSpace를 담을 배치 리스트를 추가합니다.
        List<RoutieSpace> routieSpaceBatch = new ArrayList<>();

        for (int i = 0; i < ROUTIE_SPACE_COUNT; i++) {
            RoutieSpace routieSpace = RoutieSpace.from(identifierProvider);
            String sentence = faker.lorem().sentence(2);
            String limitedSentence = sentence.length() > 50 ? sentence.substring(0, 50) : sentence;
            routieSpace.updateName(limitedSentence);

            // ❗ routieSpace를 바로 저장하지 않고, 배치 리스트에 추가합니다.
            routieSpaceBatch.add(routieSpace);

            for (int j = 1; j <= PLACES_PER_SPACE; j++) {
                Place place = Place.create(
                        faker.company().name(),
                        faker.address().streetAddress(),
                        faker.address().fullAddress(),
                        Double.parseDouble(faker.address().longitude().replace(',', '.')),
                        Double.parseDouble(faker.address().latitude().replace(',', '.')),
                        routieSpace
                );

                if (j <= ROUTIE_PLACES_PER_SPACE) {
                    routieSpace.getRoutie().createLastRoutiePlace(place);
                }

                placeBatch.add(place);
            }

            // ✅ 2. 일정 개수의 RoutieSpace가 처리될 때마다 Place와 RoutieSpace를 순서대로 저장합니다.
            if ((i + 1) % BATCH_UNIT_SIZE == 0) {
                log.info("Saving a batch of {} RoutieSpaces and {} Places...", routieSpaceBatch.size(),
                        placeBatch.size());

                // ✅ 3. CRITICAL: Place를 먼저 저장하여 영속화합니다.
                placeRepository.saveAll(placeBatch);

                // ✅ 4. 그 다음, 영속화된 Place를 참조하는 RoutieSpace를 저장합니다.
                routieSpaceRepository.saveAll(routieSpaceBatch);

                // 리스트와 영속성 컨텍스트를 비워 메모리를 관리합니다.
                placeBatch.clear();
                routieSpaceBatch.clear();
                entityManager.flush();
                entityManager.clear();
            }
        }

        // ✅ 5. 루프 종료 후 남은 데이터들을 마지막으로 저장합니다. (순서 중요!)
        if (!placeBatch.isEmpty()) {
            log.info("Saving final batch of {} RoutieSpaces and {} Places...", routieSpaceBatch.size(),
                    placeBatch.size());
            placeRepository.saveAll(placeBatch);
            routieSpaceRepository.saveAll(routieSpaceBatch);

            placeBatch.clear();
            routieSpaceBatch.clear();
            entityManager.flush();
            entityManager.clear();
        }

        log.info("총 {}개의 RoutieSpace와 연관 데이터 생성 최종 완료!", ROUTIE_SPACE_COUNT);
    }
}
