package routie.business.authentication.infrastructure.external.kakao.api.auth.config.error;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import routie.business.authentication.infrastructure.external.kakao.api.auth.config.error.dto.KakaoExternalAuthenticationApiErrorResponse;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoExternalAuthenticationApiErrorHandler implements ResponseErrorHandler {

    private final ObjectMapper objectMapper;

    @Override
    public boolean hasError(final ClientHttpResponse response) throws IOException {
        return response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError();
    }

    @Override
    public void handleError(final URI url, final HttpMethod method, final ClientHttpResponse response) {
        log.atWarn().log("Kakao ExternalAuthentication API 오류 발생: {}", parseErrorLogMessage(response));
        throw new BusinessException(ErrorCode.KAKAO_OAUTH_API_ERROR);
    }

    private String parseErrorLogMessage(final ClientHttpResponse response) {
        try {
            return parseResponseBody(response, KakaoExternalAuthenticationApiErrorResponse.class).toString();
        } catch (final Exception e) {
            return String.format("Kakao ExternalAuthentication API 에러 응답 파싱 실패: %s", e);
        }
    }

    private <T> T parseResponseBody(final ClientHttpResponse response, final Class<T> bodyType) throws Exception {
        try (final InputStream responseBody = response.getBody()) {
            return objectMapper.readValue(responseBody, bodyType);
        }
    }
}
