package routie.logging.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
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

        Map<String, Object> logData = new HashMap<>();
        logData.put("httpMethod", request.getMethod());
        logData.put("url", request.getRequestURI());
        logData.put("clientIp", ClientIpExtractor.extractClientIp(request));
        logData.put("responseTimeMs", startTime == null ? -1 : System.currentTimeMillis() - startTime);

        clientRequestLogger.log(logData);
    }
}
