package routie.place.infrastructure.search.kakao.api.config.error;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.place.infrastructure.search.kakao.api.dto.response.KakaoPlaceSearchApiErrorResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoPlaceSearchApiErrorHandler implements ResponseErrorHandler {

    private final ObjectMapper objectMapper;
    private final List<KakaoPlaceSearchApiErrorResponseHandler> kakaoPlaceSearchApiErrorResponseHandlers;

    @Override
    public boolean hasError(@NonNull final ClientHttpResponse response) {
        try {
            final HttpStatusCode statusCode = response.getStatusCode();

            return statusCode.is4xxClientError() || statusCode.is5xxServerError();
        } catch (final IOException ioException) {
            throw new BusinessException(ErrorCode.KAKAO_LOCAL_API_ERROR);
        }
    }

    @Override
    public void handleError(
            @NonNull final URI url,
            @NonNull final HttpMethod method,
            final ClientHttpResponse response
    ) throws IOException {
        KakaoPlaceSearchApiErrorResponse kakaoPlaceSearchApiErrorResponse = objectMapper.readValue(
                response.getBody(),
                KakaoPlaceSearchApiErrorResponse.class
        );

        kakaoPlaceSearchApiErrorResponseHandlers.stream()
                .filter(
                        kakaoPlaceSearchApiErrorResponseHandler -> kakaoPlaceSearchApiErrorResponseHandler.canHandle(
                                kakaoPlaceSearchApiErrorResponse
                        )
                )
                .forEach(
                        kakaoPlaceSearchApiErrorResponseHandler -> kakaoPlaceSearchApiErrorResponseHandler.handle(
                                kakaoPlaceSearchApiErrorResponse
                        )
                );

        log.warn("카카오 검색 API 오류 발생: {} ", "errorResponse.code()");
        throw new BusinessException(ErrorCode.KAKAO_LOCAL_API_ERROR);
    }
}
