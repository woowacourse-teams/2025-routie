package routie.routiespace.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.routiespace.repository.RoutieSpaceRepository;

@Service
@RequiredArgsConstructor
public class RoutieSpaceService {

    private final RoutieSpaceRepository routieSpaceRepository;
    private final RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    @Transactional
    public RoutieSpace addRoutieSpace() {
        RoutieSpace routieSpace = RoutieSpace.from(routieSpaceIdentifierProvider);
        return routieSpaceRepository.save(routieSpace);
    }
}
