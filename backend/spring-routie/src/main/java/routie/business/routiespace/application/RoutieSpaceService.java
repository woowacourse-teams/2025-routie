package routie.business.routiespace.application;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.hashtag.domain.HashtagRepository;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.participant.domain.GuestRepository;
import routie.business.participant.domain.User;
import routie.business.place.domain.PlaceRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.business.routiespace.domain.evenet.RoutieSpaceUpdateEvent;
import routie.business.routiespace.ui.dto.request.RoutieSpaceUpdateRequest;
import routie.business.routiespace.ui.dto.response.RoutieSpaceCreateResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceListResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceReadResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceUpdateResponse;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoutieSpaceService {

    private final ApplicationEventPublisher applicationEventPublisher;
    private final RoutieSpaceRepository routieSpaceRepository;
    private final RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;
    private final PlaceLikeRepository placeLikeRepository;
    private final HashtagRepository hashtagRepository;
    private final PlaceRepository placeRepository;
    private final GuestRepository guestRepository;

    public RoutieSpaceReadResponse getRoutieSpace(final String routieSpaceIdentifier) {
        final RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);

        return RoutieSpaceReadResponse.from(routieSpace);
    }

    public RoutieSpaceListResponse getRoutieSpaces(final User user) {
        final List<RoutieSpace> routieSpaces = routieSpaceRepository.findByOwnerOrderByCreatedAtDesc(user);

        return RoutieSpaceListResponse.from(routieSpaces);
    }

    @Transactional
    public RoutieSpaceCreateResponse addRoutieSpace() {
        final RoutieSpace routieSpace = RoutieSpace.withIdentifierProvider(
                null,
                routieSpaceIdentifierProvider
        );
        routieSpaceRepository.save(routieSpace);
        return RoutieSpaceCreateResponse.from(routieSpace);
    }

    @Transactional
    public RoutieSpaceCreateResponse addRoutieSpaceV2(final User user) {
        final RoutieSpace routieSpace = RoutieSpace.withIdentifierProvider(
                user,
                routieSpaceIdentifierProvider
        );
        routieSpaceRepository.save(routieSpace);
        return RoutieSpaceCreateResponse.from(routieSpace);
    }

    @Transactional
    public RoutieSpaceUpdateResponse modifyRoutieSpace(
            final String routieSpaceIdentifier,
            final RoutieSpaceUpdateRequest routieSpaceUpdateRequest
    ) {
        // TODO: 예외처리 구조 개선 예정
        final RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);
        routieSpace.updateName(routieSpaceUpdateRequest.name());

        return new RoutieSpaceUpdateResponse(routieSpace.getName());
    }

    @Transactional
    public RoutieSpaceUpdateResponse modifyRoutieSpaceV2(
            final String routieSpaceIdentifier,
            final RoutieSpaceUpdateRequest routieSpaceUpdateRequest,
            final User user
    ) {
        // TODO: 예외처리 구조 개선 예정
        final RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);
        validateOwner(user, routieSpace);
        routieSpace.updateName(routieSpaceUpdateRequest.name());

        applicationEventPublisher.publishEvent(new RoutieSpaceUpdateEvent(this, routieSpaceIdentifier));
        return new RoutieSpaceUpdateResponse(routieSpace.getName());
    }

    @Transactional
    public void deleteRoutieSpace(
            final String routieSpaceIdentifier,
            final User user
    ) {
        final RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);
        validateOwner(user, routieSpace);

        placeRepository.deletePlaceHashtagsByRoutieSpace(routieSpace);
        hashtagRepository.deleteByRoutieSpace(routieSpace);
        placeLikeRepository.deleteByRoutieSpace(routieSpace);
        guestRepository.deleteByRoutieSpace(routieSpace);
        routieSpaceRepository.delete(routieSpace);
    }

    public RoutieSpace getRoutieSpaceByRoutieSpaceIdentifier(final String routieSpaceIdentifier) {
        return routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_EXISTS));
    }

    private void validateOwner(final User user, final RoutieSpace routieSpace) {
        if (!user.getId().equals(routieSpace.getOwner().getId())) {
            throw new BusinessException(ErrorCode.ROUTIE_SPACE_NO_PERMISSION_TO_MODIFY);
        }
    }
}
