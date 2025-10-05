package routie.business.authentication.ui.v1;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import routie.business.authentication.application.AuthenticationService;
import routie.business.authentication.ui.v1.dto.request.ExternalAuthenticationRequest;
import routie.business.authentication.ui.v1.dto.request.GuestAuthenticationRequest;
import routie.business.authentication.ui.v1.dto.response.ExternalAuthenticationResponse;
import routie.business.authentication.ui.v1.dto.response.ExternalAuthenticationUriResponse;
import routie.business.authentication.ui.v1.dto.response.GuestAuthenticationResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/authentication")
public class AuthenticationControllerV1 {

    private final AuthenticationService authenticationService;

    @GetMapping("/external/uri")
    public ResponseEntity<ExternalAuthenticationUriResponse> getExternalAuthenticationUri(
            @Valid @RequestParam("provider") final String providerName
    ) {
        ExternalAuthenticationUriResponse externalAuthenticationUriResponse =
                authenticationService.getExternalAuthenticationUri(providerName);
        return ResponseEntity.ok(externalAuthenticationUriResponse);
    }

    @PostMapping("/external")
    public ResponseEntity<ExternalAuthenticationResponse> authenticateByExternalAuthenticationProvider(
            @Valid @RequestBody final ExternalAuthenticationRequest externalAuthenticationRequest
    ) {
        ExternalAuthenticationResponse externalAuthenticationResponse =
                authenticationService.authenticateByExternalAuthenticationProvider(
                        externalAuthenticationRequest
                );
        return ResponseEntity.ok(externalAuthenticationResponse);
    }

    @PostMapping("/guest")
    public ResponseEntity<GuestAuthenticationResponse> authenticateGuest(
            @Valid @RequestBody final GuestAuthenticationRequest guestAuthenticationRequest
    ) {
        GuestAuthenticationResponse guestAuthenticationResponse =
                authenticationService.authenticateGuest(guestAuthenticationRequest);
        return ResponseEntity.ok(guestAuthenticationResponse);
    }
}

