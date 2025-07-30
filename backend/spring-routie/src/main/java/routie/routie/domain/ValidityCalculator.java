package routie.routie.domain;

public interface ValidityCalculator {

    boolean supportsStrategy(ValidationStrategy validationStrategy);

    boolean calculateValidity(
            ValidationContext validationContext,
            ValidationStrategy validationStrategy
    );
}
