package routie.global.exception.infrastructure.resolver.expected.http;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.infrastructure.resolver.expected.ExpectedExceptionResolver;

/**
 * 요청한 리소스를 찾을 수 없을 때 발생하는 예외를 처리하는 Resolver.
 *
 * <ul>
 * <li>없는 uri로 요청을 보내는 경우.</li>
 * </ul>
 */
@Component
public class NoResourceFoundExceptionResolver extends ExpectedExceptionResolver<NoResourceFoundException> {

    @Override
    protected ExceptionDetail resolveInternal(final NoResourceFoundException exception) {
        return ExceptionDetail.fromErrorCode(ErrorCode.NOT_FOUND);
    }
}
