package routie.business.authentication.ui.jwt;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class JwtParser {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final Pattern BEARER_PATTERN = Pattern.compile("^" + BEARER_PREFIX + "(.+)$");

    public Optional<String> parseFromRequest(final HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(HttpHeaders.AUTHORIZATION))
                .filter(header -> BEARER_PATTERN.matcher(header).matches())
                .map(header -> header.substring(BEARER_PREFIX.length()));
    }
}
