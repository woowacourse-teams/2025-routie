package routie.routie.infrastructure.routecalculator.transit.googletransitapi;

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
import routie.exception.BusinessException;
import routie.exception.ErrorCode;

@Configuration
@RequiredArgsConstructor
public class GoogleTransitRouteApiClientConfig {

    private final ObjectMapper objectMapper;
    @Value("${google.api.key}")
    private String googleApiKey;

    @Bean
    public GoogleTransitRouteApiClient googleTransitApiClient() {
        RestClient restClient = RestClient.builder()
                .baseUrl("https://routes.googleapis.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, APPLICATION_JSON_VALUE)
                .defaultHeader("X-Goog-Api-Key", googleApiKey)
                .defaultHeader("X-Goog-FieldMask", "routes.distanceMeters,routes.duration")
                .defaultStatusHandler(new GoogleTransitApiResponseErrorHandler(objectMapper))
                .build();

        return new GoogleTransitRouteApiClient(restClient);
    }

    @Slf4j
    @RequiredArgsConstructor
    private static class GoogleTransitApiResponseErrorHandler implements ResponseErrorHandler {

        private final ObjectMapper objectMapper;

        @Override
        public boolean hasError(final ClientHttpResponse response) {
            try {
                return response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError();
            } catch (final IOException ioException) {
                throw new BusinessException(ErrorCode.GOOGLE_TRANSIT_ROUTE_API_ERROR);
            }
        }

        @Override
        public void handleError(
                final URI url,
                final HttpMethod method,
                final ClientHttpResponse response
        ) throws IOException {
            log.warn(
                    "Google 길찾기 API 오류 발생: {}",
                    objectMapper.readValue(response.getBody(), GoogleTransitApiErrorResponse.class)
            );

            throw new BusinessException(ErrorCode.GOOGLE_TRANSIT_ROUTE_API_ERROR);
        }

        private record GoogleTransitApiErrorResponse(
                @JsonProperty("code") String code,
                @JsonProperty("msg") String message
        ) {
        }
    }
}
