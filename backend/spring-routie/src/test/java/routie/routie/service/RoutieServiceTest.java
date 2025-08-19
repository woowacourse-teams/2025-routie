package routie.routie.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import routie.exception.BusinessException;
import routie.place.domain.Place;
import routie.place.repository.PlaceRepository;
import routie.routie.controller.dto.request.RoutiePlaceCreateRequest;
import routie.routie.controller.dto.request.RoutieUpdateRequest;
import routie.routie.controller.dto.request.RoutieUpdateRequest.RoutiePlaceRequest;
import routie.routie.domain.RoutiePlace;
import routie.routie.repository.RoutiePlaceRepository;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.repository.RoutieSpaceRepository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
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

    private RoutieSpace testRoutieSpace;
    private Place testPlace1;
    private Place testPlace2;
    private Place testPlace3;

    @BeforeEach
    void setUp() {
        // 기존 데이터 정리
        transactionTemplate.execute(status -> {
            routiePlaceRepository.deleteAll();
            placeRepository.deleteAll();
            routieSpaceRepository.deleteAll();
            return null;
        });

        // 테스트용 데이터 생성
        transactionTemplate.execute(status -> {
            // 테스트용 루티 스페이스 생성
            testRoutieSpace = RoutieSpace.from(() -> "test-routie-space-" + System.currentTimeMillis());
            routieSpaceRepository.save(testRoutieSpace);

            // 테스트용 장소들 생성
            testPlace1 = Place.create(
                    "카페 A",
                    "서울시 강남구 테헤란로 123",
                    "서울시 강남구 역삼동 123-45",
                    127.027926,
                    37.497175,
                    60,
                    LocalTime.of(9, 0),
                    LocalTime.of(22, 0),
                    null,
                    null,
                    testRoutieSpace,
                    List.of(DayOfWeek.SUNDAY)
            );

            testPlace2 = Place.create(
                    "레스토랑 B",
                    "서울시 강남구 테헤란로 456",
                    "서울시 강남구 역삼동 456-78",
                    127.028926,
                    37.498175,
                    90,
                    LocalTime.of(11, 0),
                    LocalTime.of(23, 0),
                    LocalTime.of(15, 0),
                    LocalTime.of(17, 0),
                    testRoutieSpace,
                    List.of()
            );

            testPlace3 = Place.create(
                    "쇼핑몰 C",
                    "서울시 강남구 테헤란로 789",
                    "서울시 강남구 역삼동 789-12",
                    127.029926,
                    37.499175,
                    120,
                    LocalTime.of(10, 0),
                    LocalTime.of(22, 0),
                    null,
                    null,
                    testRoutieSpace,
                    List.of(DayOfWeek.MONDAY)
            );

            placeRepository.saveAll(List.of(testPlace1, testPlace2, testPlace3));
            return null;
        });
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

        try (ExecutorService executorService = Executors.newFixedThreadPool(threadCount)) {
            // When
            for (int i = 0; i < threadCount; i++) {
                executorService.submit(() -> {
                    try {
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
        // Given - 초기 루티 설정
        String routieSpaceIdentifier = testRoutieSpace.getIdentifier();

        // 초기 루티에 장소들 추가
        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace1.getId()));
        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace2.getId()));
        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace3.getId()));

        // 초기 상태 확인
        List<RoutiePlace> initialPlaces = routiePlaceRepository.findAll();
        assertThat(initialPlaces).hasSize(3);

        // When - 순서 변경 (1,2,3 -> 3,1,2)
        RoutieUpdateRequest updateRequest = new RoutieUpdateRequest(List.of(
                new RoutiePlaceRequest(testPlace3.getId(), 1), // 쇼핑몰 C가 3번째에서 1번째로
                new RoutiePlaceRequest(testPlace1.getId(), 2), // 카페 A가 1번째에서 2번째로
                new RoutiePlaceRequest(testPlace2.getId(), 3)  // 레스토랑 B가 2번째에서 3번째로
        ));

        routieService.modifyRoutie(routieSpaceIdentifier, updateRequest);

        // Then - 순서가 올바르게 변경되었는지 확인
        List<RoutiePlace> updatedPlaces = routiePlaceRepository.findAll();
        assertThat(updatedPlaces).hasSize(3);

        // 시퀀스별로 정렬하여 확인
        updatedPlaces.sort((a, b) -> Integer.compare(a.getSequence(), b.getSequence()));

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
        // Given - 초기 루티 설정
        String routieSpaceIdentifier = testRoutieSpace.getIdentifier();

        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace1.getId()));
        routieService.addRoutiePlace(routieSpaceIdentifier, new RoutiePlaceCreateRequest(testPlace2.getId()));

        // When - 완전히 다른 장소들로 교체
        RoutieUpdateRequest updateRequest = new RoutieUpdateRequest(List.of(
                new RoutiePlaceRequest(testPlace3.getId(), 1) // 완전히 새로운 구성
        ));

        routieService.modifyRoutie(routieSpaceIdentifier, updateRequest);

        // Then - 새로운 구성으로 교체되었는지 확인
        List<RoutiePlace> updatedPlaces = routiePlaceRepository.findAll();
        assertThat(updatedPlaces).hasSize(1);
        assertThat(updatedPlaces.get(0).getPlace().getId()).isEqualTo(testPlace3.getId());
        assertThat(updatedPlaces.get(0).getSequence()).isEqualTo(1);
    }
}
