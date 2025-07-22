package routie.routiespace.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.routiespace.controller.dto.request.RoutieSpaceNameRequest;
import routie.routiespace.controller.dto.request.UpdateRoutieSpaceNameRequest;
import routie.routiespace.controller.dto.response.RoutieSpaceNameResponse;
import routie.routiespace.controller.dto.response.UpdateRoutieSpaceNameResponse;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.routiespace.repository.RoutieSpaceRepository;

@Service
@RequiredArgsConstructor
public class RoutieSpaceService {

    private final RoutieSpaceRepository routieSpaceRepository;
    private final RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    @Transactional(readOnly = true)
    public RoutieSpaceNameResponse getRoutieSpaceName(final RoutieSpaceNameRequest routieSpaceNameRequest) {
        RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceNameRequest.identifier())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 루티 스페이스입니다."));

        return RoutieSpaceNameResponse.from(routieSpace);
    }

    @Transactional
    public RoutieSpace addRoutieSpace() {
        RoutieSpace routieSpace = RoutieSpace.from(routieSpaceIdentifierProvider);
        return routieSpaceRepository.save(routieSpace);
    }

    @Transactional
    public UpdateRoutieSpaceNameResponse modifyRoutieSpaceName(
            final String routieSpaceIdentifier,
            final UpdateRoutieSpaceNameRequest updateRoutieSpaceNameRequest
    ) {
        // TODO: 예외처리 구조 개선 예정
        RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 루티 스페이스입니다."));

        routieSpace.updateName(updateRoutieSpaceNameRequest.name());

        return new UpdateRoutieSpaceNameResponse(routieSpace.getName());
    }
}
