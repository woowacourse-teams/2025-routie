package routie.global.logging.infrastructure.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import routie.global.logging.domain.LoggingContext;
import routie.global.logging.domain.extractor.HandlerParameter;

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
