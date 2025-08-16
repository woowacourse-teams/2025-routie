package routie.routie.infrastructure.routievalidator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import routie.place.domain.Place;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;
import routie.routie.domain.timeperiod.TimePeriods;

class OperationHoursValidatorTest {

    private final OperationHoursValidator calculator = new OperationHoursValidator();

    @Test
    @DisplayName("영업시간이 설정되지 않은 경우 항상 유효하다")
    void shouldReturnTrueWhenNoBusinessHoursSet() {
        // given
        Place place = createMockPlace(null, null);
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                routiePlace,
                LocalDateTime.of(2024, 1, 1, 10, 0),
                LocalDateTime.of(2024, 1, 1, 11, 0)
        );
        TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
        ValidationContext validationContext = new ValidationContext(
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(1),
                timePeriods
        );

        // when
        boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS).isValid();

        // then
        assertThat(result).isTrue();
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

    private ValidationContext createValidationContext(final TimePeriods timePeriods) {
        return new ValidationContext(
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(1),
                timePeriods
        );
    }

    @Nested
    @DisplayName("일반 영업시간 (예: 09:00 ~ 18:00)")
    class NormalBusinessHours {

        private final LocalTime openAt = LocalTime.of(9, 0);
        private final LocalTime closeAt = LocalTime.of(18, 0);

        @Test
        @DisplayName("문 여는 시간에 도착하는 것은 유효하다")
        void shouldReturnTrueWhenArriveAtOpeningTime() {
            // given
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 9, 0),
                    LocalDateTime.of(2024, 1, 1, 10, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("문 닫는 시간에 떠나는 것은 유효하다")
        void shouldReturnTrueWhenDepartAtClosingTime() {
            // given
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 17, 0),
                    LocalDateTime.of(2024, 1, 1, 18, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("영업시간 내 방문은 유효하다")
        void shouldReturnTrueWhenVisitDuringBusinessHours() {
            // given
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 10, 0),
                    LocalDateTime.of(2024, 1, 1, 17, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("문 열기 전에 도착해서 문 열고 나서 떠나는 것은 무효하다")
        void shouldReturnFalseWhenArriveBeforeOpeningAndStayAfterOpening() {
            // given
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 8, 30),
                    LocalDateTime.of(2024, 1, 1, 10, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("문 닫기 전에 도착해서 문 닫은 후에 떠나는 것은 무효하다")
        void shouldReturnFalseWhenArriveBeforeClosingAndStayAfterClosing() {
            // given
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 17, 30),
                    LocalDateTime.of(2024, 1, 1, 19, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }
    }

    @Nested
    @DisplayName("자정을 넘기는 영업시간 (예: 20:00 ~ 익일 02:00)")
    class OvernightBusinessHours {

        private final LocalTime openAt = LocalTime.of(20, 0);
        private final LocalTime closeAt = LocalTime.of(2, 0);

        @Test
        @DisplayName("영업 시작일 저녁 방문은 유효하다")
        void shouldReturnTrueForEveningVisit() {
            // given: 21:00 ~ 22:00 방문
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 21, 0),
                    LocalDateTime.of(2024, 1, 1, 22, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("영업 종료일 새벽 방문은 유효하다")
        void shouldReturnTrueForEarlyMorningVisit() {
            // given: 00:30 ~ 01:30 방문
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 2, 0, 30),
                    LocalDateTime.of(2024, 1, 2, 1, 30)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("자정을 걸쳐서 방문하는 것은 유효하다")
        void shouldReturnTrueForVisitSpanningMidnight() {
            // given: 23:00 ~ 01:00 방문
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 23, 0),
                    LocalDateTime.of(2024, 1, 2, 1, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }


        @Test
        @DisplayName("영업하지 않는 낮 시간에 방문하는 것은 무효하다")
        void shouldReturnFalseForDaytimeVisit() {
            // given: 14:00 ~ 15:00 방문
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 14, 0),
                    LocalDateTime.of(2024, 1, 1, 15, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("영업 종료 시간 직후에 떠나는 것은 무효하다")
        void shouldReturnFalseWhenDepartingAfterClosing() {
            // given: 01:00 ~ 02:01 방문
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 2, 1, 0),
                    LocalDateTime.of(2024, 1, 2, 2, 1)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }
    }
}
