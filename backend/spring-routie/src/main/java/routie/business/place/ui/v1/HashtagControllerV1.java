package routie.business.place.ui.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.place.application.HashtagService;
import routie.business.place.ui.dto.response.HashtagsResponse;

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
}
