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

class BreaktimeValidatorTest {

    private final BreaktimeValidator calculator = new BreaktimeValidator();

    @Test
    @DisplayName("브레이크 타임이 없는 경우 항상 유효하다")
    void validate_WithNoBreaktime_ShouldReturnTrue() {
        // given
        Place placeWithNoBreaktime = createMockPlace(null, null);
        RoutiePlace routiePlace = createMockRoutiePlace(placeWithNoBreaktime);
        TimePeriod timePeriod = new TimePeriod(
                routiePlace,
                LocalDateTime.of(2024, 1, 1, 12, 0),
                LocalDateTime.of(2024, 1, 1, 13, 0)
        );
        TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
        ValidationContext validationContext = createValidationContext(timePeriods);

        // when
        boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME).isValid();

        // then
        assertThat(result).isTrue();
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

    private ValidationContext createValidationContext(final TimePeriods timePeriods) {
        return new ValidationContext(
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(1),
                timePeriods
        );
    }

    @Nested
    @DisplayName("일반 브레이크 타임 (예: 12:00 ~ 13:00)")
    class NormalBreaktime {

        private final LocalTime breakStartAt = LocalTime.of(12, 0);
        private final LocalTime breakEndAt = LocalTime.of(13, 0);

        @Test
        @DisplayName("방문이 브레이크 타임 시작 정각에 끝나면 유효하다")
        void validate_WhenVisitEndsAtBreaktimeStart_ShouldReturnTrue() {
            // given
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 11, 0),
                    LocalDateTime.of(2024, 1, 1, 12, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("방문이 브레이크 타임 종료 정각에 시작되면 유효하다")
        void validate_WhenVisitStartsAtBreaktimeEnd_ShouldReturnTrue() {
            // given
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 13, 0),
                    LocalDateTime.of(2024, 1, 1, 14, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("방문이 브레이크 타임과 일부 겹치면 무효하다")
        void validate_WhenVisitOverlapsSlightlyWithBreaktime_ShouldReturnFalse() {
            // given
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 11, 30),
                    LocalDateTime.of(2024, 1, 1, 12, 1) // 1분 겹침
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("방문이 브레이크 타임 전체를 포함하면 무효하다")
        void validate_WhenVisitContainsBreaktime_ShouldReturnFalse() {
            // given
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 11, 0),
                    LocalDateTime.of(2024, 1, 1, 14, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }
    }

    @Nested
    @DisplayName("자정을 넘기는 브레이크 타임 (예: 23:00 ~ 익일 01:00)")
    class OvernightBreaktime {

        private final LocalTime breakStartAt = LocalTime.of(23, 0);
        private final LocalTime breakEndAt = LocalTime.of(1, 0);

        @Test
        @DisplayName("방문이 자정을 걸친 브레이크 타임과 겹치면 무효하다")
        void validate_WhenVisitOverlapsWithOvernightBreak_ShouldReturnFalse() {
            // given: 23:30 ~ 00:30 방문
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 23, 30),
                    LocalDateTime.of(2024, 1, 2, 0, 30)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("브레이크 타임이 아닌 낮 시간에 방문하면 유효하다")
        void validate_WhenVisitIsDuringDaytime_ShouldReturnTrue() {
            // given: 14:00 ~ 15:00 방문
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 14, 0),
                    LocalDateTime.of(2024, 1, 1, 15, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("브레이크 시작 직전까지 방문하면 유효하다")
        void validate_WhenVisitEndsAtOvernightBreakStart_ShouldReturnTrue() {
            // given: 22:00 ~ 23:00 방문
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 22, 0),
                    LocalDateTime.of(2024, 1, 1, 23, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("브레이크 종료 직후에 방문하면 유효하다")
        void validate_WhenVisitStartsAtOvernightBreakEnd_ShouldReturnTrue() {
            // given: 01:00 ~ 02:00 방문
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 2, 1, 0),
                    LocalDateTime.of(2024, 1, 2, 2, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }
    }

    // BreaktimeValidatorTest.java에 아래 @Nested 클래스를 추가하세요.

    @Nested
    @DisplayName("자정을 넘기는 방문 시간")
    class OvernightVisit {
        @Test
        @DisplayName("야간 방문이 일반 브레이크 타임과 겹치면 무효하다")
        void validate_WhenOvernightVisitOverlapsNormalBreak_ShouldReturnFalse() {
            // given
            // 브레이크: 12:00 ~ 15:00
            // 방문: 23:00 ~ 익일 13:00 (방문 시간 내에 브레이크 타임이 포함됨)
            Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(15, 0));
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 23, 0),
                    LocalDateTime.of(2024, 1, 2, 13, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("야간 방문과 야간 브레이크 타임이 겹치면 무효하다")
        void validate_WhenOvernightVisitOverlapsOvernightBreak_ShouldReturnFalse() {
            // given
            // 브레이크: 22:00 ~ 02:00
            // 방문: 01:00 ~ 03:00 (겹치는 구간: 01:00 ~ 02:00)
            Place place = createMockPlace(LocalTime.of(22, 0), LocalTime.of(2, 0));
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 2, 1, 0),
                    LocalDateTime.of(2024, 1, 2, 3, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("야간 방문과 야간 브레이크 타임이 겹치지 않으면 유효하다")
        void validate_WhenOvernightVisitDoesNotOverlapOvernightBreak_ShouldReturnTrue() {
            // given
            // 브레이크: 22:00 ~ 02:00
            // 방문: 20:00 ~ 21:00
            Place place = createMockPlace(LocalTime.of(22, 0), LocalTime.of(2, 0));
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 20, 0),
                    LocalDateTime.of(2024, 1, 1, 21, 0)
            );
            TimePeriods timePeriods = new TimePeriods(Map.of(routiePlace, timePeriod));
            ValidationContext validationContext = createValidationContext(timePeriods);

            // when
            boolean result = calculator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME)
                    .isValid();

            // then
            assertThat(result).isTrue();
        }
    }
}
