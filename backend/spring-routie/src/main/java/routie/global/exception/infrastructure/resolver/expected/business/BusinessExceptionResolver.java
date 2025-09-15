package routie.global.exception.infrastructure.resolver.expected.business;

import org.springframework.stereotype.Component;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ExceptionContext;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.resolver.expected.ExpectedExceptionResolver;

/**
 * 비즈니스 로직 수행 과정에서 발생하는 모든 예외를 처리하는 Resolver.
 */
@Component
public class BusinessExceptionResolver extends ExpectedExceptionResolver<BusinessException> {

    @Override
    protected ExceptionDetail resolveInternal(final ExceptionContext<BusinessException> exceptionContext) {
        BusinessException exception = exceptionContext.exception();
        return ExceptionDetail.fromErrorCode(exception.getErrorCode());
    }
}
