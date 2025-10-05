package routie.business.like.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.authentication.domain.Role;
import routie.business.like.domain.PlaceLike;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.like.ui.dto.response.LikedPlacesResponse;
import routie.business.participant.domain.Guest;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GuestPlaceLikeService implements PlaceLikeService<Guest> {

    private final PlaceLikeRepository placeLikeRepository;
    private final RoutieSpaceRepository routieSpaceRepository;
    private final PlaceRepository placeRepository;

    @Transactional
    public void likePlace(final Long placeId, final String routieSpaceIdentifier, final Guest guest) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        if (!guest.getRoutieSpace().getId().equals(routieSpace.getId())) {
            throw new BusinessException(ErrorCode.ROUTIE_SPACE_FORBIDDEN_GUEST);
        }

        final Place place = placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));

        if (placeLikeRepository.findByPlaceIdAndGuestId(placeId, guest.getId()).isPresent()) {
            throw new BusinessException(ErrorCode.PLACE_LIKE_DUPLICATED);
        }

        placeLikeRepository.save(PlaceLike.of(place, guest));
    }

    @Transactional
    public void removePlaceLike(final Long placeId, final String routieSpaceIdentifier, final Guest guest) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        if (!guest.getRoutieSpace().getId().equals(routieSpace.getId())) {
            throw new BusinessException(ErrorCode.ROUTIE_SPACE_FORBIDDEN_GUEST);
        }

        placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));

        final PlaceLike placeLike = placeLikeRepository.findByPlaceIdAndGuestId(placeId, guest.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PLACE_LIKE_NOT_FOUND));

        placeLikeRepository.delete(placeLike);
    }

    public LikedPlacesResponse getLikedPlaces(final String routieSpaceIdentifier, final Guest guest) {
        final RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));

        final List<PlaceLike> placeLikes = placeLikeRepository.findByRoutieSpaceIdAndGuestId(
                routieSpace.getId(),
                guest.getId()
        );

        return LikedPlacesResponse.from(placeLikes);
    }

    @Override
    public Role getRole() {
        return Role.GUEST;
    }
}
