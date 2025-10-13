package routie.business.hashtag.ui.dto.response;

import java.util.List;
import routie.business.hashtag.domain.Hashtag;

public record HashtagsResponse(
        List<String> hashtags
) {

    public static HashtagsResponse from(final List<Hashtag> hashtags) {
        List<String> hashtagNames = hashtags.stream()
                .map(Hashtag::getName)
                .sorted()
                .toList();
        return new HashtagsResponse(hashtagNames);
    }
}
