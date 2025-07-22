package routie.routiespace.controller;

import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.service.RoutieSpaceService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/routie-spaces")
public class RoutieSpaceController {

    private final RoutieSpaceService routieSpaceService;

    @PostMapping
    public ResponseEntity<Void> createRoutieSpace() {
        RoutieSpace routieSpace = routieSpaceService.addRoutieSpace();
        URI location = URI.create(String.format("/routie-spaces/%s", routieSpace.getIdentifier()));

        return ResponseEntity.created(location).build();
    }
}

