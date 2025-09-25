package routie.business.user.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.authentication.ui.argument.AuthenticatedUser;
import routie.business.user.domain.User;
import routie.business.user.ui.dto.response.UserInformationResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<UserInformationResponse> getMyInformation(
            @AuthenticatedUser final User user
    ) {
        return ResponseEntity.ok(UserInformationResponse.from(user));
    }
}
