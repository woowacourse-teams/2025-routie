package routie.logging;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum LoggingField {

    HTTP_METHOD("httpMethod"),
    URL("url"),
    CLIENT_IP("clientIp"),
    RESPONSE_TIME_MS("responseTimeMs"),
    REQUEST_RESULT("requestResult"),
    HANDLER_METHOD("handlerMethod"),
    HANDLER_PARAMS("handlerParams"),
    ;

    private final String fieldName;
}
