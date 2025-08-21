package routie.routie.service;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
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
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.transaction.annotation.Transactional;
import routie.place.domain.Place;
import routie.place.domain.PlaceBuilder;
import routie.place.repository.PlaceRepository;
import routie.routie.controller.dto.response.RoutieValidationResponse;
import routie.routie.controller.dto.response.RoutieValidationResponse.ValidationResultResponse;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.MovingStrategy;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.infrastructure.routecalculator.driving.kakaodrivingapi.TestRouteApiConfig;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.domain.RoutieSpaceBuilder;
import routie.routiespace.repository.RoutieSpaceRepository;

@Transactional
@Import(TestRouteApiConfig.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
class RoutieServiceValidationTest {

    @LocalServerPort
    private int port;

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
        RestAssured.port = port;

        PlaceBuilder placeBuilder = new PlaceBuilder();

        placeA = placeBuilder
                .name("장소 A")
                .roadAddressName("주소 A")
                .addressName("주소 A")
                .longitude(127.0)
                .latitude(37.5)
                .stayDurationMinutes(60)
                .openAt(LocalTime.of(9, 0))
                .closeAt(LocalTime.of(18, 0))
                .breakStartAt(null)
                .breakEndAt(null)
                .routieSpace(null)
                .placeClosedDayOfWeeks(List.of())
                .build();

        placeB = placeBuilder
                .name("장소 B")
                .roadAddressName("주소 B")
                .addressName("주소 B")
                .longitude(127.0)
                .latitude(37.5)
                .stayDurationMinutes(90)
                .openAt(LocalTime.of(10, 0))
                .closeAt(LocalTime.of(20, 0))
                .breakStartAt(LocalTime.of(14, 0))
                .breakEndAt(LocalTime.of(15, 0))
                .routieSpace(null)
                .placeClosedDayOfWeeksByDayOfWeeks(List.of(DayOfWeek.MONDAY))
                .build();

        placeRepository.saveAll(List.of(placeA, placeB));

        RoutiePlace routiePlace1 = new RoutiePlace(1, placeA);
        RoutiePlace routiePlace2 = new RoutiePlace(2, placeB);
        routie = Routie.create(new ArrayList<>(List.of(routiePlace1, routiePlace2)));

        routieSpace = new RoutieSpaceBuilder()
                .places(List.of())
                .routie(routie)
                .build();
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
                routieSpace.getIdentifier(), startTime, endTime, MovingStrategy.DRIVING
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
                routieSpace.getIdentifier(), startTime, endTime, MovingStrategy.DRIVING
        );

        assertValidationResultIsFalse(response, ValidationStrategy.IS_WITHIN_TOTAL_TIME);
    }

    @Test
    @DisplayName("장소 영업 시간과 맞지 않을 경우 isValid false를 반환한다")
    void validateRoutie_WhenNotWithinOperationHours_ShouldReturnFalse() {
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 8, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 18, 0);

        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime, MovingStrategy.DRIVING
        );

        assertValidationResultIsFalse(response, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);
    }

    @Test
    @DisplayName("장소 휴무일에 방문할 경우 isValid false를 반환한다")
    void validateRoutie_WhenVisitOnClosedDay_ShouldReturnFalse() {
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 28, 10, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 28, 18, 0);

        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime, MovingStrategy.DRIVING
        );

        assertValidationResultIsFalse(response, ValidationStrategy.IS_NOT_CLOSED_DAY);
    }

    @Test
    @DisplayName("장소 브레이크 타임과 겹칠 경우 isValid false를 반환한다")
    void validateRoutie_WhenDuringBreaktime_ShouldReturnFalse() {
        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 12, 10);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 20, 0);

        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime, MovingStrategy.DRIVING
        );

        assertValidationResultIsFalse(response, ValidationStrategy.IS_NOT_DURING_BREAKTIME);
    }

    private void assertValidationResultIsFalse(final RoutieValidationResponse response,
                                               final ValidationStrategy strategy) {
        boolean isValid = response.validationResultResponses().stream()
                .filter(r -> Objects.equals(r.validationCode(), strategy.getValidationCode()))
                .map(ValidationResultResponse::isValid)
                .findFirst()
                .orElseThrow(() -> new AssertionError("해당 strategy가 응답에 없습니다: " + strategy));

        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("장소가 1개일 때 사용자의 가용 시간이 부족하면 isValid false를 반환한다")
    void validateSinglePlaceRoutie_WithInsufficientTime_ShouldReturnFalse() {
        // given: 장소가 하나만 있는 Routie, 사용자의 가용 시간이 30분으로 부족한 상태
        Place singlePlace = new PlaceBuilder()
                .name("단일 장소")
                .roadAddressName("단일 도로명 주소")
                .addressName("단일 지번 주소")
                .longitude(127.0)
                .latitude(37.5)
                .stayDurationMinutes(60)
                .openAt(LocalTime.of(9, 0))
                .closeAt(LocalTime.of(18, 0))
                .breakStartAt(null)
                .breakEndAt(null)
                .routieSpace(null)
                .placeClosedDayOfWeeks(List.of())
                .build();

        placeRepository.save(singlePlace);

        RoutiePlace singleRoutiePlace = new RoutiePlace(1, singlePlace);
        Routie singleRoutie = Routie.create(List.of(singleRoutiePlace));
        RoutieSpace singleRoutieSpace = new RoutieSpaceBuilder()
                .places(new ArrayList<>())
                .routie(singleRoutie)
                .build();
        routieSpaceRepository.save(singleRoutieSpace);

        LocalDateTime startTime = LocalDateTime.of(2025, 7, 29, 10, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 7, 29, 10, 30);

        // when
        RoutieValidationResponse response = routieService.validateRoutie(
                routieSpace.getIdentifier(), startTime, endTime, MovingStrategy.DRIVING
        );

        // then: 총 시간 부족으로 인해 해당 조건만 false여야 함
        assertValidationResultIsFalse(response, ValidationStrategy.IS_WITHIN_TOTAL_TIME);

        boolean othersAreValid = response.validationResultResponses().stream()
                .filter(r -> !r.validationCode().equals(ValidationStrategy.IS_WITHIN_TOTAL_TIME.getValidationCode()))
                .allMatch(ValidationResultResponse::isValid);

        assertThat(othersAreValid).isTrue();
    }
}
