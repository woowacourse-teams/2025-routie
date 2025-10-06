package routie.business.like.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.authentication.domain.Role;
import routie.business.like.domain.PlaceLike;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.like.ui.dto.response.LikedPlacesResponse;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserRepository;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserPlaceLikeService implements PlaceLikeService<User> {

    private final PlaceLikeRepository placeLikeRepository;
    private final RoutieSpaceRepository routieSpaceRepository;
    private final PlaceRepository placeRepository;
    private final UserRepository userRepository;

    @Deprecated
    @Transactional
    public void likePlaceV0(final Long placeId, final String routieSpaceIdentifier) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        final Place place = placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));

        // 삭제될 메서드 및 로직, 엔티티 변경에 따라 하위호환성 보장을 위해 삽입
        final User user = userRepository.findAll()
                .getFirst();

        placeLikeRepository.save(new PlaceLike(place, user, null));
    }

    @Transactional
    public void likePlace(final Long placeId, final String routieSpaceIdentifier, final User user) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        final Place place = placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));

        if (placeLikeRepository.existsByPlaceIdAndUserId(placeId, user.getId())) {
            throw new BusinessException(ErrorCode.PLACE_LIKE_DUPLICATED);
        }

        placeLikeRepository.save(user.likePlace(place));
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

        final List<PlaceLike> placeLikes = placeLikeRepository.findByRoutieSpaceIdAndUserId(
                routieSpace.getId(),
                user.getId()
        );

        return LikedPlacesResponse.from(placeLikes);
    }

    @Override
    public Role getRole() {
        return Role.USER;
    }
}
