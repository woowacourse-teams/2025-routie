package routie.business.place.infrastructure.search.kakao.api.config;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import routie.business.place.infrastructure.search.kakao.api.KakaoPlaceSearchApiClient;
import routie.business.place.infrastructure.search.kakao.api.config.error.KakaoPlaceSearchApiErrorHandler;

@Configuration
public class KakaoPlaceSearchApiClientConfig {

    private final String kakaoApiKey;
    private final KakaoPlaceSearchApiErrorHandler kakaoPlaceSearchApiErrorHandler;

    public KakaoPlaceSearchApiClientConfig(
            @Value("${kakao.api.key}") final String kakaoApiKey,
            final KakaoPlaceSearchApiErrorHandler kakaoPlaceSearchApiErrorHandler
    ) {
        this.kakaoApiKey = kakaoApiKey;
        this.kakaoPlaceSearchApiErrorHandler = kakaoPlaceSearchApiErrorHandler;
    }

    @Bean
    public KakaoPlaceSearchApiClient kakaoLocalApiClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(2));
        requestFactory.setReadTimeout(Duration.ofSeconds(4));

        RestClient restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl("https://dapi.kakao.com")
                .defaultHeader("Authorization", "KakaoAK " + kakaoApiKey)
                .defaultStatusHandler(kakaoPlaceSearchApiErrorHandler)
                .build();

        return new KakaoPlaceSearchApiClient(restClient);
    }
}
