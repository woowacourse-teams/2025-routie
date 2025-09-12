package routie.global.exception.infrastructure.resolver.expected;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import org.springframework.beans.factory.BeanInitializationException;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.ExceptionResolver;

public abstract class ExpectedExceptionResolver<T extends Exception> implements ExceptionResolver {

    private final Class<T> exceptionClass;

    protected ExpectedExceptionResolver() {
        Type genericSuperclass = getClass().getGenericSuperclass();
        if (genericSuperclass instanceof final ParameterizedType parameterizedType) {
            @SuppressWarnings("unchecked")
            Class<T> exceptionType = (Class<T>) parameterizedType.getActualTypeArguments()[0];
            this.exceptionClass = exceptionType;
        } else {
            throw new BeanInitializationException("예상 가능 예외 핸들러의 제네릭 타입이 잘못 명시되었습니다.");
        }
    }

    @Override
    public final ExceptionDetail resolve(final Exception exception) {
        if (exceptionClass.isInstance(exception)) {
            return resolveInternal(exceptionClass.cast(exception));
        }
        return ExceptionDetail.fromErrorCode(ErrorCode.FAIL_TO_HANDLE_EXCEPTION);
    }

    protected abstract ExceptionDetail resolveInternal(final T exception);

    @Override
    public final Class<? extends Exception> getResolvableException() {
        return exceptionClass;
    }
}
