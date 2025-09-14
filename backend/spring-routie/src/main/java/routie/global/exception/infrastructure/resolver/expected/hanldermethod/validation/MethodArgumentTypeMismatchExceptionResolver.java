package routie.global.exception.infrastructure.resolver.expected.hanldermethod.validation;

import org.springframework.stereotype.Component;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.infrastructure.resolver.expected.ExpectedExceptionResolver;

/**
 * HandlerMethod 에 파라메터 바인딩 시, 타입이 일치하지 않는 경우 발생하는 예외를 처리하는 Resolver.
 *
 * <ul>
 * <li>@RequestParam Long page 필드에 문자열 바인딩 시도 시.</li>
 * <li>@PathVariable Long id 필드에 문자열 바인딩 시도 시.</li>
 * </ul>
 *
 * @see org.springframework.web.method.HandlerMethod
 */
@Component
public class MethodArgumentTypeMismatchExceptionResolver extends
        ExpectedExceptionResolver<MethodArgumentTypeMismatchException> {

    @Override
    protected ExceptionDetail resolveInternal(final MethodArgumentTypeMismatchException exception) {
        return ExceptionDetail.fromErrorCode(ErrorCode.INVALID_REQUEST_DATA_TYPE);
    }
}
