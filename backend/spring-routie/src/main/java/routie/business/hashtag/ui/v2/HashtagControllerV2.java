package routie.business.hashtag.ui.v2;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.hashtag.application.HashtagService;
import routie.business.hashtag.ui.dto.response.HashtagsResponseV2;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v2/routie-spaces/{routieSpaceIdentifier}/hashtags")
public class HashtagControllerV2 {

    private final HashtagService hashtagService;

    @GetMapping
    public ResponseEntity<HashtagsResponseV2> readHashtags(@PathVariable final String routieSpaceIdentifier) {
        final HashtagsResponseV2 hashtagsResponse = hashtagService.getHashtagsByRoutieSpaceV2(routieSpaceIdentifier);
        return ResponseEntity.ok(hashtagsResponse);
    }
}
