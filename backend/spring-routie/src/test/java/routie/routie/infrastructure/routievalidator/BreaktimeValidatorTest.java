package routie.routie.infrastructure.routievalidator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
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

class BreaktimeValidatorTest {

    private final BreaktimeValidator validator = new BreaktimeValidator();

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
    @DisplayName("브레이크 타임이 없는 경우 항상 유효하며, invalid 목록은 비어있다")
    void validate_WithNoBreaktime_ShouldReturnValidAndEmpty() {
        // given
        Place placeWithNoBreaktime = createMockPlace(null, null);
        RoutiePlace routiePlace = createMockRoutiePlace(placeWithNoBreaktime);
        TimePeriod timePeriod = new TimePeriod(
                routiePlace,
                LocalDateTime.of(2024, 1, 1, 12, 0),
                LocalDateTime.of(2024, 1, 1, 13, 0)
        );
        ValidationContext validationContext = createValidationContext(timePeriod);

        // when
        ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

        // then
        assertThat(result.isValid()).isTrue();
        assertThat(result.invalidRoutiePlaces()).isEmpty();
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
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

            // then
            assertThat(result.isValid()).isTrue();
            assertThat(result.invalidRoutiePlaces()).isEmpty();
        }

        @Test
        @DisplayName("방문이 브레이크 타임과 일부 겹치면 무효하며, 해당 장소를 invalid 목록에 포함한다")
        void validate_WhenVisitOverlapsSlightlyWithBreaktime_ShouldReturnFalse() {
            // given
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 11, 30),
                    LocalDateTime.of(2024, 1, 1, 12, 1) // 1분 겹침
            );
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

            // then
            assertThat(result.isValid()).isFalse();
            assertThat(result.invalidRoutiePlaces()).containsExactly(routiePlace);
        }
    }

    @Nested
    @DisplayName("자정을 넘기는 브레이크 타임 (예: 23:00 ~ 익일 01:00)")
    class OvernightBreaktime {

        private final LocalTime breakStartAt = LocalTime.of(23, 0);
        private final LocalTime breakEndAt = LocalTime.of(1, 0);

        @Test
        @DisplayName("방문이 자정을 걸친 브레이크 타임과 겹치면 무효하며, 해당 장소를 invalid 목록에 포함한다")
        void validate_WhenVisitOverlapsWithOvernightBreak_ShouldReturnFalse() {
            // given: 23:30 ~ 00:30 방문
            Place place = createMockPlace(breakStartAt, breakEndAt);
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 23, 30),
                    LocalDateTime.of(2024, 1, 2, 0, 30)
            );
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

            // then
            assertThat(result.isValid()).isFalse();
            assertThat(result.invalidRoutiePlaces()).containsExactly(routiePlace);
        }
    }

    @Nested
    @DisplayName("자정을 넘기는 방문 시간")
    class OvernightVisit {
        @Test
        @DisplayName("야간 방문이 일반 브레이크 타임과 겹치면 무효하며, 해당 장소를 invalid 목록에 포함한다")
        void validate_WhenOvernightVisitOverlapsNormalBreak_ShouldReturnFalse() {
            // given
            // 브레이크: 12:00 ~ 15:00
            // 방문: 1/1 23:00 ~ 1/2 13:00 (방문 시간 내에 브레이크 타임이 포함됨)
            Place place = createMockPlace(LocalTime.of(12, 0), LocalTime.of(15, 0));
            RoutiePlace routiePlace = createMockRoutiePlace(place);
            TimePeriod timePeriod = new TimePeriod(
                    routiePlace,
                    LocalDateTime.of(2024, 1, 1, 23, 0),
                    LocalDateTime.of(2024, 1, 2, 13, 0)
            );
            ValidationContext validationContext = createValidationContext(timePeriod);

            // when
            ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

            // then
            assertThat(result.isValid()).isFalse();
            assertThat(result.invalidRoutiePlaces()).containsExactly(routiePlace);
        }
    }

    @Nested
    @DisplayName("여러 장소 동시 검증")
    class MultiplePlacesValidation {

        @Test
        @DisplayName("유효한 장소와 무효한 장소가 섞여 있을 때, 무효한 장소만 invalid 목록에 포함해야 한다")
        void validate_shouldReturnOnlyInvalidPlaces_whenMixed() {
            // given
            // 1. 유효한 장소 (브레이크 타임 12:00-13:00, 방문 14:00-15:00)
            Place validPlace = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
            RoutiePlace validRoutiePlace = createMockRoutiePlace(validPlace);
            TimePeriod validPeriod = new TimePeriod(
                    validRoutiePlace,
                    LocalDateTime.of(2024, 8, 20, 14, 0), // 화요일 14시
                    LocalDateTime.of(2024, 8, 20, 15, 0)
            );

            // 2. 무효한 장소 (브레이크 타임 12:00-13:00, 방문 12:30-13:30)
            Place invalidPlace = createMockPlace(LocalTime.of(12, 0), LocalTime.of(13, 0));
            RoutiePlace invalidRoutiePlace = createMockRoutiePlace(invalidPlace);
            TimePeriod invalidPeriod = new TimePeriod(
                    invalidRoutiePlace,
                    LocalDateTime.of(2024, 8, 20, 12, 30), // 화요일 12시 30분
                    LocalDateTime.of(2024, 8, 20, 13, 30)
            );

            ValidationContext validationContext = createValidationContext(validPeriod, invalidPeriod);

            // when
            ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_DURING_BREAKTIME);

            // then
            assertThat(result.isValid()).isFalse();
            assertThat(result.invalidRoutiePlaces())
                    .hasSize(1)
                    .containsExactly(invalidRoutiePlace);
        }
    }
}
