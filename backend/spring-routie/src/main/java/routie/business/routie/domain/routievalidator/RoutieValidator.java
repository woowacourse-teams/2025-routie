package routie.business.routie.domain.routievalidator;

public interface RoutieValidator {

    boolean supportsStrategy(ValidationStrategy validationStrategy);

    ValidationResult validate(
            ValidationContext validationContext,
            ValidationStrategy validationStrategy
    );
}
