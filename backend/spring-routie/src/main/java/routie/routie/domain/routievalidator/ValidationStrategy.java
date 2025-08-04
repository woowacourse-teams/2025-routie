package routie.routie.domain.routievalidator;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ValidationStrategy {

    IS_WITHIN_TOTAL_TIME("IS_WITHIN_TOTAL_TIME"),
    IS_NOT_CLOSED_DAY("IS_NOT_CLOSED_DAY"),
    IS_WITHIN_OPERATION_HOURS("IS_WITHIN_OPERATION_HOURS"),
    IS_NOT_DURING_BREAKTIME("IS_NOT_DURING_BREAKTIME");

    private final String validationCode;
}
