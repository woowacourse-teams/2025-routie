package routie.routiespace.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.routiespace.controller.dto.request.RoutieSpaceUpdateRequest;
import routie.routiespace.controller.dto.response.RoutieSpaceCreateResponse;
import routie.routiespace.controller.dto.response.RoutieSpaceReadResponse;
import routie.routiespace.controller.dto.response.RoutieSpaceUpdateResponse;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.routiespace.repository.RoutieSpaceRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoutieSpaceService {

    private final RoutieSpaceRepository routieSpaceRepository;
    private final RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    public RoutieSpaceReadResponse getRoutieSpace(final String routieSpaceIdentifier) {
        RoutieSpace routieSpace = getRoutieSpaceByRoutieSpaceIdentifier(routieSpaceIdentifier);

        return RoutieSpaceReadResponse.from(routieSpace);
    }

    @Transactional
    public RoutieSpaceCreateResponse addRoutieSpace() {
        RoutieSpace routieSpace = RoutieSpace.from(routieSpaceIdentifierProvider);
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

    private RoutieSpace getRoutieSpaceByRoutieSpaceIdentifier(final String routieSpaceIdentifier) {
        return routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 루티 스페이스입니다."));
    }
}
