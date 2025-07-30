package routie.routie.domain.routievalidator;

public interface RoutieValidator {

    boolean supportsStrategy(ValidationStrategy validationStrategy);

    boolean isValid(
            ValidationContext validationContext,
            ValidationStrategy validationStrategy
    );
}
