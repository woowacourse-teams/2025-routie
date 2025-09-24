package routie.business.authentication.domain.external;

import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum ExternalAuthenticationProvider {

    KAKAO("kakao");

    private final String name;

    public static ExternalAuthenticationProvider fromName(final String name) {
        return Arrays.stream(ExternalAuthenticationProvider.values())
                .filter(provider -> provider.hasSameName(name))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.OAUTH_PROVIDER_NOT_SUPPORTED));
    }

    private boolean hasSameName(final String name) {
        return this.name.equals(name);
    }
}
