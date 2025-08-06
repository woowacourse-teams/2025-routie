package routie.place.infrastructure.search;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class KakaoLocalRestClientConfig {

    private final String kakaoApiKey;
    private final ObjectMapper objectMapper;

    public KakaoLocalRestClientConfig(
            @Value("${kakao.api.key}") final String kakaoApiKey,
            final ObjectMapper objectMapper
    ) {
        this.kakaoApiKey = kakaoApiKey;
        this.objectMapper = objectMapper;
    }

    @Bean
    public RestClient kakaoRestClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(2));
        requestFactory.setReadTimeout(Duration.ofSeconds(4));

        return RestClient.builder()
                .requestFactory(requestFactory)
                .baseUrl("https://dapi.kakao.com")
                .defaultHeader("Authorization", "KakaoAK " + kakaoApiKey)
                .defaultStatusHandler(new KakaoLocalResponseErrorHandler(objectMapper))
                .build();
    }
}
