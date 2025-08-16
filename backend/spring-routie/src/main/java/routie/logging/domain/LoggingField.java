package routie.logging.domain;

import java.util.function.Function;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import routie.logging.extractor.ClientIpExtractor;

@Getter
@RequiredArgsConstructor
public enum LoggingField {

    HTTP_METHOD("httpMethod", context -> context.getRequest().getMethod()),
    URL("url", context -> context.getRequest().getRequestURI()),
    CLIENT_IP("clientIp", context -> ClientIpExtractor.extractClientIp(context.getRequest())),
    RESPONSE_TIME_MS("responseTimeMs", LoggingContext::getExecutionTime),
    REQUEST_RESULT("requestResult", LoggingContext::getRequestResult),
    HANDLER_METHOD("handlerMethod", LoggingContext::getHandlerMethod),
    HANDLER_PARAMS("handlerParams", LoggingContext::getHandlerParameters),
    ;

    private final String fieldName;
    private final Function<LoggingContext, Object> extractor;

    public Object extract(final LoggingContext loggingContext) {
        return extractor.apply(loggingContext);
    }

    public boolean isJsonSerializationRequired() {
        return this == HANDLER_PARAMS;
    }
}
