package routie.logging.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.HandlerInterceptor;
import routie.logging.extractor.ClientIpExtractor;
import routie.logging.logger.ClientRequestLogger;

@RequiredArgsConstructor
public class RequestLoggingInterceptor implements HandlerInterceptor {

    private static final String START_TIME_ATTRIBUTE = "startTime";

    private final ClientRequestLogger clientRequestLogger;

    @Override
    public boolean preHandle(
            final HttpServletRequest request,
            final HttpServletResponse response,
            final Object handler
    ) {
        request.setAttribute(START_TIME_ATTRIBUTE, System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(
            final HttpServletRequest request,
            final HttpServletResponse response,
            final Object handler,
            final Exception ex
    ) {
        Long startTime = (Long) request.getAttribute(START_TIME_ATTRIBUTE);

        long executionTime = startTime == null ? -1 : System.currentTimeMillis() - startTime;
        final String clientIp = ClientIpExtractor.extractClientIp(request);
        final String url = request.getRequestURI();
        final String httpMethod = request.getMethod();

        clientRequestLogger.log(httpMethod, url, clientIp, executionTime);
    }
}
