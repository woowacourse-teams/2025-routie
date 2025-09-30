package routie.business.like.ui.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.like.application.PlaceLikeService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/routie-spaces/{routieSpaceIdentifier}/places/{placeId}")
public class PlaceLikeControllerV1 {

    private final PlaceLikeService placeLikeService;

    @PostMapping("/likes")
    public ResponseEntity<Void> like(
            @PathVariable final Long placeId,
            @PathVariable final String routieSpaceIdentifier
    ) {
        placeLikeService.likePlace(placeId, routieSpaceIdentifier);
        return ResponseEntity.ok().build();
    }
}
