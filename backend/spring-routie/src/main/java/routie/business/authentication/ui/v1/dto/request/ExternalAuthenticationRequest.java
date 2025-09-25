package routie.business.authentication.ui.v1.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record ExternalAuthenticationRequest(
        @JsonProperty("code") @NotBlank String code,
        @JsonProperty("provider") @NotBlank String providerName
) {
}
