package routie.routie.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.place.domain.Place;
import routie.place.repository.PlaceRepository;
import routie.routie.controller.dto.request.RoutieUpdateRequest;
import routie.routie.controller.dto.request.RoutieUpdateRequest.RoutiePlaceRequest;
import routie.routie.controller.dto.response.RoutieReadResponse;
import routie.routie.controller.dto.response.RoutieTimeValidationResponse;
import routie.routie.controller.dto.response.RoutieUpdateResponse;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.Route;
import routie.routie.domain.route.RouteCalculator;
import routie.routie.domain.timeperiod.TimePeriod;
import routie.routie.domain.timeperiod.TimePeriodCalculator;
import routie.routie.repository.RoutieRepository;

@Service
@RequiredArgsConstructor
public class RoutieService {

    private final RoutieRepository routieRepository;
    private final PlaceRepository placeRepository;
    private final TimePeriodCalculator timePeriodCalculator;
    private final RouteCalculator routeCalculator;

    public RoutieReadResponse getRoutie(final Long id) {
        return RoutieReadResponse.from(routieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 id의 루티를 찾을 수 없습니다.")));
    }

    @Transactional
    public RoutieUpdateResponse modifyRoutie(final Long id, final RoutieUpdateRequest request) {
        Routie routie = getRoutieById(id);

        List<Long> placeIds = request.routiePlaces().stream()
                .map(RoutiePlaceRequest::placeId)
                .toList();

        Map<Long, Place> placeMap = placeRepository.findAllById(placeIds).stream()
                .collect(Collectors.toMap(Place::getId, Function.identity()));

        List<RoutiePlace> routiePlaces = request.routiePlaces().stream()
                .map(r -> new RoutiePlace(
                        r.sequence(),
                        Optional.ofNullable(placeMap.get(r.placeId()))
                                .orElseThrow(
                                        () -> new IllegalArgumentException("해당하는 id의 장소를 찾을 수 없습니다: " + r.placeId()))
                ))
                .toList();

        routie.modify(routiePlaces);

        return RoutieUpdateResponse.from(routie);
    }

    private Routie getRoutieById(final Long id) {
        return routieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 id의 루티를 찾을 수 없습니다."));
    }

    public RoutieTimeValidationResponse validateRoutie(
            final Long routieId,
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime
    ) {
        Routie routie = routieRepository.findById(routieId)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 id의 루티를 찾을 수 없습니다."));

        Map<Integer, Route> routeByFromSequence = routeCalculator.calculateRoutes(routie.getRoutiePlaces());
        Map<Integer, TimePeriod> timePeriodBySequence = timePeriodCalculator.calculateTimePeriods(
                routie.getRoutiePlaces(),
                startDateTime,
                routeByFromSequence
        );
        
        //TODO: 검증 기능 구현

        return new RoutieTimeValidationResponse(true);
    }
}
