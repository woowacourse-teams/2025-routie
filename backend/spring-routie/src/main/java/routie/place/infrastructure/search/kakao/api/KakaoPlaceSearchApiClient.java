package routie.place.infrastructure.search.kakao.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestClient;
import routie.place.infrastructure.search.kakao.api.config.error.QuotaExceededEvent;
import routie.place.infrastructure.search.kakao.api.dto.request.KakaoPlaceSearchApiRequest;
import routie.place.infrastructure.search.kakao.api.dto.response.KakaoPlaceSearchApiResponse;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@RequiredArgsConstructor
public class KakaoPlaceSearchApiClient {

    private final RestClient restClient;
    private final AtomicBoolean isQuotaExceeded = new AtomicBoolean(false);

    public KakaoPlaceSearchApiResponse search(
            final KakaoPlaceSearchApiRequest kakaoPlaceSearchApiRequest
    ) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/local/search/keyword.json")
                        .queryParam("query", kakaoPlaceSearchApiRequest.query())
                        .queryParam("size", kakaoPlaceSearchApiRequest.size())
                        .build()
                )
                .retrieve()
                .body(KakaoPlaceSearchApiResponse.class);
    }

    public boolean isQuotaExceeded() {
        return isQuotaExceeded.get();
    }

    @EventListener
    public void handleQuotaExceededEvent(final QuotaExceededEvent quotaExceededEvent) {
        this.isQuotaExceeded.set(true);
    }

    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Seoul")
    public void resetQuotaExceededFlag() {
        if (isQuotaExceeded.get()) {
            log.atInfo().log("카카오 로컬 API 쿼터 초과 상태를 초기화합니다.");
            isQuotaExceeded.set(false);
        }
    }
}
