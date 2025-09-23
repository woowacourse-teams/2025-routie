package routie.business.place.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import routie.business.routiespace.domain.RoutieSpace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

class PlaceTest {

    private final RoutieSpace routieSpace = RoutieSpace.from(() -> "test-identifier");

    @Test
    @DisplayName("장소 생성 성공")
    void createPlaceWithFullBreakTimeSuccess() {
        // given

        // when
        Place place = Place.create(
                "스타벅스",
                "테스트 도로명 주소",
                "테스트 지번 주소",
                10.123,
                10.123,
                routieSpace
        );

        // then
        assertThat(place.getName()).isEqualTo("스타벅스");
    }

    @Test
    @DisplayName("장소명이 null일 경우 실패")
    void createPlaceWithNullNameFail() {
        // given
        String nullName = null;

        // when & then
        assertThatThrownBy(() -> Place.create(
                nullName,
                "테스트 도로명 주소",
                "테스트 지번 주소",
                10.123,
                10.123,
                routieSpace
        )).isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.PLACE_NAME_REQUIRED.getMessage());
    }

    @Test
    @DisplayName("장소명이 공백일 경우 실패")
    void createPlaceWithBlankNameFail() {
        // given
        String blankName = "   ";

        // when & then
        assertThatThrownBy(() -> Place.create(
                blankName,
                "테스트 도로명 주소",
                "테스트 지번 주소",
                10.123,
                10.123,
                routieSpace
        )).isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.PLACE_NAME_REQUIRED.getMessage());
    }

    @Test
    @DisplayName("장소명이 31자일 경우 실패")
    void createPlaceWith31CharacterNameFail() {
        // given
        String longName = "a".repeat(31);

        // when & then
        assertThatThrownBy(() -> Place.create(
                longName,
                "테스트 도로명 주소",
                "테스트 지번 주소",
                10.123,
                10.123,
                routieSpace
        )).isInstanceOf(BusinessException.class)
                .hasMessage(ErrorCode.PLACE_NAME_LENGTH_INVALID.getMessage());
    }
}
