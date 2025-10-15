package routie.global.logging.infrastructure.aspect;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import routie.global.logging.domain.LogDataBuilder;
import routie.global.logging.domain.LoggingField;
import routie.global.logging.infrastructure.ClientRequestLogger;
import routie.global.logging.infrastructure.TraceIdHolder;

@Slf4j
@Aspect
@RequiredArgsConstructor
public class RequestLoggingAspect {

    private final ClientRequestLogger clientRequestLogger;
    private final LogDataBuilder logDataBuilder;

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object handleAroundRequest(final ProceedingJoinPoint joinPoint) throws Throwable {

        final long startTime = System.currentTimeMillis();
        TraceIdHolder.setTraceId();

        final ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder
                .currentRequestAttributes();
        final HttpServletRequest httpServletRequest = servletRequestAttributes.getRequest();

        boolean isSuccess = false;
        try {
            final Object result = joinPoint.proceed();
            isSuccess = true;
            return result;
        } finally {
            final long executionTime = System.currentTimeMillis() - startTime;
            logClientRequest(joinPoint, httpServletRequest, executionTime, isSuccess);
            if (isSuccess) {
                TraceIdHolder.clearTraceId();
            }
        }
    }

    @After("within(routie.global.exception..*) && " +
            "@within(org.springframework.web.bind.annotation.RestControllerAdvice) && " +
            "@annotation(org.springframework.web.bind.annotation.ExceptionHandler)"
    )
    public void cleanupAfterExceptionHandling() {
        TraceIdHolder.clearTraceId();
    }

    private void logClientRequest(
            final JoinPoint joinPoint,
            final HttpServletRequest httpServletRequest,
            final long executionTime,
            final boolean isSuccess
    ) {
        final Map<LoggingField, Object> logData = logDataBuilder.buildLogData(new AspectLoggingContext(
                httpServletRequest,
                executionTime,
                joinPoint,
                isSuccess
        ));

        clientRequestLogger.log(logData);
    }
}
