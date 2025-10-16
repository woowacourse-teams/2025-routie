package routie.global.exception.infrastructure.config;

import jakarta.annotation.Nullable;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.beans.factory.support.BeanDefinitionValidationException;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Spring Bean 초기화 과정에서 {@link RestControllerAdvice}로 어노테이션된 클래스의 {@link ExceptionHandler} 메서드를 검증하는
 * {@link BeanPostProcessor}.
 *
 * <p>검증 항목:
 * <ol>
 * <li>{@link ExceptionHandler}에 지정된 예외 클래스는 해당 메서드의 예외 파라미터와 반드시 일치해야 한다.</li>
 * <ul>
 * <li>만약 메서드가 예외 클래스 파라미터를 받지 않는다면, 이는 허용된다.</li>
 * <li>만약, 메서드가 예외 클래스를 파라메터로 받는다면, 반드시 {@link ExceptionHandler}의 예외 클래스만을 받아야 한다.</li>
 * </ul>
 * <li>애플리케이션 전역에서 특정 예외에 대한 {@link ExceptionHandler}는 단 하나만 존재해야 한다.</li>
 * <ul>
 * <li> {@link IllegalArgumentException}을 처리하는 핸들러는 애플리케이션 전체에서 오직 하나만 존재해야 한다.</li>
 * <li>상속은 고려하지 않는다. {@link IllegalArgumentException}을 다루는 핸들러와 {@link Exception}을 다루는 핸들러는 동시에 존재할 수 있다</li>
 * </ul>
 * </ol>
 */
@Component
public class ExceptionHandlerPostProcessor implements BeanPostProcessor {

    private final Map<Class<? extends Throwable>, Method> exceptionHandlers = new HashMap<>();

    @Override
    public Object postProcessBeforeInitialization(
            final Object bean,
            @Nullable final String beanName
    ) throws BeansException {
        if (AnnotationUtils.findAnnotation(bean.getClass(), RestControllerAdvice.class) == null) {
            return bean;
        }

        Arrays.stream(bean.getClass().getMethods())
                .filter(this::isExceptionHandlerMethod)
                .forEach(this::validateExceptionHandlerMethod);

        return bean;
    }

    private boolean isExceptionHandlerMethod(final Method method) {
        return method.isAnnotationPresent(ExceptionHandler.class);
    }

    private void validateExceptionHandlerMethod(final Method exceptionHandlerMethod) {
        validateAnnotation(exceptionHandlerMethod);
        validateParameter(exceptionHandlerMethod);
        validateUniqueness(exceptionHandlerMethod);
    }

    private void validateAnnotation(final Method exceptionHandlerMethod) {
        final Class<? extends Throwable>[] exceptionClasses = exceptionHandlerMethod.getAnnotation(
                ExceptionHandler.class)
                .value();
        if (exceptionClasses.length != 1) {
            throw new BeanDefinitionValidationException(
                    "ExceptionHandler 메서드는 @ExceptionHandler에 하나의 예외 클래스를 지정해야 합니다: " +
                            formatExceptionHandlerName(exceptionHandlerMethod)
            );
        }
    }

    private void validateParameter(
            final Method exceptionHandlerMethod
    ) {
        final Class<? extends Throwable> exceptionClass = exceptionHandlerMethod.getAnnotation(ExceptionHandler.class)
                .value()[0];

        final List<Class<?>> throwableParameters = Arrays.stream(exceptionHandlerMethod.getParameterTypes())
                .filter(Throwable.class::isAssignableFrom)
                .toList();

        if (throwableParameters.size() > 1) {
            throw new BeanDefinitionValidationException(
                    "ExceptionHandler 메서드는 최대 하나의 예외 파라미터만 가질 수 있습니다: " +
                            formatExceptionHandlerName(exceptionHandlerMethod)
            );
        }

        if (!throwableParameters.isEmpty() && !exceptionClass.equals(throwableParameters.getFirst())) {
            throw new BeanDefinitionValidationException(
                    "ExceptionHandler 메서드의 예외 파라미터는 지정된 예외 클래스와 일치해야 합니다: " +
                            formatExceptionHandlerName(exceptionHandlerMethod)
            );
        }
    }

    private void validateUniqueness(final Method exceptionHandlerMethod) {
        final ExceptionHandler annotation = exceptionHandlerMethod.getAnnotation(ExceptionHandler.class);
        for (final Class<? extends Throwable> exceptionClass : annotation.value()) {
            if (exceptionHandlers.containsKey(exceptionClass)) {
                final Method existingMethod = exceptionHandlers.get(exceptionClass);
                throw new BeanDefinitionValidationException(
                        exceptionClass.getSimpleName() + " 을 처리하는 ExceptionHandler가 중복되었습니다: " +
                                formatExceptionHandlerName(existingMethod) + ", " + formatExceptionHandlerName(
                                        exceptionHandlerMethod)
                );
            }
            exceptionHandlers.put(exceptionClass, exceptionHandlerMethod);
        }
    }

    private String formatExceptionHandlerName(final Method exceptionHandlerMethod) {
        return exceptionHandlerMethod.getDeclaringClass().getCanonicalName() + "#" + exceptionHandlerMethod.getName();
    }
}
