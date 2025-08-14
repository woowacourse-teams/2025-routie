package routie.place.infrastructure.search.kakao;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;
import routie.place.domain.PlaceSearcher;
import routie.place.domain.SearchedPlace;
import routie.place.infrastructure.search.kakao.api.KakaoPlaceSearchApiClient;
import routie.place.infrastructure.search.kakao.api.dto.request.KakaoPlaceSearchApiRequest;
import routie.place.infrastructure.search.kakao.api.dto.response.KakaoPlaceSearchApiResponse;
import routie.place.infrastructure.search.kakao.api.dto.response.KakaoPlaceSearchApiResponse.Document;

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

        KakaoPlaceSearchApiResponse kakaoPlaceSearchApiResponse = kakaoPlaceSearchApiClient.search(
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
            throw new IllegalArgumentException("검색어는 비어있을 수 없습니다.");
        }
    }

    private void validateSize(final Integer size) {
        if (size == null || size < 1 || size > 15) {
            throw new IllegalArgumentException("검색 결과의 크기는 1에서 15 사이여야 합니다.");
        }
    }
}
