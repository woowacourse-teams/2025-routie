package routie.business.authentication.infrastructure.external.kakao.api.user.config.error;

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
import routie.business.authentication.infrastructure.external.kakao.api.user.config.error.dto.KakaoUserApiErrorResponse;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoUserApiErrorHandler implements ResponseErrorHandler {

    private final ObjectMapper objectMapper;

    @Override
    public boolean hasError(final ClientHttpResponse response) throws IOException {
        return response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError();
    }

    @Override
    public void handleError(final URI url, final HttpMethod method, final ClientHttpResponse response) {
        log.atWarn().log("Kakao User API 오류 발생: {}", parseErrorLogMessage(response));
        throw new BusinessException(ErrorCode.KAKAO_USER_API_ERROR);
    }

    private String parseErrorLogMessage(final ClientHttpResponse response) {
        try {
            return parseResponseBody(response, KakaoUserApiErrorResponse.class).toString();
        } catch (final Exception e) {
            return String.format("Kakao User API 에러 응답 파싱 실패: %s", e);
        }
    }

    private <T> T parseResponseBody(final ClientHttpResponse response, final Class<T> bodyType) throws Exception {
        try (final InputStream responseBody = response.getBody()) {
            return objectMapper.readValue(responseBody, bodyType);
        }
    }
}
