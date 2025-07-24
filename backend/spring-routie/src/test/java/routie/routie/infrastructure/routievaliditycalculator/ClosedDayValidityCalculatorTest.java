package routie.routie.infrastructure.routievaliditycalculator;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import routie.place.domain.Place;
import routie.place.domain.PlaceClosedWeekday;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

class ClosedDayValidityCalculatorTest {

    private final ClosedDayValidityCalculator calculator = new ClosedDayValidityCalculator();

    @Test
    void supportsStrategy_shouldReturnTrue_forIS_NOT_CLOSED_DAY() {
        assertTrue(calculator.supportsStrategy(ValidationStrategy.IS_NOT_CLOSED_DAY));
    }

    @Test
    void supportsStrategy_shouldReturnFalse_forOtherStrategy() {
        assertFalse(calculator.supportsStrategy(ValidationStrategy.IS_WITHIN_OPERATION_HOURS));
    }

    @Test
    void calculateValidity_shouldReturnTrue_whenAllDaysAreOpen() {
        // given
        Place place = mock(Place.class);
        when(place.getClosedWeekdays()).thenReturn(List.of()); // 항상 열려 있는 장소

        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);

        TimePeriod period = new TimePeriod(
                LocalDateTime.of(2025, 7, 22, 10, 0), // 화요일
                LocalDateTime.of(2025, 7, 22, 12, 0)  // 화요일
        );

        Map<RoutiePlace, TimePeriod> map = Map.of(routiePlace, period);

        // when
        boolean result = calculator.calculateValidity(map, ValidationStrategy.IS_NOT_CLOSED_DAY);

        // then
        assertTrue(result);
    }

    @Test
    void calculateValidity_shouldReturnFalse_whenStartDayIsClosed() {
        // given
        PlaceClosedWeekday closed = new PlaceClosedWeekday(DayOfWeek.TUESDAY);
        Place place = mock(Place.class);
        when(place.getClosedWeekdays()).thenReturn(List.of(closed));

        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);

        TimePeriod period = new TimePeriod(
                LocalDateTime.of(2025, 7, 22, 10, 0), // 화요일 (휴무일)
                LocalDateTime.of(2025, 7, 22, 12, 0)
        );

        Map<RoutiePlace, TimePeriod> map = Map.of(routiePlace, period);

        // when
        boolean result = calculator.calculateValidity(map, ValidationStrategy.IS_NOT_CLOSED_DAY);

        // then
        assertFalse(result);
    }

    @Test
    void calculateValidity_shouldReturnFalse_whenEndDayIsClosed() {
        // given
        PlaceClosedWeekday closed = new PlaceClosedWeekday(DayOfWeek.WEDNESDAY);
        Place place = mock(Place.class);
        when(place.getClosedWeekdays()).thenReturn(List.of(closed));

        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);

        TimePeriod period = new TimePeriod(
                LocalDateTime.of(2025, 7, 22, 23, 0), // 화요일
                LocalDateTime.of(2025, 7, 23, 1, 0)   // 수요일 (휴무일)
        );

        Map<RoutiePlace, TimePeriod> map = Map.of(routiePlace, period);

        // when
        boolean result = calculator.calculateValidity(map, ValidationStrategy.IS_NOT_CLOSED_DAY);

        // then
        assertFalse(result);
    }

    @Test
    void calculateValidity_shouldReturnTrue_whenStartAndEndDaysAreOpen() {
        // given
        PlaceClosedWeekday closed = new PlaceClosedWeekday(DayOfWeek.MONDAY); // 월요일만 휴무
        Place place = mock(Place.class);
        when(place.getClosedWeekdays()).thenReturn(List.of(closed));

        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);

        TimePeriod period = new TimePeriod(
                LocalDateTime.of(2025, 7, 22, 10, 0), // 화요일
                LocalDateTime.of(2025, 7, 23, 10, 0)  // 수요일
        );

        Map<RoutiePlace, TimePeriod> map = Map.of(routiePlace, period);

        // when
        boolean result = calculator.calculateValidity(map, ValidationStrategy.IS_NOT_CLOSED_DAY);

        // then
        assertTrue(result);
    }
}
