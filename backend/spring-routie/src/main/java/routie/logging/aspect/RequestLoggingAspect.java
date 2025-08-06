package routie.logging.aspect;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
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
import routie.logging.extractor.dto.HandlerParameterDto;
import routie.logging.logger.ClientRequestLogger;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RequestLoggingAspect {

    private final ClientIpExtractor clientIpExtractor;
    private final HandlerMethodAnalyzer handlerMethodAnalyzer;
    private final ClientRequestLogger clientRequestLogger;

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object handleAroundRequest(final ProceedingJoinPoint joinPoint) throws Throwable {

        long startTime = System.currentTimeMillis();

        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest httpServletRequest = servletRequestAttributes.getRequest();

        try {
            Object result = joinPoint.proceed();

            long executionTime = System.currentTimeMillis() - startTime;
            logClientRequest(joinPoint, httpServletRequest, executionTime, true);
            return result;

        } catch (final Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            logClientRequest(joinPoint, httpServletRequest, executionTime, false);
            throw e;
        }
    }

    private void logClientRequest(
            final JoinPoint joinPoint,
            final HttpServletRequest httpServletRequest,
            final long executionTime,
            final boolean isSuccess
    ) {
        try {
            String httpMethod = httpServletRequest.getMethod();
            String url = httpServletRequest.getRequestURI();
            String clientIp = clientIpExtractor.extractClientIp(httpServletRequest);

            String handlerMethod = extractHandlerMethodName(joinPoint);
            List<HandlerParameterDto> handlerParams = extractHandlerParameters(joinPoint);

            clientRequestLogger.log(
                    httpMethod,
                    url,
                    clientIp,
                    handlerMethod,
                    handlerParams,
                    isSuccess,
                    executionTime
            );
        } catch (final Exception e) {
            log.warn("failed to log client request");
        }
    }

    private String extractHandlerMethodName(final JoinPoint joinPoint) {
        String controllerName = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        return controllerName + "." + methodName;
    }

    private List<HandlerParameterDto> extractHandlerParameters(final JoinPoint joinPoint) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        return handlerMethodAnalyzer.extractParameters(joinPoint.getArgs(), methodSignature.getMethod());
    }
}
