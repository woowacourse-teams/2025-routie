package routie.business.participant.ui.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.business.authentication.ui.argument.annotation.AuthenticatedUser;
import routie.business.participant.domain.User;
import routie.business.participant.ui.dto.response.UserInformationResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/users")
public class UserControllerV1 {

    @GetMapping("/me")
    public ResponseEntity<UserInformationResponse> getMyInformation(
            @AuthenticatedUser final User user
    ) {
        return ResponseEntity.ok(UserInformationResponse.from(user));
    }
}
