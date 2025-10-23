package routie.business.authentication.ui.argument.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import routie.business.authentication.ui.jwt.JwtParser;

@Component
@RequiredArgsConstructor
public class AuthenticationInterceptor implements HandlerInterceptor {

    private final JwtParser jwtParser;

    @Override
    public boolean preHandle(
            final HttpServletRequest request,
            final HttpServletResponse response,
            final Object handler
    ) {
        request.setAttribute("jwt", jwtParser.parseFromRequest(request).orElse(null));
        return true;
    }
}
