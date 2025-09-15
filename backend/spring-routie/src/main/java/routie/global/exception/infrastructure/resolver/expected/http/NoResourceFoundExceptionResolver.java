package routie.global.exception.infrastructure.resolver.expected.http;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import routie.global.exception.domain.ErrorCode;
import routie.global.exception.domain.ExceptionResolvingRequest;
import routie.global.exception.domain.ExceptionResolvingResponse;
import routie.global.exception.domain.resolver.expected.ExpectedExceptionResolver;

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
    protected ExceptionResolvingResponse resolveInternal(
            final ExceptionResolvingRequest<NoResourceFoundException> exceptionResolvingRequest
    ) {
        return ExceptionResolvingResponse.fromErrorCode(ErrorCode.NOT_FOUND);
    }
}
