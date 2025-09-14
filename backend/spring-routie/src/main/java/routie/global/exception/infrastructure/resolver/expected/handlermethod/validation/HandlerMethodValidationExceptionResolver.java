package routie.global.exception.infrastructure.resolver.expected.handlermethod.validation;

import org.springframework.stereotype.Component;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.infrastructure.resolver.expected.ExpectedExceptionResolver;

/**
 * HandlerMethod 에 파라메터 바인딩 시, 검증에 실패한 경우 발생하는 예외를 처리하는 Resolver.
 *
 * <ul>
 * <li>@Valid 어노테이션이 붙은 필드 검증이 실패했을 때.</li>
 * </ul>
 *
 * @see org.springframework.web.method.HandlerMethod
 * @see jakarta.validation.Valid
 */
@Component
public class HandlerMethodValidationExceptionResolver extends
        ExpectedExceptionResolver<HandlerMethodValidationException> {

    @Override
    protected ExceptionDetail resolveInternal(final HandlerMethodValidationException exception) {
        return ExceptionDetail.fromErrorCode(ErrorCode.INVALID_REQUEST_DATA_VALUE);
    }
}
