package routie.business.place.infrastructure.search.kakao;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import routie.business.place.domain.PlaceSearcher;
import routie.business.place.domain.SearchedPlace;
import routie.business.place.infrastructure.search.kakao.api.KakaoPlaceSearchApiClient;
import routie.business.place.infrastructure.search.kakao.api.dto.request.KakaoPlaceSearchApiRequest;
import routie.business.place.infrastructure.search.kakao.api.dto.response.KakaoPlaceSearchApiResponse;
import routie.business.place.infrastructure.search.kakao.api.dto.response.KakaoPlaceSearchApiResponse.Document;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoPlaceSearcher implements PlaceSearcher {

    private final KakaoPlaceSearchApiClient kakaoPlaceSearchApiClient;

    @Override
    public boolean isAvailable() {
        return !kakaoPlaceSearchApiClient.isQuotaExceeded();
    }

    @Override
    public List<SearchedPlace> searchPlaces(final String query, final Integer size) {
        validateQuery(query);
        validateSize(size);

        final KakaoPlaceSearchApiResponse kakaoPlaceSearchApiResponse = kakaoPlaceSearchApiClient.search(
                new KakaoPlaceSearchApiRequest(query, size)
        );

        if (kakaoPlaceSearchApiResponse == null) {
            throw new BusinessException(ErrorCode.KAKAO_LOCAL_API_ERROR);
        }

        return kakaoPlaceSearchApiResponse.documents()
                .stream()
                .map(Document::toSearchedPlace)
                .toList();
    }

    private void validateQuery(final String query) {
        if (query == null || query.isBlank()) {
            throw new BusinessException(ErrorCode.SEARCH_QUERY_EMPTY);
        }
    }

    private void validateSize(final Integer size) {
        if (size == null || size < 1 || size > 15) {
            throw new BusinessException(ErrorCode.SEARCH_SIZE_INVALID_KAKAO);
        }
    }
}
