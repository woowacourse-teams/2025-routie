package routie.routie.infrastructure.routievalidator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import routie.place.domain.Place;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationResult;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;
import routie.routie.domain.timeperiod.TimePeriods;

@Disabled("검증 기능 제거에 따른 비활성화")
class OperationHoursValidatorTest {

    private final OperationHoursValidator validator = new OperationHoursValidator();

    private Place createMockPlace(final LocalTime openAt, final LocalTime closeAt) {
        Place place = mock(Place.class);
        return place;
    }

    private RoutiePlace createMockRoutiePlace(final Place place) {
        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);
        return routiePlace;
    }

    private ValidationContext createValidationContext(final TimePeriod... periods) {
        TimePeriods timePeriods = mock(TimePeriods.class);
        when(timePeriods.orderedList()).thenReturn(List.of(periods));

        if (periods.length == 0) {
            return new ValidationContext(LocalDateTime.now(), LocalDateTime.now().plusDays(1), timePeriods);
        }

        LocalDateTime overallStart = Arrays.stream(periods)
                .map(TimePeriod::startTime)
                .min(Comparator.naturalOrder())
                .orElseThrow();
        LocalDateTime overallEnd = Arrays.stream(periods)
                .map(TimePeriod::endTime)
                .max(Comparator.naturalOrder())
                .orElseThrow();

        return new ValidationContext(overallStart, overallEnd, timePeriods);
    }

    @Test
    @DisplayName("영업시간이 설정되지 않은 경우 항상 유효하며, invalid 목록은 비어있다")
    void shouldReturnValidAndEmptyWhenNoBusinessHoursSet() {
        // given
        Place place = createMockPlace(null, null);
        RoutiePlace routiePlace = createMockRoutiePlace(place);
        TimePeriod timePeriod = new TimePeriod(
                routiePlace,
                LocalDateTime.of(2024, 1, 1, 10, 0),
                LocalDateTime.of(2024, 1, 1, 11, 0)
        );
        ValidationContext validationContext = createValidationContext(timePeriod);

        // when
        ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

        // then
        assertThat(result.isValid()).isTrue();
        assertThat(result.invalidRoutiePlaces()).isEmpty();
    }

    @Nested
    @DisplayName("일반 영업시간 (예: 09:00 ~ 18:00)")
    class NormalBusinessHours {

        private final LocalTime openAt = LocalTime.of(9, 0);
        private final LocalTime closeAt = LocalTime.of(18, 0);

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
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext,
                    ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

            // then
            assertThat(result.isValid()).isTrue();
            assertThat(result.invalidRoutiePlaces()).isEmpty();
        }

        @Test
        @DisplayName("문 열기 전에 도착하면 무효하며, 해당 장소를 invalid 목록에 포함한다")
        void shouldReturnFalseWhenArriveBeforeOpening() {
            // given
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 8, 30), // openAt(09:00) 이전
                    LocalDateTime.of(2024, 1, 1, 10, 0)
            );
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext,
                    ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

            // then
            assertThat(result.isValid()).isFalse();
            assertThat(result.invalidRoutiePlaces()).containsExactly(routiePlace);
        }
    }

    @Nested
    @DisplayName("자정을 넘기는 영업시간 (예: 20:00 ~ 익일 02:00)")
    class OvernightBusinessHours {

        private final LocalTime openAt = LocalTime.of(20, 0);
        private final LocalTime closeAt = LocalTime.of(2, 0);

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
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext,
                    ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

            // then
            assertThat(result.isValid()).isTrue();
            assertThat(result.invalidRoutiePlaces()).isEmpty();
        }

        @Test
        @DisplayName("영업하지 않는 낮 시간에 방문하면 무효하며, 해당 장소를 invalid 목록에 포함한다")
        void shouldReturnFalseForDaytimeVisit() {
            // given: 14:00 ~ 15:00 방문
            Place place = createMockPlace(openAt, closeAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 14, 0),
                    LocalDateTime.of(2024, 1, 1, 15, 0)
            );
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext,
                    ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

            // then
            assertThat(result.isValid()).isFalse();
            assertThat(result.invalidRoutiePlaces()).containsExactly(routiePlace);
        }
    }

    @Nested
    @DisplayName("여러 장소 동시 검증")
    class MultiplePlacesValidation {

        @Test
        @DisplayName("유효/무효 장소가 섞여있을 때, 무효한 장소만 invalid 목록에 포함해야 한다")
        void validate_shouldReturnOnlyInvalidPlaces_whenMixed() {
            // given
            LocalTime openAt = LocalTime.of(9, 0);
            LocalTime closeAt = LocalTime.of(18, 0);

            // 1. 유효한 장소 (10:00 ~ 11:00 방문)
            Place validPlace = createMockPlace(openAt, closeAt);
            RoutiePlace validRoutiePlace = createMockRoutiePlace(validPlace);
            TimePeriod validPeriod = new TimePeriod(
                    validRoutiePlace,
                    LocalDateTime.of(2024, 1, 1, 10, 0),
                    LocalDateTime.of(2024, 1, 1, 11, 0)
            );

            // 2. 무효한 장소 (08:00 ~ 10:00 방문)
            Place invalidPlace = createMockPlace(openAt, closeAt);
            RoutiePlace invalidRoutiePlace = createMockRoutiePlace(invalidPlace);
            TimePeriod invalidPeriod = new TimePeriod(
                    invalidRoutiePlace,
                    LocalDateTime.of(2024, 1, 1, 8, 0),
                    LocalDateTime.of(2024, 1, 1, 10, 0)
            );

            ValidationContext validationContext = createValidationContext(validPeriod, invalidPeriod);

            // when
            ValidationResult result = validator.validate(validationContext,
                    ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

            // then
            assertThat(result.isValid()).isFalse();
            assertThat(result.invalidRoutiePlaces())
                    .hasSize(1)
                    .containsExactly(invalidRoutiePlace);
        }
    }

    @Nested
    @Disabled
    @DisplayName("일정이 하루를 초과할 수 있도록 정책이 수정되면 필요할 엣지 케이스")
    class EdgeCasesForLogicFlaw {

        @Test
        @DisplayName("일반 영업장에서 영업 종료 시간을 걸쳐 1박 방문 시 무효 처리되어야 한다")
        void validate_shouldReturnInvalid_whenVisitSpansOvernightClosingTime() {
            // given
            // 영업 시간: 09:00 ~ 18:00
            // 방문 시간: 19일 17:00 ~ 20일 10:00
            // 현재 로직은 시작(17:00)과 종료(10:00)가 모두 유효하므로 이 방문을 '유효'하다고 판단함
            Place place = createMockPlace(LocalTime.of(9, 0), LocalTime.of(18, 0));
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 19, 17, 0),
                    LocalDateTime.of(2024, 1, 20, 10, 0)
            );
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext,
                    ValidationStrategy.IS_WITHIN_OPERATION_HOURS);

            // then
            assertThat(result.isValid()).isFalse();
            assertThat(result.invalidRoutiePlaces()).containsExactly(routiePlace);
        }
    }
}
