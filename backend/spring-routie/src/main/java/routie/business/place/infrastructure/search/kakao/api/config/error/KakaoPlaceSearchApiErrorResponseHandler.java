package routie.business.place.infrastructure.search.kakao.api.config.error;

import routie.business.place.infrastructure.search.kakao.api.dto.response.KakaoPlaceSearchApiErrorResponse;

public interface KakaoPlaceSearchApiErrorResponseHandler {

    boolean canHandle(KakaoPlaceSearchApiErrorResponse errorResponse);

    void handle(KakaoPlaceSearchApiErrorResponse errorResponse);
}
