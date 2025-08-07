package routie.logging.aspect;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import routie.logging.extractor.ClientIpExtractor;
import routie.logging.extractor.HandlerMethodAnalyzer;
import routie.logging.extractor.dto.HandlerParameter;
import routie.logging.logger.ClientRequestLogger;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RequestLoggingAspect {

    private final HandlerMethodAnalyzer handlerMethodAnalyzer;
    private final ClientRequestLogger clientRequestLogger;

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object handleAroundRequest(final ProceedingJoinPoint joinPoint) throws Throwable {

        long startTime = System.currentTimeMillis();

        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest httpServletRequest = servletRequestAttributes.getRequest();

        boolean isSuccess = false;
        try {
            Object result = joinPoint.proceed();
            isSuccess = true;
            return result;
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;
            logClientRequest(joinPoint, httpServletRequest, executionTime, isSuccess);
        }
    }

    private void logClientRequest(
            final JoinPoint joinPoint,
            final HttpServletRequest httpServletRequest,
            final long executionTime,
            final boolean isSuccess
    ) {
        try {
            Map<String, Object> logData = new HashMap<>();

            logData.put("httpMethod", httpServletRequest.getMethod());
            logData.put("url", httpServletRequest.getRequestURI());
            logData.put("clientIp", ClientIpExtractor.extractClientIp(httpServletRequest));
            logData.put("handlerMethod", extractHandlerMethodName(joinPoint));
            logData.put("handlerParams", extractHandlerParameters(joinPoint));
            logData.put("requestResult", isSuccess ? "SUCCESS" : "FAILED");
            logData.put("responseTimeMs", executionTime);

            clientRequestLogger.log(logData);
        } catch (final Exception e) {
            log.warn("failed to log client request");
        }
    }

    private String extractHandlerMethodName(final JoinPoint joinPoint) {
        String controllerName = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        return controllerName + "#" + methodName;
    }

    private List<HandlerParameter> extractHandlerParameters(final JoinPoint joinPoint) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        return handlerMethodAnalyzer.extractParameters(joinPoint.getArgs(), methodSignature.getMethod());
    }
}
