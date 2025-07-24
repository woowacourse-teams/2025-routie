package routie.routie.infrastructure.routievaliditycalculator;

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
import routie.routie.domain.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

class BreaktimeValidityCalculatorTest {

    private final BreaktimeValidityCalculator calculator = new BreaktimeValidityCalculator();

    @Test
    @DisplayName("브레이크 타임이 설정되지 않은 경우 항상 유효하다")
    void shouldReturnTrueWhenNoBreaktimeSet() {
        // given
        Place place = createMockPlace(null, null);
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 10, 0),
                LocalDateTime.of(2024, 1, 1, 11, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);

        // when
        boolean result = calculator.calculateValidity(timePeriodMap, ValidationStrategy.IS_NOT_HOLIDAY);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("일반 브레이크 타임: 브레이크 타임 시작 직전 방문은 유효하다")
    void shouldReturnTrueWhenVisitJustBeforeBreaktime() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 11, 30),
                LocalDateTime.of(2024, 1, 1, 11, 59)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);

        // when
        boolean result = calculator.calculateValidity(timePeriodMap, ValidationStrategy.IS_NOT_HOLIDAY);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("일반 브레이크 타임: 브레이크 타임 시작 시점 방문은 무효하다")
    void shouldReturnFalseWhenVisitAtBreaktimeStart() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 12, 0),
                LocalDateTime.of(2024, 1, 1, 12, 30)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);

        // when
        boolean result = calculator.calculateValidity(timePeriodMap, ValidationStrategy.IS_NOT_HOLIDAY);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("일반 브레이크 타임: 브레이크 타임 중간 방문은 무효하다")
    void shouldReturnFalseWhenVisitDuringBreaktime() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 12, 15),
                LocalDateTime.of(2024, 1, 1, 12, 45)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);

        // when
        boolean result = calculator.calculateValidity(timePeriodMap, ValidationStrategy.IS_NOT_HOLIDAY);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("일반 브레이크 타임: 브레이크 타임 종료 시점 방문은 무효하다")
    void shouldReturnFalseWhenVisitAtBreaktimeEnd() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 12, 30),
                LocalDateTime.of(2024, 1, 1, 13, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);

        // when
        boolean result = calculator.calculateValidity(timePeriodMap, ValidationStrategy.IS_NOT_HOLIDAY);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("일반 브레이크 타임: 브레이크 타임 종료 직후 방문은 유효하다")
    void shouldReturnTrueWhenVisitJustAfterBreaktime() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 13, 1),
                LocalDateTime.of(2024, 1, 1, 14, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);

        // when
        boolean result = calculator.calculateValidity(timePeriodMap, ValidationStrategy.IS_NOT_HOLIDAY);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("방문 시작은 유효하지만 종료가 브레이크 타임에 걸치는 경우 무효하다")
    void shouldReturnFalseWhenVisitStartValidButEndInBreaktime() {
        // given
        Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 11, 30),
                LocalDateTime.of(2024, 1, 1, 12, 30)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);

        // when
        boolean result = calculator.calculateValidity(timePeriodMap, ValidationStrategy.IS_NOT_HOLIDAY);

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
