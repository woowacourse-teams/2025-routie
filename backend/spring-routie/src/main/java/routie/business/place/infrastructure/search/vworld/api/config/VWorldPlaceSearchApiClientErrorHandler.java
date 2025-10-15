package routie.business.place.infrastructure.search.vworld.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.client.ResponseErrorHandler;
import routie.business.place.infrastructure.search.vworld.api.dto.response.VWorldPlaceSearchApiErrorResponse;
import routie.business.place.infrastructure.search.vworld.api.dto.response.VWorldPlaceSearchApiStatusResponse;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Slf4j
@RequiredArgsConstructor
public class VWorldPlaceSearchApiClientErrorHandler implements ResponseErrorHandler {

    private final ObjectMapper objectMapper;

    @Override
    public boolean hasError(@NonNull final ClientHttpResponse response) {
        try {
            if (response.getStatusCode().isError()) {
                return true;
            }
            final VWorldPlaceSearchApiStatusResponse vWorldPlaceSearchApiStatusResponse =
                    parseResponseBody(response, VWorldPlaceSearchApiStatusResponse.class);
            return !vWorldPlaceSearchApiStatusResponse.isSuccess();
        } catch (final Exception e) {
            log.warn("V World API 응답 상태 파싱 실패", e);
            throw new BusinessException(ErrorCode.V_WORLD_API_ERROR);
        }
    }

    @Override
    public void handleError(
            @NonNull final URI url,
            @NonNull final HttpMethod method,
            @NonNull final ClientHttpResponse response
    ) {
        log.atWarn().log("V World API 오류 발생: {}", parseErrorLogMessage(response));
        throw new BusinessException(ErrorCode.V_WORLD_API_ERROR);
    }

    private String parseErrorLogMessage(final ClientHttpResponse response) {
        try {
            return parseResponseBody(response, VWorldPlaceSearchApiErrorResponse.class).toString();
        } catch (final Exception e) {
            return String.format("V World API 에러 응답 파싱 실패: %s", e);
        }
    }

    private <T> T parseResponseBody(final ClientHttpResponse response, final Class<T> bodyType) throws Exception {
        try (final InputStream responseBody = response.getBody()) {
            return objectMapper.readValue(responseBody, bodyType);
        }
    }
}
