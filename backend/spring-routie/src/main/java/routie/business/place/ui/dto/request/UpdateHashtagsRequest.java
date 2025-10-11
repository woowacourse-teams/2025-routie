package routie.business.place.ui.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateHashtagsRequest(
        @NotNull List<String> hashtags
) {
}
