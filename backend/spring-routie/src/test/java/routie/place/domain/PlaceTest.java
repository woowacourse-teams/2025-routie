package routie.place.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import routie.routiespace.domain.RoutieSpace;

class PlaceTest {

    private final RoutieSpace routieSpace = RoutieSpace.from(() -> "test-identifier");

    @Test
    @DisplayName("브레이크 타임이 모두 있을 때 생성 성공")
    void createPlaceWithFullBreakTimeSuccess() {
        // given

        // when
        Place place = Place.create(
                "스타벅스",
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                routieSpace,
                List.of(DayOfWeek.SUNDAY)
        );

        // then
        assertThat(place.getName()).isEqualTo("스타벅스");
        assertThat(place.getBreakStartAt()).isEqualTo(LocalTime.of(14, 0));
        assertThat(place.getBreakEndAt()).isEqualTo(LocalTime.of(15, 0));
    }

    @Test
    @DisplayName("브레이크 타임이 모두 없을 때 생성 성공")
    void createPlaceWithoutBreakTimeSuccess() {
        // given
        LocalTime breakStartAt = null;
        LocalTime breakEndAt = null;

        // when
        Place place = Place.create(
                "편의점",
                "서울시 강남구",
                10.123,
                10.123,
                30,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                breakStartAt,
                breakEndAt,
                routieSpace,
                List.of()
        );

        // then
        assertThat(place.getName()).isEqualTo("편의점");
        assertThat(place.getBreakStartAt()).isNull();
        assertThat(place.getBreakEndAt()).isNull();
    }

    @Test
    @DisplayName("체류 시간이 0 미만일 경우 실패")
    void createPlaceWithNegativeStayDurationFail() {
        // given
        int lowStayDuration = -1;

        // when & then
        assertThatThrownBy(() -> Place.create(
                "카페",
                "서울시 강남구",
                10.123,
                10.123,
                lowStayDuration,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                null,
                null,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("체류 시간이 1440 초과일 경우 실패")
    void createPlaceWithExcessiveStayDurationFail() {
        // given
        int hugeStayDuration = 1441;

        // when & then
        assertThatThrownBy(() -> Place.create(
                "카페",
                "서울시 강남구",
                10.123,
                10.123,
                hugeStayDuration,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                null,
                null,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("장소명이 null일 경우 실패")
    void createPlaceWithNullNameFail() {
        // given
        String nullName = null;

        // when & then
        assertThatThrownBy(() -> Place.create(
                nullName,
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                null,
                null,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("장소명이 공백일 경우 실패")
    void createPlaceWithBlankNameFail() {
        // given
        String blankName = "   ";

        // when & then
        assertThatThrownBy(() -> Place.create(
                blankName,
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                null,
                null,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("장소명이 31자일 경우 실패")
    void createPlaceWith31CharacterNameFail() {
        // given
        String longName = "a".repeat(31);

        // when & then
        assertThatThrownBy(() -> Place.create(
                longName,
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                null,
                null,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("브레이크 시작 시간만 입력한 경우 실패")
    void createPlaceWithOnlyBreakStartTimeFail() {
        // given
        LocalTime breakEndAt = null;

        // when & then
        assertThatThrownBy(() -> Place.create(
                "카페",
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                LocalTime.of(14, 0),
                breakEndAt,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("브레이크 종료 시간만 입력한 경우 실패")
    void createPlaceWithOnlyBreakEndTimeFail() {
        // given
        LocalTime breakStartAt = null;

        assertThatThrownBy(() -> Place.create(
                "카페",
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                breakStartAt,
                LocalTime.of(15, 0),
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("브레이크 타임이 유요하지 않은 경우 실패 : 영업 시간 10-22, 브레이크타임 9-11")
    void createPlaceWithBreakTimeStartingBeforeOpenTimeFail() {
        // given
        LocalTime breakStartAt = LocalTime.of(9, 0);
        LocalTime breakEndAt = LocalTime.of(11, 0);

        // when & then
        assertThatThrownBy(() -> Place.create(
                "카페",
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                breakStartAt,
                breakEndAt,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("브레이크 타임이 유요하지 않은 경우 실패 : 영업 시간 10-22, 브레이크타임 9-10")
    void createPlaceWithBreakTimePartiallyBeforeOpenTimeFail() {
        // given
        LocalTime breakStartAt = LocalTime.of(9, 0);
        LocalTime breakEndAt = LocalTime.of(10, 0);

        // when & then
        assertThatThrownBy(() -> Place.create(
                "카페",
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                breakStartAt,
                breakEndAt,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("브레이크 타임이 유요하지 않은 경우 실패 : 영업 시간 10-22, 브레이크타임 21-23")
    void createPlaceWithBreakTimeEndingAfterCloseTimeFail() {
        // given
        LocalTime breakStartAt = LocalTime.of(21, 0);
        LocalTime breakEndAt = LocalTime.of(23, 0);

        // when & then
        assertThatThrownBy(() -> Place.create(
                "카페",
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                breakStartAt,
                breakEndAt,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("브레이크 타임이 유요하지 않은 경우 실패 : 영업 시간 10-22, 브레이크타임 22-23")
    void createPlaceWithBreakTimeStartingAtCloseTimeFail() {
        // given
        LocalTime breakStartAt = LocalTime.of(22, 0);
        LocalTime breakEndAt = LocalTime.of(23, 0);

        // when & then
        assertThatThrownBy(() -> Place.create(
                "카페",
                "서울시 강남구",
                10.123,
                10.123,
                60,
                LocalTime.of(10, 0),
                LocalTime.of(22, 0),
                breakStartAt,
                breakEndAt,
                routieSpace,
                null
        )).isInstanceOf(IllegalArgumentException.class);
    }
}
