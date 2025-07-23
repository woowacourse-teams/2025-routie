package routie.routie.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import routie.routie.controller.dto.response.RoutieReadResponse;
import routie.routie.repository.RoutieRepository;

@AllArgsConstructor
@Service
public class RoutieService {

    private final RoutieRepository routieRepository;


    public RoutieReadResponse getRoutie(final Long id) {
        return RoutieReadResponse.from(routieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 id의 루티를 찾을 수 없습니다.")));
    }
}
