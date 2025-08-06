package routie.logging.logger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import routie.logging.extractor.dto.HandlerParameterDto;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClientRequestLogger {

    private final ObjectMapper objectMapper;

    public void log(
            final String httpMethod,
            final String url,
            final String clientIp,
            final String handlerMethod,
            final List<HandlerParameterDto> handlerParams,
            final boolean isSuccess,
            final long executionTime
    ) {
        try {
            putMdcFields(httpMethod, url, clientIp, handlerMethod, handlerParams, isSuccess, executionTime);
            log.info("");
        } finally {
            MDC.clear();
        }
    }

    private void putMdcFields(
            final String httpMethod,
            final String url,
            final String clientIp,
            final String handlerMethod,
            final List<HandlerParameterDto> handlerParams,
            final boolean isSuccess,
            final long executionTime
    ) {
        MDC.put("httpMethod", httpMethod);
        MDC.put("url", url);
        MDC.put("clientIp", clientIp);
        MDC.put("handlerMethod", handlerMethod);
        MDC.put("requestResult", isSuccess ? "SUCCESS" : "FAILED");
        MDC.put("responseTimeMs", String.valueOf(executionTime));

        try {
            String handlerParamsJson = objectMapper.writeValueAsString(handlerParams);
            MDC.put("handlerParams", handlerParamsJson);
        } catch (final JsonProcessingException e) {
            MDC.put("handlerParams", "[]");
        }
    }
}
