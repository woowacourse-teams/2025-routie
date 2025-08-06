package routie.logging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RequestLoggingAspect {

    private final ObjectMapper objectMapper;


    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object logRequest(final ProceedingJoinPoint joinPoint) throws Throwable {

        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            setMDCFields(joinPoint, true, executionTime);
            return result;

        } catch (final Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            setMDCFields(joinPoint, false, executionTime);
            throw e;
        } finally {
            log.info("");
            MDC.clear();
        }
    }

    private void setMDCFields(
            final ProceedingJoinPoint joinPoint,
            final boolean isSuccess,
            final long executionTime
    ) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest httpServletRequest = servletRequestAttributes.getRequest();

        String url = httpServletRequest.getRequestURI();
        String httpMethod = httpServletRequest.getMethod();
        String clientIp = extractClientIp(httpServletRequest);

        MDC.put("httpMethod", httpMethod);
        MDC.put("url", url);
        MDC.put("handlerMethod", extractHandlerMethodName(joinPoint));
        MDC.put("requestResult", isSuccess ? "SUCCESS" : "FAILED");
        MDC.put("responseTimeMs", String.valueOf(executionTime));
        MDC.put("clientIp", clientIp);

        try {
            List<routie.logging.HandlerParameterDto> params = extractHandlerParameters(joinPoint);
            final String handlerParams = objectMapper.writeValueAsString(params);
            MDC.put("handlerParams", handlerParams);
        } catch (final JsonProcessingException e) {
            MDC.put("handlerParams", "[]");
        }
    }

    private String extractClientIp(final HttpServletRequest request) {
        String[] headers = {"X-Forwarded-For", "X-Real-IP", "Proxy-Client-IP", "WL-Proxy-Client-IP"};

        for (final String header : headers) {
            String ip = request.getHeader(header);
            if (isValidIp(ip)) {
                return ip.contains(",") ? ip.split(",")[0].trim() : ip;
            }
        }

        String remoteAddr = request.getRemoteAddr();
        return remoteAddr == null ? "unknown" : remoteAddr;
    }

    private boolean isValidIp(final String ip) {
        return ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip);
    }

    public String extractHandlerMethodName(final JoinPoint joinPoint) {
        String controllerName = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        return controllerName + "." + methodName;
    }

    private List<HandlerParameterDto> extractHandlerParameters(final JoinPoint joinPoint) {
        List<HandlerParameterDto> handlerParams = new ArrayList<>();

        try {
            MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
            Method method = methodSignature.getMethod();
            Parameter[] parameters = method.getParameters();
            Object[] args = joinPoint.getArgs();

            for (int i = 0; i < parameters.length && i < args.length; i++) {
                Parameter parameter = parameters[i];
                Object value = args[i];

                if (value == null || isSystemParameter(value.getClass())) {
                    continue;
                }

                if (isPathVariableOrRequestParam(parameter)) {
                    continue;
                }

                HandlerParameterDto handlerParameterDto = new HandlerParameterDto(
                        getParameterTypeName(parameter),
                        value
                );
                handlerParams.add(handlerParameterDto);
            }
        } catch (final Exception e) {
            return List.of();
        }

        return handlerParams;
    }

    private boolean isPathVariableOrRequestParam(final Parameter parameter) {
        return parameter.isAnnotationPresent(PathVariable.class) ||
                parameter.isAnnotationPresent(RequestParam.class);
    }

    private String getParameterTypeName(final Parameter parameter) {
        return parameter.getType().getName();
    }

    private boolean isSystemParameter(final Class<?> parameterType) {
        return parameterType.equals(jakarta.servlet.http.HttpServletRequest.class) ||
                parameterType.equals(jakarta.servlet.http.HttpServletResponse.class) ||
                parameterType.getName().startsWith("org.springframework.web.context.request") ||
                parameterType.getName().startsWith("org.springframework.security");
    }
}
