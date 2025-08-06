package routie.place.infrastructure.search;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;

@Slf4j
@RequiredArgsConstructor
public class KakaoLocalResponseErrorHandler implements ResponseErrorHandler {

    private final ObjectMapper objectMapper;

    @Override
    public boolean hasError(final ClientHttpResponse response) {
        try {
            final HttpStatusCode statusCode = response.getStatusCode();

            return statusCode.is4xxClientError() || statusCode.is5xxServerError();
        } catch (final IOException ioException) {
            throw new BusinessException(ErrorCode.KAKAO_LOCAL_API_ERROR);
        }
    }

    @Override
    public void handleError(
            final URI url,
            final HttpMethod method,
            final ClientHttpResponse response
    ) throws IOException {
        log.warn(
                "카카오 로컬 API 오류 발생: {} ",
                objectMapper.readValue(response.getBody(), KakaoLocalErrorResponse.class).code()
        );

        throw new BusinessException(ErrorCode.KAKAO_LOCAL_API_ERROR);
    }
}
