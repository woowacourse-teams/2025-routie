package routie.business.like.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.like.domain.PlaceLike;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.like.ui.dto.response.LikedPlacesResponse;
import routie.business.participant.domain.User;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserPlaceLikeService {

    private final PlaceLikeRepository placeLikeRepository;
    private final RoutieSpaceRepository routieSpaceRepository;
    private final PlaceRepository placeRepository;

    @Deprecated
    @Transactional
    public void likePlace(final Long placeId, final String routieSpaceIdentifier) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        final Place place = placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));

        placeLikeRepository.save(new PlaceLike(place, null, null));
    }

    @Transactional
    public void likePlaceV2(final Long placeId, final String routieSpaceIdentifier, final User user) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        final Place place = placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));

        if (placeLikeRepository.findByPlaceIdAndUserId(placeId, user.getId()).isPresent()) {
            throw new BusinessException(ErrorCode.PLACE_LIKE_DUPLICATED);
        }

        placeLikeRepository.save(PlaceLike.of(place, user));
    }

    @Transactional
    public void removePlaceLike(final Long placeId, final String routieSpaceIdentifier, final User user) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));

        final PlaceLike placeLike = placeLikeRepository.findByPlaceIdAndUserId(placeId, user.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PLACE_LIKE_NOT_FOUND));

        placeLikeRepository.delete(placeLike);
    }

    public LikedPlacesResponse getLikedPlaces(final String routieSpaceIdentifier, final User user) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        final List<PlaceLike> placeLikes = placeLikeRepository.findByRoutieSpaceIdAndUserId(routieSpace.getId(),
                        user.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PLACE_LIKE_NOT_FOUND));

        return LikedPlacesResponse.from(placeLikes);
    }
}
