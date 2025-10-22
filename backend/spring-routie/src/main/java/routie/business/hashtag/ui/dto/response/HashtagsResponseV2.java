package routie.business.hashtag.ui.dto.response;

import java.util.List;

public record HashtagsResponseV2(
        List<HashtagResponse> hashtags
) {

    public record HashtagResponse(
            Long id,
            String name,
            Long count
    ) {
    }
}
