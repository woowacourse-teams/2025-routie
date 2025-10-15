package routie.business.place.infrastructure.search.vworld.api.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.lang.NonNull;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestClient;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

/**
 * RestClient에 CachingClientHttpResponseWrapper 적용을 위한 Interceptor 입니다.
 */
@Slf4j
public class HttpResponseBodyCachingInterceptor implements ClientHttpRequestInterceptor {

    @NonNull
    @Override
    public ClientHttpResponse intercept(
            @NonNull final HttpRequest request,
            @NonNull final byte[] body,
            final ClientHttpRequestExecution execution
    ) {
        try {
            final ClientHttpResponse response = execution.execute(request, body);
            return CachedResponseBodyClientHttpResponse.from(response);
        } catch (final IOException e) {
            log.warn("V World API 요청 중 오류 발생", e);
            throw new BusinessException(ErrorCode.V_WORLD_API_ERROR);
        }
    }

    /**
     * {@link RestClient}의 응답을 캐싱하기 위한 래퍼 클래스입니다. {@link ClientHttpResponse}는 스트림을 한 번만 읽을 수 있습니다.
     * <p>
     * V World API는 ResponseBody에 에러 여부를 반환하므로, HTTP 상태 코드만으로는 에러를 판단할 수 없습니다. 따라서
     * {@link VWorldPlaceSearchApiClientErrorHandler}에서 Response Body를 여러 번 읽어야 하는 경우가 발생합니다.
     * <p>
     * 이 래퍼 클래스는 {@link ClientHttpResponse}를 감싸며, {@link RestClient} 응답 본문을 바이트 배열로 캐싱하여 여러 번 읽을 수 있게 합니다.
     *
     * @param clientHttpResponse {@link RestClient}의 응답인 {@link ClientHttpResponse}
     * @param cachedResponseBody 캐싱된 응답 본문 바이트 배열
     */
    private record CachedResponseBodyClientHttpResponse(
            ClientHttpResponse clientHttpResponse,
            byte[] cachedResponseBody
    ) implements ClientHttpResponse {

        private static CachedResponseBodyClientHttpResponse from(final ClientHttpResponse delegate) throws IOException {
            return new CachedResponseBodyClientHttpResponse(
                    delegate,
                    StreamUtils.copyToByteArray(delegate.getBody())
            );
        }

        /**
         * 캐싱된 응답 본문을 {@link ByteArrayInputStream}으로 반환합니다. 이로 인해 {@link ClientHttpResponse}의 본문을 여러 번 읽을 수 있습니다.
         *
         * @return 캐싱된 응답 본문을 읽기 위한 {@link InputStream}
         */
        @NonNull
        @Override
        public InputStream getBody() {
            return new ByteArrayInputStream(this.cachedResponseBody);
        }

        @NonNull
        @Override
        public HttpHeaders getHeaders() {
            return clientHttpResponse.getHeaders();
        }

        @NonNull
        @Override
        public HttpStatusCode getStatusCode() throws IOException {
            return clientHttpResponse.getStatusCode();
        }

        @NonNull
        @Override
        public String getStatusText() throws IOException {
            return clientHttpResponse.getStatusText();
        }

        @Override
        public void close() {
            clientHttpResponse.close();
        }
    }
}
