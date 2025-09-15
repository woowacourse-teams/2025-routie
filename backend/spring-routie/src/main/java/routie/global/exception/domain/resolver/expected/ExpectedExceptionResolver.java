package routie.global.exception.domain.resolver.expected;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import lombok.extern.slf4j.Slf4j;
import routie.global.exception.domain.ExceptionResolvingRequest;
import routie.global.exception.domain.ExceptionResolvingResponse;

@Slf4j
public abstract class ExpectedExceptionResolver<T extends Exception> {

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

    public ExceptionResolvingResponse resolve(final ExceptionResolvingRequest<T> exceptionResolvingRequest) {
        Exception exception = exceptionResolvingRequest.exception();
        if (exceptionClass.isInstance(exception)) {
            ExceptionResolvingResponse exceptionResolvingResponse = resolveInternal(exceptionResolvingRequest);
            log.warn("[EXPECTED] {}", exception.getMessage(), exception);
            return exceptionResolvingResponse;
        }
        throw new ClassCastException("지원하지 않는 예외 타입입니다: " + exception.getClass());
    }

    protected abstract ExceptionResolvingResponse resolveInternal(
            final ExceptionResolvingRequest<T> exceptionResolvingRequest
    );

    public final Class<? extends Exception> getResolvableException() {
        return exceptionClass;
    }
}
