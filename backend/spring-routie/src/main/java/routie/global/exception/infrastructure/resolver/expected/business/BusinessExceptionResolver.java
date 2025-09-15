package routie.global.exception.infrastructure.resolver.expected.business;

import org.springframework.stereotype.Component;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ExceptionResolvingRequest;
import routie.global.exception.domain.ExceptionResolvingResponse;
import routie.global.exception.domain.resolver.expected.ExpectedExceptionResolver;

/**
 * 비즈니스 로직 수행 과정에서 발생하는 모든 예외를 처리하는 Resolver.
 */
@Component
public class BusinessExceptionResolver extends ExpectedExceptionResolver<BusinessException> {

    @Override
    protected ExceptionResolvingResponse resolveInternal(
            final ExceptionResolvingRequest<BusinessException> exceptionResolvingRequest
    ) {
        BusinessException exception = exceptionResolvingRequest.exception();
        return ExceptionResolvingResponse.fromErrorCode(exception.getErrorCode());
    }
}
