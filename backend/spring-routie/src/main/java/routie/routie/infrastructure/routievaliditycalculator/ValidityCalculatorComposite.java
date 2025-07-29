package routie.routie.infrastructure.routievaliditycalculator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.ValidationStrategy;
import routie.routie.domain.ValidityCalculator;
import routie.routie.domain.timeperiod.TimePeriod;

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
            final Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace,
            final ValidationStrategy validationStrategy
    ) {
        return selectValidityCalculator(validationStrategy).calculateValidity(
                timePeriodByRoutiePlace,
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
