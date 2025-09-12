package routie.global.exception.infrastructure.resolver.expected;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ExceptionDetail;

/**
 * 비즈니스 로직 수행 과정에서 발생하는 모든 예외를 처리하는 Resolver.
 */
@Slf4j
@Component
public class BusinessExceptionResolver extends ExpectedExceptionResolver<BusinessException> {

    @Override
    protected ExceptionDetail resolveInternal(final BusinessException exception) {
        log.warn("[EXPECTED] {}", exception.getMessage(), exception);
        return ExceptionDetail.fromErrorCode(exception.getErrorCode());
    }
}
