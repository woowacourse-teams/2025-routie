package routie.routie.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import routie.place.domain.Place;
import routie.place.repository.PlaceRepository;
import routie.routie.controller.dto.response.RoutieTimeValidationResponse;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.repository.RoutieRepository;
import routie.routiespace.domain.RoutieSpaceFixture;
import routie.routiespace.repository.RoutieSpaceRepository;

@SpringBootTest
@Transactional
class RoutieServiceValidationTest {

    @Autowired
    private RoutieService routieService;

    @Autowired
    private RoutieRepository routieRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    private Routie routie;
    private Place placeA;
    private Place placeB;

    @BeforeEach
    void setUp() {
        placeA = Place.create(
                "장소 A",
                "주소 A",
                60,
                LocalTime.of(9, 0),
                LocalTime.of(18, 0),
                null,
                null,
                null,
                List.of()
        );

        placeB = Place.create(
                "장소 B",
                "주소 B",
                90,
                LocalTime.of(10, 0),
                LocalTime.of(20, 0),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                null,
                List.of(DayOfWeek.MONDAY)
        );

        placeRepository.saveAll(List.of(placeA, placeB));

        RoutiePlace routiePlace1 = new RoutiePlace(1, placeA);
        RoutiePlace routiePlace2 = new RoutiePlace(2, placeB);
        routie = Routie.withoutRoutiePlaces();
        routie.modify(new ArrayList<>(List.of(routiePlace1, routiePlace2)));

        routieSpaceRepository.save(RoutieSpaceFixture.createWithoutId(List.of(), List.of(routie)));

        routieRepository.save(routie);
    }

    @Test
    @DisplayName("유효한 경로일 경우 isValid true를 반환한다")
    void validateRoutie_WithValidCase_ShouldReturnTrue() {
        // given: 2025-07-29는 화요일
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 9, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 18, 0);

        // when
        RoutieTimeValidationResponse response = routieService.validateRoutie(routie.getId(), startTime, endTime);

        // then
        assertThat(response.isValid()).isTrue();
    }

    @Test
    @DisplayName("사용자 가용 시간이 부족할 경우 isValid false를 반환한다")
    void validateRoutie_WithInsufficientTotalTime_ShouldReturnFalse() {
        // given: 총 필요 시간보다 짧은 가용 시간
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 10, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 11, 0); // 매우 짧은 시간

        // when
        RoutieTimeValidationResponse response = routieService.validateRoutie(routie.getId(), startTime, endTime);

        // then
        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("장소 영업 시간과 맞지 않을 경우 isValid false를 반환한다")
    void validateRoutie_WhenNotWithinOperationHours_ShouldReturnFalse() {
        // given: 장소 A의 영업 시작 시간(09:00)보다 이른 시작
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 8, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 18, 0);

        // when
        RoutieTimeValidationResponse response = routieService.validateRoutie(routie.getId(), startTime, endTime);

        // then
        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("장소 휴무일에 방문할 경우 isValid false를 반환한다")
    void validateRoutie_WhenVisitOnClosedDay_ShouldReturnFalse() {
        // given: 장소 B의 휴무일인 월요일(2025-07-28)에 방문
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 28, 10, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 28, 18, 0);

        // when
        RoutieTimeValidationResponse response = routieService.validateRoutie(routie.getId(), startTime, endTime);

        // then
        assertThat(response.isValid()).isFalse();
    }

    @Test
    @DisplayName("장소 브레이크 타임과 겹칠 경우 isValid false를 반환한다")
    void validateRoutie_WhenDuringBreaktime_ShouldReturnFalse() {
        // given: 장소 B의 브레이크 타임(14:00-15:00)에 방문하도록 시작 시간 설정
        // 예상 경로: A(12:10-13:10) -> 이동(100분) -> B(14:50-16:20) -> 브레이크 타임과 겹침
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 12, 10);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 20, 0);

        // when
        RoutieTimeValidationResponse response = routieService.validateRoutie(routie.getId(), startTime, endTime);

        // then
        assertThat(response.isValid()).isFalse();
    }
}
