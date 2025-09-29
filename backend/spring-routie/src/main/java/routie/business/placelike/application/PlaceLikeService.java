package routie.business.placelike.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceRepository;
import routie.business.placelike.domain.PlaceLikeRepository;
import routie.business.placelike.domain.PlaceLike;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
public class PlaceLikeService {

    private final PlaceLikeRepository placeLikeRepository;
    private final RoutieSpaceRepository routieSpaceRepository;
    private final PlaceRepository placeRepository;

    public void likePlace(final Long placeId, final String routieSpaceIdentifier) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        final Place place = placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));

        placeLikeRepository.save(new PlaceLike(place));
    }
}
