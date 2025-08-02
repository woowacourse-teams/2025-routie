package routie.routie.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import routie.place.domain.Place;
import routie.place.repository.PlaceRepository;
import routie.routie.controller.dto.response.RoutieValidationResponse;
import routie.routie.controller.dto.response.RoutieValidationResponse.ValidationResultResponse;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.domain.RoutieSpaceFixture;
import routie.routiespace.repository.RoutieSpaceRepository;

@SpringBootTest
@Transactional
class RoutieServiceValidationTest {

    @Autowired
    private RoutieService routieService;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    private Routie routie;
    private Place placeA;
    private Place placeB;
    private RoutieSpace routieSpace;

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
        routie = Routie.create(new ArrayList<>(List.of(routiePlace1, routiePlace2)));

        routieSpace = RoutieSpaceFixture.createWithoutId(List.of(), routie);
        routieSpaceRepository.save(routieSpace);
    }

    @Test
    @DisplayName("유효한 경로일 경우 isValid true를 반환한다")
    void validateRoutie_WithValidCase_ShouldReturnTrue() {
        // given: 화요일(7월 29일)
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 9, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 18, 0);

        // when
        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime
        );

        // then
        assertThat(response.validationResultResponses().stream()
                .allMatch(ValidationResultResponse::isValid))
                .isTrue();
    }

    @Test
    @DisplayName("사용자 가용 시간이 부족할 경우 isValid false를 반환한다")
    void validateRoutie_WithInsufficientTotalTime_ShouldReturnFalse() {
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 10, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 11, 0);

        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime
        );

        assertValidationResultIsFalse(response, ValidationStrategy.IS_WITHIN_TOTAL_TIME);
    }

    @Test
    @DisplayName("장소 영업 시간과 맞지 않을 경우 isValid false를 반환한다")
    void validateRoutie_WhenNotWithinOperationHours_ShouldReturnFalse() {
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 8, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 18, 0);

        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime
        );

        assertValidationResultIsFalse(response, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);
    }

    @Test
    @DisplayName("장소 휴무일에 방문할 경우 isValid false를 반환한다")
    void validateRoutie_WhenVisitOnClosedDay_ShouldReturnFalse() {
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 28, 10, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 28, 18, 0);

        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime
        );

        assertValidationResultIsFalse(response, ValidationStrategy.IS_NOT_CLOSED_DAY);
    }

    @Test
    @DisplayName("장소 브레이크 타임과 겹칠 경우 isValid false를 반환한다")
    void validateRoutie_WhenDuringBreaktime_ShouldReturnFalse() {
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 12, 10);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 20, 0);

        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime
        );

        assertValidationResultIsFalse(response, ValidationStrategy.IS_NOT_DURING_BREAKTIME);
    }

    private void assertValidationResultIsFalse(final RoutieValidationResponse response,
                                               final ValidationStrategy strategy) {
        boolean isValid = response.validationResultResponses().stream()
                .filter(r -> Objects.equals(r.strategy(), strategy.getName()))
                .map(ValidationResultResponse::isValid)
                .findFirst()
                .orElseThrow(() -> new AssertionError("해당 strategy가 응답에 없습니다: " + strategy));

        assertThat(isValid).isFalse();
    }
}
