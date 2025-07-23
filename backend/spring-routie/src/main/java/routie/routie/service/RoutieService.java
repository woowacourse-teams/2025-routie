package routie.routie.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.place.domain.Place;
import routie.place.repository.PlaceRepository;
import routie.routie.controller.dto.request.RoutieUpdateRequest;
import routie.routie.controller.dto.request.RoutieUpdateRequest.RoutiePlaceRequest;
import routie.routie.controller.dto.response.RoutieReadResponse;
import routie.routie.controller.dto.response.RoutieUpdateResponse;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.repository.RoutieRepository;

@AllArgsConstructor
@Service
public class RoutieService {

    private final RoutieRepository routieRepository;
    private final PlaceRepository placeRepository;

    public RoutieReadResponse getRoutie(final Long id) {
        return RoutieReadResponse.from(routieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 id의 루티를 찾을 수 없습니다.")));
    }

    @Transactional
    public RoutieUpdateResponse modifyRoutie(final Long id, final RoutieUpdateRequest request) {
        Routie routie = findRoutieById(id);

        List<Long> placeIds = request.routiePlaces().stream()
                .map(RoutiePlaceRequest::placeId)
                .toList();

        Map<Long, Place> placeMap = placeRepository.findAllById(placeIds).stream()
                .collect(Collectors.toMap(Place::getId, Function.identity()));

        List<RoutiePlace> routiePlaces = request.routiePlaces().stream()
                .map(r -> new RoutiePlace(
                        r.sequence(),
                        r.stayDurationMinutes(),
                        Optional.ofNullable(placeMap.get(r.placeId()))
                                .orElseThrow(
                                        () -> new IllegalArgumentException("해당하는 id의 장소를 찾을 수 없습니다: " + r.placeId()))
                ))
                .toList();

        routie.modify(routiePlaces);

        return RoutieUpdateResponse.from(routie);
    }

    private Routie findRoutieById(final Long id) {
        return routieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 id의 루티를 찾을 수 없습니다."));
    }
}
