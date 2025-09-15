package routie.global.exception.infrastructure.resolver.expected.handlermethod.validation;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.MissingServletRequestParameterException;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionContext;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.resolver.expected.ExpectedExceptionResolver;

/**
 * HandlerMethod 의 필수 요청 파라메터가 누락된 경우 발생하는 예외를 처리하는 Resolver.
 *
 * <ul>
 * <li>@RequestParam(required = true) Long page 에서 page 가 누락된 경우.</li>
 * </ul>
 *
 * @see org.springframework.web.method.HandlerMethod
 * @see org.springframework.web.bind.annotation.RequestParam
 */
@Component
public class MissingServletRequestParameterExceptionResolver extends
        ExpectedExceptionResolver<MissingServletRequestParameterException> {

    @Override
    protected ExceptionDetail resolveInternal(
            final ExceptionContext<MissingServletRequestParameterException> exceptionContext
    ) {
        return ExceptionDetail.fromErrorCode(ErrorCode.MISSING_REQUEST_PARAMETER);
    }
}
