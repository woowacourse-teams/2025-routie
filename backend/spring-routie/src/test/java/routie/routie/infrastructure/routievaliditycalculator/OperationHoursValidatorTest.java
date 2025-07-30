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
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;

class OperationHoursValidatorTest {

    private final OperationHoursValidator calculator = new OperationHoursValidator();

    @Test
    @DisplayName("영업시간이 설정되지 않은 경우 항상 유효하다")
    void shouldReturnTrueWhenNoBusinessHoursSet() {
        // given
        Place place = createMockPlace(null, null);
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 10, 0),
                LocalDateTime.of(2024, 1, 1, 11, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("문 여는 시간에 도착하는 것은 유효하다")
    void shouldReturnTrueWhenArriveAtOpeningTime() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 9, 0),
                LocalDateTime.of(2024, 1, 1, 10, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("문 닫는 시간에 떠나는 것은 유효하다")
    void shouldReturnTrueWhenDepartAtClosingTime() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 17, 0),
                LocalDateTime.of(2024, 1, 1, 18, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("영업시간 내 방문은 유효하다")
    void shouldReturnTrueWhenVisitDuringBusinessHours() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 10, 0),
                LocalDateTime.of(2024, 1, 1, 17, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("문 열기 직전에 도착하는 것은 무효하다")
    void shouldReturnFalseWhenArriveJustBeforeOpening() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 8, 59),
                LocalDateTime.of(2024, 1, 1, 10, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("문 닫은 후에 떠나는 것은 무효하다")
    void shouldReturnFalseWhenDepartJustAfterClosing() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 17, 0),
                LocalDateTime.of(2024, 1, 1, 18, 1)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("문 열기 전에 도착해서 문 열고 나서 떠나는 것은 무효하다")
    void shouldReturnFalseWhenArriveBeforeOpeningAndStayAfterOpening() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 8, 30),
                LocalDateTime.of(2024, 1, 1, 10, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("문 닫기 전에 도착해서 문 닫은 후에 떠나는 것은 무효하다")
    void shouldReturnFalseWhenArriveBeforeClosingAndStayAfterClosing() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 17, 30),
                LocalDateTime.of(2024, 1, 1, 19, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("영업시간 전체를 커버하는 방문은 유효하다")
    void shouldReturnTrueWhenVisitCoversEntireBusinessHours() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 9, 0),
                LocalDateTime.of(2024, 1, 1, 18, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("영업 시간 외 방문은 무효하다")
    void shouldReturnFalseWhenVisitInEarlyMorning() {
        // given
        Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                LocalDateTime.of(2024, 1, 1, 6, 0),
                LocalDateTime.of(2024, 1, 1, 7, 0)
        );
        Map<RoutiePlace, TimePeriod> timePeriodMap = Map.of(routiePlace, timePeriod);
        ValidationContext validationContext = new ValidationContext(null, null, timePeriodMap);

        // when
        boolean result = calculator.isValid(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result).isFalse();
    }

    private Place createMockPlace(final LocalTime openAt, final LocalTime closeAt) {
        Place place = mock(Place.class);
        when(place.getOpenAt()).thenReturn(openAt);
        when(place.getCloseAt()).thenReturn(closeAt);
        return place;
    }

    private RoutiePlace createMockRoutiePlace(final Place place) {
        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);
        return routiePlace;
    }
}
