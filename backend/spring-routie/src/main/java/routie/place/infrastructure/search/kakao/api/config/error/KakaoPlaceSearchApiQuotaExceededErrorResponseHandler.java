package routie.place.infrastructure.search.kakao.api.config.error;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import routie.place.infrastructure.search.kakao.api.dto.response.KakaoPlaceSearchApiErrorResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoPlaceSearchApiQuotaExceededErrorResponseHandler implements KakaoPlaceSearchApiErrorResponseHandler {

    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    public boolean canHandle(final KakaoPlaceSearchApiErrorResponse errorResponse) {
        return errorResponse.isQuotaExceeded();
    }

    @Override
    public void handle(final KakaoPlaceSearchApiErrorResponse errorResponse) {
        log.warn("카카오 로컬 API 쿼터 초과");
        applicationEventPublisher.publishEvent(new QuotaExceededEvent(this));
    }
}
