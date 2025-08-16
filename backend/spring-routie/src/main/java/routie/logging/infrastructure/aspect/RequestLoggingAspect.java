package routie.logging.infrastructure.aspect;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import routie.logging.domain.LogDataBuilder;
import routie.logging.domain.LoggingField;
import routie.logging.infrastructure.TraceIdHolder;
import routie.logging.infrastructure.ClientRequestLogger;

@Slf4j
@Aspect
@RequiredArgsConstructor
public class RequestLoggingAspect {

    private final ClientRequestLogger clientRequestLogger;
    private final LogDataBuilder logDataBuilder;

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object handleAroundRequest(final ProceedingJoinPoint joinPoint) throws Throwable {

        long startTime = System.currentTimeMillis();
        TraceIdHolder.setTraceId();

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
            TraceIdHolder.clearTraceId();
        }
    }

    private void logClientRequest(
            final JoinPoint joinPoint,
            final HttpServletRequest httpServletRequest,
            final long executionTime,
            final boolean isSuccess
    ) {
        Map<LoggingField, Object> logData = logDataBuilder.buildLogData(new AspectLoggingContext(
                httpServletRequest,
                executionTime,
                joinPoint,
                isSuccess
        ));

        clientRequestLogger.log(logData);
    }
}
