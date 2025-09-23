package routie.business.place.infrastructure.search.vworld.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import routie.business.place.infrastructure.search.vworld.api.VWorldPlaceSearchApiClient;

@Configuration
@RequiredArgsConstructor
public class VWorldPlaceSearchApiClientConfig {

    private final ObjectMapper objectMapper;
    @Value("${v-world.api.key}")
    private String vWorldApiKey;

    @Bean
    public VWorldPlaceSearchApiClient vWorldApiClient() {
        RestClient restClient = RestClient.builder()
                .baseUrl("https://api.vworld.kr/req")
                .requestInterceptor(new HttpResponseBodyCachingInterceptor())
                .defaultStatusHandler(new VWorldPlaceSearchApiClientErrorHandler(objectMapper))
                .build();

        return new VWorldPlaceSearchApiClient(restClient, vWorldApiKey);
    }
}
