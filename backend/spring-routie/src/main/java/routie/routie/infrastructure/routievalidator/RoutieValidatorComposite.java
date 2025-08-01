package routie.routie.infrastructure.routievalidator;

import java.util.ArrayList;
import java.util.List;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;

public class RoutieValidatorComposite implements RoutieValidator {

    private final List<RoutieValidator> routeValidators;

    public RoutieValidatorComposite(final List<RoutieValidator> routeValidator) {
        this.routeValidators = new ArrayList<>(routeValidator);
    }

    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy != null;
    }

    @Override
    public boolean isValid(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        return selectValidityCalculator(validationStrategy).isValid(
                validationContext,
                validationStrategy
        );
    }

    private RoutieValidator selectValidityCalculator(final ValidationStrategy validationStrategy) {
        return routeValidators.stream()
                .filter(calculator -> calculator.supportsStrategy(validationStrategy))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 검증 방식입니다: " + validationStrategy));
    }
}
