package routie.routie.domain.routievalidator;

import java.util.List;
import routie.routie.domain.RoutiePlace;

public record ValidationResult(
        boolean isValid,
        ValidationStrategy strategy,
        List<RoutiePlace> invalidRoutiePlaces
) {
}
