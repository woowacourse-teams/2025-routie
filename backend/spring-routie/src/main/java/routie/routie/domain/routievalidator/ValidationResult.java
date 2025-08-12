package routie.routie.domain.routievalidator;

import java.util.List;
import routie.routie.domain.RoutiePlace;

public record ValidationResult(
        boolean isValid,
        ValidationStrategy strategy,
        List<RoutiePlace> invalidRoutiePlaces
) {

    public ValidationResult {
        if (strategy == null) {
            throw new IllegalArgumentException("ValidationStrategy는 null일 수 없습니다.");
        }
        if (invalidRoutiePlaces == null) {
            throw new IllegalArgumentException("유효하지 않은 RoutiePlace 목록은 null일 수 없습니다.");
        }
    }

    public static ValidationResult withoutRoutiePlaces(final boolean isValid, final ValidationStrategy strategy) {
        return new ValidationResult(isValid, strategy, List.of());
    }
}
