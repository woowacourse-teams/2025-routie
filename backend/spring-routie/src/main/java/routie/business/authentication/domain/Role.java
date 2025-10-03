package routie.business.authentication.domain;

import java.util.Arrays;
import lombok.Getter;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Getter
public enum Role {
    USER("user"),
    GUEST("guest"),
    ;

    private final String key;

    Role(final String key) {
        this.key = key;
    }

    public static Role of(final String key) {
        return Arrays.stream(Role.values())
                .filter(role -> role.key.equals(key))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_ROLE));
    }
}
