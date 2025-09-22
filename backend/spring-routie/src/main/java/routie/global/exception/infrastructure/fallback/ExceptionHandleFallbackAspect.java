package routie.global.exception.infrastructure.fallback;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.infrastructure.logger.ExceptionLogger;

@Aspect
@Component
public class ExceptionHandleFallbackAspect {

    @Around("within(@org.springframework.web.bind.annotation.RestControllerAdvice *) && "
            + "execution(@org.springframework.web.bind.annotation.ExceptionHandler * *(..))")
    public Object handleFallback(final ProceedingJoinPoint joinPoint) {
        try {
            return joinPoint.proceed();
        } catch (final Throwable throwable) {
            ExceptionLogger.logFallbackException(throwable);
            return ErrorCode.FAIL_TO_HANDLE_EXCEPTION.toProblemDetail();
        }
    }
}
