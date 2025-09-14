package routie.global.exception.infrastructure.resolver.expected;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import lombok.extern.slf4j.Slf4j;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.ExceptionResolver;

@Slf4j
public abstract class ExpectedExceptionResolver<T extends Exception> implements ExceptionResolver {

    private final Class<T> exceptionClass;

    protected ExpectedExceptionResolver() {
        Type genericSuperclass = getClass().getGenericSuperclass();
        if (genericSuperclass instanceof final ParameterizedType parameterizedType) {
            @SuppressWarnings("unchecked")
            Class<T> exceptionType = (Class<T>) parameterizedType.getActualTypeArguments()[0];
            this.exceptionClass = exceptionType;
        } else {
            throw new IllegalArgumentException("제네릭 타입이 잘못 명시되었습니다.");
        }
    }

    @Override
    public final ExceptionDetail resolve(final Exception exception) {
        if (exceptionClass.isInstance(exception)) {
            ExceptionDetail exceptionDetail = resolveInternal(exceptionClass.cast(exception));
            log.warn("[EXPECTED] {}", exception.getMessage(), exception);
            return exceptionDetail;
        }
        throw new ClassCastException("지원하지 않는 예외 타입입니다: " + exception.getClass());
    }

    protected abstract ExceptionDetail resolveInternal(final T exception);

    @Override
    public final Class<? extends Exception> getResolvableException() {
        return exceptionClass;
    }
}
