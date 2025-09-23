package routie.business.place.infrastructure.search;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import routie.business.place.domain.PlaceSearcher;
import routie.business.place.infrastructure.search.kakao.KakaoPlaceSearcher;
import routie.business.place.infrastructure.search.vworld.VWorldPlaceSearcher;

import java.util.List;

@Configuration
public class PlaceSearcherConfig {

    @Bean
    @Primary
    public PlaceSearcher placeSearcher(
            final KakaoPlaceSearcher kakaoPlaceSearcher,
            final VWorldPlaceSearcher vWorldPlaceSearcher
    ) {
        return new PlaceSearcherComposite(List.of(kakaoPlaceSearcher, vWorldPlaceSearcher));
    }
}
