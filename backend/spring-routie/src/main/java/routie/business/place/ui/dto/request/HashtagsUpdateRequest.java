package routie.business.place.ui.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record HashtagsUpdateRequest(
        @NotNull List<String> hashtags
) {
}
