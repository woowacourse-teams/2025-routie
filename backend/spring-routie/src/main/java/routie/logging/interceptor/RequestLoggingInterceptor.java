package routie.logging.interceptor;

import static routie.logging.LoggingField.CLIENT_IP;
import static routie.logging.LoggingField.HTTP_METHOD;
import static routie.logging.LoggingField.RESPONSE_TIME_MS;
import static routie.logging.LoggingField.URL;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.HandlerInterceptor;
import routie.logging.LoggingField;
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
        logData.put(HTTP_METHOD.getFieldName(), request.getMethod());
        logData.put(URL.getFieldName(), request.getRequestURI());
        logData.put(CLIENT_IP.getFieldName(), ClientIpExtractor.extractClientIp(request));
        logData.put(RESPONSE_TIME_MS.getFieldName(), startTime == null ? -1 : System.currentTimeMillis() - startTime);

        clientRequestLogger.log(logData);
    }
}
