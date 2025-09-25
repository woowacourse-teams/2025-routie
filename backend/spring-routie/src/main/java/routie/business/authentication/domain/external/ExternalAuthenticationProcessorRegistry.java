package routie.business.authentication.domain.external;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Component
public class ExternalAuthenticationProcessorRegistry {

    private final Map<ExternalAuthenticationProvider, ExternalAuthenticationProcessor> externalAuthenticationProcessors;

    public ExternalAuthenticationProcessorRegistry(
            final List<ExternalAuthenticationProcessor> externalAuthenticationProcessors
    ) {
        this.externalAuthenticationProcessors = externalAuthenticationProcessors.stream()
                .collect(Collectors.toUnmodifiableMap(
                        ExternalAuthenticationProcessor::getExternalAuthenticationProvider,
                        Function.identity(),
                        (existingExternalAuthenticationProcessor, externalAuthenticationProcessor) -> {
                            throw new IllegalArgumentException(
                                    existingExternalAuthenticationProcessor.getExternalAuthenticationProvider()
                                            + " External Authentication Provider가 중복되었습니다: "
                                            + existingExternalAuthenticationProcessor.getClass().getName()
                                            + ", "
                                            + externalAuthenticationProcessor.getClass().getName()
                            );
                        }
                ));
    }

    public ExternalAuthenticationProcessor getExternalAuthenticationProcessor(
            final ExternalAuthenticationProvider provider
    ) {
        return Optional.ofNullable(externalAuthenticationProcessors.get(provider))
                .orElseThrow(() -> new BusinessException(ErrorCode.OAUTH_PROVIDER_NOT_SUPPORTED));
    }
}
