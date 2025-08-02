package routie.routie.controller.dto.response;

import java.util.List;
import routie.routie.domain.RoutiePlace;
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
            String strategy,
            String code,
            boolean isValid,
            List<RoutiePlaceResponse> invalidRoutiePlaces
    ) {
        public static ValidationResultResponse from(final ValidationResult validationResult) {
            return new ValidationResultResponse(
                    validationResult.strategy().getName(),
                    validationResult.strategy().name(),
                    validationResult.isValid(),
                    validationResult.invalidRoutiePlaces().stream()
                            .map(RoutiePlaceResponse::from)
                            .toList()
            );
        }
    }

    public record RoutiePlaceResponse(
            long routiePlaceId
    ) {
        public static RoutiePlaceResponse from(final RoutiePlace routiePlace) {
            return new RoutiePlaceResponse(routiePlace.getId());
        }
    }
}
