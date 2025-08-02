package routie.routie.domain.routievalidator;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ValidationStrategy {

    IS_WITHIN_TOTAL_TIME("루티 전체 시간 초과 여부"),
    IS_NOT_CLOSED_DAY("휴무일 방문 여부"),
    IS_WITHIN_OPERATION_HOURS("운영 시간 내 방문 여부"),
    IS_NOT_DURING_BREAKTIME("브레이크 타임 방문 여부");

    private final String name;
}
