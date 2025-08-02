package routie.routie.domain.routievalidator;

import java.util.List;
import routie.routie.domain.RoutiePlace;

public record ValidationResult(
        boolean isValid,
        ValidationStrategy strategy,
        List<RoutiePlace> invalidRoutiePlaces
) {
    public static ValidationResult withoutRoutiePlaces(final boolean isValid, final ValidationStrategy strategy) {
        return new ValidationResult(isValid, strategy, List.of());
    }
}
