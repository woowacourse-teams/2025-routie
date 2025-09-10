package routie.logging.infrastructure.aspect;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import routie.logging.domain.LoggingContext;
import routie.logging.infrastructure.extractor.HandlerParametersExtractor;
import routie.logging.infrastructure.extractor.HandlerParameter;

@RequiredArgsConstructor
public class AspectLoggingContext implements LoggingContext {

    private final HttpServletRequest request;
    private final long executionTime;
    private final JoinPoint joinPoint;
    private final boolean isSuccess;

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
        String controllerName = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        return controllerName + "#" + methodName;
    }

    @Override
    public String getRequestResult() {
        return isSuccess ? "SUCCESS" : "FAILED";
    }

    @Override
    public List<HandlerParameter> getHandlerParameters() {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        return HandlerParametersExtractor.extractParameters(joinPoint.getArgs(), methodSignature.getMethod());
    }
}
