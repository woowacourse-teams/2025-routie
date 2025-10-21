package routie.business.hashtag.ui.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.hashtag.application.HashtagService;
import routie.business.hashtag.ui.dto.response.HashtagHistoryResponse;
import routie.business.hashtag.ui.dto.response.HashtagsResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/routie-spaces/{routieSpaceIdentifier}/hashtags")
public class HashtagControllerV1 {

    private final HashtagService hashtagService;

    @GetMapping
    public ResponseEntity<HashtagsResponse> getHashtags(@PathVariable final String routieSpaceIdentifier) {
        final HashtagsResponse hashtagsResponse = hashtagService.getHashtagsByRoutieSpace(routieSpaceIdentifier);
        return ResponseEntity.ok(hashtagsResponse);
    }

    @GetMapping("/history")
    public ResponseEntity<HashtagHistoryResponse> readHashtagHistory(@PathVariable final String routieSpaceIdentifier) {
        final HashtagHistoryResponse hashtagHistoryResponse = hashtagService.getHashtagHistory(routieSpaceIdentifier);
        return ResponseEntity.ok(hashtagHistoryResponse);
    }

    @DeleteMapping("/{hashtagId}")
    public ResponseEntity<Void> deleteHashtag(
            @PathVariable final String routieSpaceIdentifier,
            @PathVariable final Long hashtagId
    ) {
        hashtagService.removeHashtag(routieSpaceIdentifier, hashtagId);
        return ResponseEntity.noContent().build();
    }
}
