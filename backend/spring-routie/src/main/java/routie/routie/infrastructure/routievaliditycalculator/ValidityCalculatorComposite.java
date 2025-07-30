package routie.routie.infrastructure.routievaliditycalculator;

import java.util.ArrayList;
import java.util.List;
import routie.routie.domain.ValidationContext;
import routie.routie.domain.ValidationStrategy;
import routie.routie.domain.ValidityCalculator;

public class ValidityCalculatorComposite implements ValidityCalculator {

    private final List<ValidityCalculator> routeValidityCalculators;

    public ValidityCalculatorComposite(final List<ValidityCalculator> routeValidityCalculator) {
        this.routeValidityCalculators = new ArrayList<>(routeValidityCalculator);
    }

    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy != null;
    }

    @Override
    public boolean calculateValidity(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        return selectValidityCalculator(validationStrategy).calculateValidity(
                validationContext,
                validationStrategy
        );
    }

    private ValidityCalculator selectValidityCalculator(final ValidationStrategy validationStrategy) {
        return routeValidityCalculators.stream()
                .filter(calculator -> calculator.supportsStrategy(validationStrategy))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 검증 방식입니다: " + validationStrategy));
    }
}
