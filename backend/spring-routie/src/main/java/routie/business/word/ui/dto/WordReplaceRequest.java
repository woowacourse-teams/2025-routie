package routie.business.word.ui.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record WordReplaceRequest(
        @NotNull List<@NotBlank String> contents
) {
}
