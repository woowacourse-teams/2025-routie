package routie.routie.infrastructure.routievalidator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import routie.place.domain.Place;
import routie.place.domain.PlaceClosedDayOfWeek;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationResult;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriod;
import routie.routie.domain.timeperiod.TimePeriods;

class ClosedDayValidatorTest {

    private final ClosedDayValidator validator = new ClosedDayValidator();

    @Test
    @DisplayName("모든 장소가 영업일이면, 검증에 성공하고 invalid 목록은 비어 있어야 한다")
    void validate_shouldReturnValidResult_whenAllDaysAreOpen() {
        // given
        Place place = mock(Place.class);
        when(place.getPlaceClosedDayOfWeeks()).thenReturn(List.of());
        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);

        TimePeriod period = new TimePeriod(
                routiePlace,
                LocalDateTime.of(2025, 8, 19, 10, 0), // 화요일
                LocalDateTime.of(2025, 8, 19, 12, 0)
        );

        TimePeriods timePeriods = mock(TimePeriods.class);
        when(timePeriods.orderedList()).thenReturn(List.of(period));

        LocalDateTime startTime = LocalDateTime.of(2025, 8, 19, 0, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 8, 20, 0, 0);
        ValidationContext validationContext = new ValidationContext(startTime, endTime, timePeriods);

        // when
        ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_CLOSED_DAY);

        // then
        assertTrue(result.isValid());
        assertTrue(result.invalidRoutiePlaces().isEmpty());
    }

    @Test
    @DisplayName("시작일이 휴무일이면, 검증에 실패하고 해당 RoutiePlace를 invalid 목록에 포함해야 한다")
    void validate_shouldReturnInvalidResult_whenStartDayIsClosed() {
        // given
        PlaceClosedDayOfWeek closed = new PlaceClosedDayOfWeek(DayOfWeek.TUESDAY);
        Place place = mock(Place.class);
        when(place.getPlaceClosedDayOfWeeks()).thenReturn(List.of(closed));
        RoutiePlace routiePlace = mock(RoutiePlace.class);
        when(routiePlace.getPlace()).thenReturn(place);

        TimePeriod period = new TimePeriod(
                routiePlace,
                LocalDateTime.of(2025, 8, 19, 10, 0), // 화요일 (휴무일)
                LocalDateTime.of(2025, 8, 19, 12, 0)
        );

        TimePeriods timePeriods = mock(TimePeriods.class);
        when(timePeriods.orderedList()).thenReturn(List.of(period));

        LocalDateTime startTime = LocalDateTime.of(2025, 8, 19, 0, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 8, 20, 0, 0);
        ValidationContext validationContext = new ValidationContext(startTime, endTime, timePeriods);

        // when
        ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_CLOSED_DAY);

        // then
        assertFalse(result.isValid());
        assertEquals(1, result.invalidRoutiePlaces().size());
        assertTrue(result.invalidRoutiePlaces().contains(routiePlace));
    }

    @Test
    @DisplayName("여러 장소 중 일부만 휴무일일 때, 위반한 RoutiePlace만 invalid 목록에 포함해야 한다")
    void validate_shouldReturnInvalidRoutiePlaces_whenSomePlacesAreOnClosedDays() {
        // given
        Place openPlace = mock(Place.class);
        when(openPlace.getPlaceClosedDayOfWeeks()).thenReturn(List.of());
        RoutiePlace validRoutiePlace = mock(RoutiePlace.class);
        when(validRoutiePlace.getPlace()).thenReturn(openPlace);
        TimePeriod validPeriod = new TimePeriod(validRoutiePlace, LocalDateTime.of(2025, 8, 20, 10, 0),
                LocalDateTime.of(2025, 8, 20, 12, 0));

        Place closedPlace = mock(Place.class);
        when(closedPlace.getPlaceClosedDayOfWeeks()).thenReturn(List.of(new PlaceClosedDayOfWeek(DayOfWeek.TUESDAY)));
        RoutiePlace invalidRoutiePlace = mock(RoutiePlace.class);
        when(invalidRoutiePlace.getPlace()).thenReturn(closedPlace);
        TimePeriod invalidPeriod = new TimePeriod(invalidRoutiePlace, LocalDateTime.of(2025, 8, 19, 14, 0),
                LocalDateTime.of(2025, 8, 19, 16, 0));

        TimePeriods timePeriods = mock(TimePeriods.class);
        when(timePeriods.orderedList()).thenReturn(List.of(validPeriod, invalidPeriod));

        LocalDateTime startTime = LocalDateTime.of(2025, 8, 19, 0, 0);
        LocalDateTime endTime = LocalDateTime.of(2025, 8, 21, 0, 0);
        ValidationContext validationContext = new ValidationContext(startTime, endTime, timePeriods);

        // when
        ValidationResult result = validator.validate(validationContext, ValidationStrategy.IS_NOT_CLOSED_DAY);

        // then
        assertFalse(result.isValid());
        assertEquals(1, result.invalidRoutiePlaces().size());
        assertTrue(result.invalidRoutiePlaces().contains(invalidRoutiePlace));
        assertFalse(result.invalidRoutiePlaces().contains(validRoutiePlace));
    }
}
