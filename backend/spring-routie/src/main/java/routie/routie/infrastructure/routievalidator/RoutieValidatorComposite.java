package routie.routie.infrastructure.routievalidator;

import java.util.List;
import lombok.RequiredArgsConstructor;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationResult;
import routie.routie.domain.routievalidator.ValidationStrategy;

@RequiredArgsConstructor
public class RoutieValidatorComposite implements RoutieValidator {

    private final List<RoutieValidator> routeValidators;

    @Override
    public boolean supportsStrategy(final ValidationStrategy validationStrategy) {
        return validationStrategy != null;
    }

    @Override
    public ValidationResult validate(
            final ValidationContext validationContext,
            final ValidationStrategy validationStrategy
    ) {
        return selectValidityCalculator(validationStrategy).validate(
                validationContext,
                validationStrategy
        );
    }

    private RoutieValidator selectValidityCalculator(final ValidationStrategy validationStrategy) {
        return routeValidators.stream()
                .filter(calculator -> calculator.supportsStrategy(validationStrategy))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.MOVING_STRATEGY_NOT_SUPPORTED));
    }
}
