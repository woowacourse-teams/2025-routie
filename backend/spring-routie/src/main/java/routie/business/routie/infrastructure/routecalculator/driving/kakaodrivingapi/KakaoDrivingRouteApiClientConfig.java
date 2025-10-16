package routie.business.routie.infrastructure.routecalculator.driving.kakaodrivingapi;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestClient;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Configuration
@RequiredArgsConstructor
public class KakaoDrivingRouteApiClientConfig {

    private final ObjectMapper objectMapper;
    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    @Bean
    public KakaoDrivingRouteApiClient kakaoDrivingApiClient() {
        final RestClient restClient = RestClient.builder()
                .baseUrl("https://apis-navi.kakaomobility.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoApiKey)
                .defaultStatusHandler(new KakaoDrivingApiResponseErrorHandler(objectMapper))
                .build();

        return new KakaoDrivingRouteApiClient(restClient);
    }

    @Slf4j
    @RequiredArgsConstructor
    private static class KakaoDrivingApiResponseErrorHandler implements ResponseErrorHandler {

        private final ObjectMapper objectMapper;

        @Override
        public boolean hasError(final ClientHttpResponse response) {
            try {
                return response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError();
            } catch (final IOException ioException) {
                throw new BusinessException(ErrorCode.KAKAO_DRIVING_ROUTE_API_ERROR);
            }
        }

        @Override
        public void handleError(
                final URI url,
                final HttpMethod method,
                final ClientHttpResponse response
        ) throws IOException {
            log.warn(
                    "Kakao 길찾기 API 오류 발생: {}",
                    objectMapper.readValue(response.getBody(), KakaoDrivingApiErrorResponse.class)
            );

            throw new BusinessException(ErrorCode.KAKAO_DRIVING_ROUTE_API_ERROR);
        }

        private record KakaoDrivingApiErrorResponse(
                @JsonProperty("code") String code,
                @JsonProperty("msg") String message
        ) {
        }
    }
}
