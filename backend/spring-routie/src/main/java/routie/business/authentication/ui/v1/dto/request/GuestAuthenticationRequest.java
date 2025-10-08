package routie.business.authentication.ui.v1.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record GuestAuthenticationRequest(
        @JsonProperty("nickname") @NotBlank String nickname,
        @JsonProperty("password") String password,
        @JsonProperty("routieSpaceIdentifier") @NotBlank String routieSpaceIdentifier
) {
}
