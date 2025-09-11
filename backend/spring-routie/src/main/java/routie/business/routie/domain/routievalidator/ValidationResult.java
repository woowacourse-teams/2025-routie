package routie.business.routie.domain.routievalidator;

import java.util.List;
import routie.global.exception.BusinessException;
import routie.global.exception.ErrorCode;
import routie.business.routie.domain.RoutiePlace;

public record ValidationResult(
        boolean isValid,
        ValidationStrategy strategy,
        List<RoutiePlace> invalidRoutiePlaces
) {

    public ValidationResult {
        if (strategy == null) {
            throw new BusinessException(ErrorCode.VALIDATION_STRATEGY_NULL);
        }
        if (invalidRoutiePlaces == null) {
            throw new BusinessException(ErrorCode.INVALID_PLACES_COLLECTION_NULL);
        }
    }

    public static ValidationResult withoutRoutiePlaces(final boolean isValid, final ValidationStrategy strategy) {
        return new ValidationResult(isValid, strategy, List.of());
    }
}
