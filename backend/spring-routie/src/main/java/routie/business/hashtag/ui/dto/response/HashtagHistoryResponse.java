package routie.business.hashtag.ui.dto.response;

import java.util.List;
import routie.business.hashtag.domain.Hashtag;

public record HashtagHistoryResponse(
        List<String> hashtags
) {

    public static HashtagHistoryResponse from(final List<Hashtag> hashtags) {
        final List<String> hashtagNames = hashtags.stream()
                .map(Hashtag::getName)
                .toList();
        return new HashtagHistoryResponse(hashtagNames);
    }
}
