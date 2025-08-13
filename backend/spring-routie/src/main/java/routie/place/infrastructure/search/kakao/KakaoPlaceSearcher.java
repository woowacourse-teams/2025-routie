package routie.place.infrastructure.search.kakao;

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

import java.util.List;

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

}
