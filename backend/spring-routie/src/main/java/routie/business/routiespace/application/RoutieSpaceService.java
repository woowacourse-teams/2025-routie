package routie.business.routiespace.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.like.domain.PlaceLikeRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.business.routiespace.ui.dto.request.RoutieSpaceUpdateRequest;
import routie.business.routiespace.ui.dto.response.RoutieSpaceCreateResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceListResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceReadResponse;
import routie.business.routiespace.ui.dto.response.RoutieSpaceUpdateResponse;
import routie.business.user.domain.User;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoutieSpaceService {

    private final RoutieSpaceRepository routieSpaceRepository;
    private final RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;
    private final PlaceLikeRepository placeLikeRepository;

    public RoutieSpaceReadResponse getRoutieSpace(final String routieSpaceIdentifier) {
        RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);

        return RoutieSpaceReadResponse.from(routieSpace);
    }

    public RoutieSpaceListResponse getRoutieSpaces(final User user) {
        List<RoutieSpace> routieSpaces = routieSpaceRepository.findByOwner(user);

        return RoutieSpaceListResponse.from(routieSpaces);
    }

    @Transactional
    public RoutieSpaceCreateResponse addRoutieSpace() {
        RoutieSpace routieSpace = RoutieSpace.withIdentifierProvider(
                null,
                routieSpaceIdentifierProvider
        );
        routieSpaceRepository.save(routieSpace);
        return RoutieSpaceCreateResponse.from(routieSpace);
    }

    @Transactional
    public RoutieSpaceCreateResponse addRoutieSpaceV2(final User user) {
        RoutieSpace routieSpace = RoutieSpace.withIdentifierProvider(
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
        RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);
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
        RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);
        validateOwner(user, routieSpace);
        routieSpace.updateName(routieSpaceUpdateRequest.name());

        return new RoutieSpaceUpdateResponse(routieSpace.getName());
    }

    @Transactional
    public void deleteRoutieSpace(
            final String routieSpaceIdentifier,
            final User user
    ) {
        RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);
        validateOwner(user, routieSpace);

        placeLikeRepository.deleteByRoutieSpaceId(routieSpace.getId());
        routieSpaceRepository.delete(routieSpace);
    }

    private RoutieSpace getRoutieSpaceByRoutieSpaceIdentifier(final String routieSpaceIdentifier) {
        return routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_EXISTS));
    }

    private void validateOwner(final User user, final RoutieSpace routieSpace) {
        if (!user.getId().equals(routieSpace.getOwner().getId())) {
            throw new BusinessException(ErrorCode.ROUTIE_SPACE_NO_PERMISSION_TO_MODIFY);
        }
    }
}
