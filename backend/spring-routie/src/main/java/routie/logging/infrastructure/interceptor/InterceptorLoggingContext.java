package routie.logging.infrastructure.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import routie.logging.domain.LoggingContext;
import routie.logging.extractor.dto.HandlerParameter;

@RequiredArgsConstructor
public class InterceptorLoggingContext implements LoggingContext {

    private final HttpServletRequest request;
    private final HttpServletResponse response;
    private final long executionTime;

    @Override
    public HttpServletRequest getRequest() {
        return request;
    }

    @Override
    public long getExecutionTime() {
        return executionTime;
    }

    @Override
    public String getHandlerMethod() {
        throw new UnsupportedOperationException("Handler Method is not available in Interceptor context.");
    }

    @Override
    public String getRequestResult() {
        return HttpStatus.valueOf(response.getStatus()).isError() ? "FAILED" : "SUCCESS";
    }

    @Override
    public List<HandlerParameter> getHandlerParameters() {
        throw new UnsupportedOperationException("Handler Parameters are not available in Interceptor context.");
    }
}
