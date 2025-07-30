package routie.routie.infrastructure.routievalidator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import routie.place.domain.Place;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

class BreaktimeValidatorTest {

    private final BreaktimeValidator calculator = new BreaktimeValidator();

    @Test
    @DisplayName("브레이크 타임이 없는 경우 항상 true를 반환한다")
    void validate_WithNoBreaktime_ShouldReturnTrue() {
        // given
        Place placeWithNoBreaktime = createMockPlace(null, null);
        RoutiePlace routiePlace = createMockRoutiePlace(placeWithNoBreaktime);
        TimePeriod visitPeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 12, 0),
                LocalDateTime.of(2024, 1, 1, 13, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, visitPeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("방문이 브레이크 타임 시작 직전에 끝나면 true를 반환한다")
    void validate_WhenVisitEndsJustBeforeBreaktime_ShouldReturnTrue() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod visitPeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 11, 0),
                LocalDateTime.of(2024, 1, 1, 11, 59)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, visitPeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("방문이 브레이크 타임 시작 정각에 끝나면 true를 반환한다")
    void validate_WhenVisitEndsAtBreaktimeStart_ShouldReturnTrue() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod visitPeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 11, 0),
                LocalDateTime.of(2024, 1, 1, 12, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, visitPeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("방문이 브레이크 타임 종료 정각에 시작되면 true를 반환한다")
    void validate_WhenVisitStartsAtBreaktimeEnd_ShouldReturnTrue() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod visitPeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 13, 0),
                LocalDateTime.of(2024, 1, 1, 14, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, visitPeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("방문이 브레이크 타임과 일부 겹치면 false를 반환한다")
    void validate_WhenVisitOverlapsSlightlyWithBreaktime_ShouldReturnFalse() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);

        // TimePeriod가 브레이크 타임과 1분 겹친다.
        TimePeriod visitPeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 11, 30),
                LocalDateTime.of(2024, 1, 1, 12, 1)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, visitPeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("방문이 브레이크 타임 중에 시작되면 false를 반환한다")
    void validate_WhenVisitStartsDuringBreaktime_ShouldReturnFalse() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod visitPeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 12, 30),
                LocalDateTime.of(2024, 1, 1, 13, 30)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, visitPeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("방문이 브레이크 타임 전체를 포함하면 false를 반환한다")
    void validate_WhenVisitContainsBreaktime_ShouldReturnFalse() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod visitPeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 11, 0),
                LocalDateTime.of(2024, 1, 1, 14, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, visitPeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

        // then
        assertThat(result).isFalse();
    }

    private Place createMockPlace(final LocalTime breakStartAt, final LocalTime breakEndAt) {
        Place place = mock(Place.class);
        when(place.getBreakStartAt()).thenReturn(breakStartAt);
        when(place.getBreakEndAt()).thenReturn(breakEndAt);
        return place;
    }

    private RoutiePlace createMockRoutiePlace(final Place place) {
        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);
        return routiePlace;
    }
}
