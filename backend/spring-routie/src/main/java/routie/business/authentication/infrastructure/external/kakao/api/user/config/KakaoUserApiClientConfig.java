package routie.business.authentication.infrastructure.external.kakao.api.user.config;

import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import routie.business.authentication.infrastructure.external.kakao.api.user.KakaoUserApiClient;
import routie.business.authentication.infrastructure.external.kakao.api.user.config.error.KakaoUserApiErrorHandler;


@Configuration
@RequiredArgsConstructor
public class KakaoUserApiClientConfig {

    private final KakaoUserApiErrorHandler kakaoUserApiErrorHandler;

    @Bean
    public KakaoUserApiClient kakaoUserApiClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(2));
        requestFactory.setReadTimeout(Duration.ofSeconds(4));

        RestClient restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl("https://kapi.kakao.com/v1/user")
                .defaultStatusHandler(kakaoUserApiErrorHandler)
                .build();

        return new KakaoUserApiClient(restClient);
    }
}
