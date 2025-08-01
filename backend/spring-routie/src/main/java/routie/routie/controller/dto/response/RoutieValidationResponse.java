package routie.routie.controller.dto.response;

import java.util.List;
import routie.routie.domain.routievalidator.ValidationResult;

public record RoutieValidationResponse(
        List<ValidationResultResponse> validationResultResponses
) {
    public static RoutieValidationResponse from(final List<ValidationResult> validationResults) {
        return new RoutieValidationResponse(
                validationResults.stream()
                        .map(ValidationResultResponse::from)
                        .toList()
        );
    }

    public record ValidationResultResponse(
            boolean isValid,
            String strategy,
            String message
    ) {
        public static ValidationResultResponse from(final ValidationResult validationResult) {
            return new ValidationResultResponse(
                    validationResult.isValid(),
                    validationResult.strategy(),
                    validationResult.message()
            );
        }
    }
}
