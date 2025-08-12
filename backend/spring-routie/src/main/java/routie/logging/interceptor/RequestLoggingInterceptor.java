package routie.logging.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.HandlerInterceptor;
import routie.logging.domain.LogDataBuilder;
import routie.logging.domain.LoggingField;
import routie.logging.logger.ClientRequestLogger;

@RequiredArgsConstructor
public class RequestLoggingInterceptor implements HandlerInterceptor {

    private static final String START_TIME_ATTRIBUTE = "startTime";

    private final ClientRequestLogger clientRequestLogger;
    private final LogDataBuilder logDataBuilder;

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

        Map<LoggingField, Object> logData = logDataBuilder.buildLogData(new InterceptorLoggingContext(
                request,
                response,
                executionTime
        ));

        clientRequestLogger.log(logData);
    }
}
