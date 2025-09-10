package routie.logging.domain;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import routie.logging.infrastructure.extractor.HandlerParameter;

public interface LoggingContext {
    HttpServletRequest getRequest();

    long getExecutionTime();

    String getHandlerMethod();

    String getRequestResult();

    List<HandlerParameter> getHandlerParameters();
}
