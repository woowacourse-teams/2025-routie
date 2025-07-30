package routie.routie.domain.routievalidator;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ValidationStrategy {

    IS_WITHIN_TOTAL_TIME("장소 방문 종료 시각이 루티 종료 시각을 초과합니다"),
    IS_NOT_CLOSED_DAY("휴무일에 방문하는 장소가 있습니다"),
    IS_WITHIN_OPERATION_HOURS("운영 시간 외에 방문하는 장소가 있습니다"),
    IS_NOT_DURING_BREAKTIME("브레이크 타임에 방문하는 장소가 있습니다");

    private final String failMessage;
}
