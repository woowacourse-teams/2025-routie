package routie.business.word.ui.dto;

import jakarta.validation.constraints.NotBlank;

public record WordCreateRequest(
        @NotBlank String content
) {
}
