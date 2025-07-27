package routie.routie.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
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
import routie.routie.domain.ValidationStrategy;
import routie.routie.domain.ValidityCalculator;
import routie.routie.domain.route.Route;
import routie.routie.domain.route.RouteCalculator;
import routie.routie.domain.timeperiod.TimePeriod;
import routie.routie.domain.timeperiod.TimePeriodCalculator;
import routie.routie.repository.RoutiePlaceRepository;
import routie.routie.repository.RoutieRepository;

@Service
@RequiredArgsConstructor
public class RoutieService {

    private final RoutieRepository routieRepository;
    private final PlaceRepository placeRepository;
    private final TimePeriodCalculator timePeriodCalculator;
    private final RouteCalculator routeCalculator;
    private final ValidityCalculator validityCalculator;
    private final RoutiePlaceRepository routiePlaceRepository;

    public RoutieReadResponse getRoutie(final Long routieId) {
        Routie routie = getRoutieById(routieId);
        Map<RoutiePlace, Route> routeByFromRoutiePlace = routeCalculator.calculateRoutes(routie.getRoutiePlaces());
        List<Route> routes = new ArrayList<>(routeByFromRoutiePlace.values());

        return RoutieReadResponse.from(routie, routes);
    }

    @Transactional
    public void modifyRoutie(final Long routieId, final RoutieUpdateRequest routieUpdateRequest) {
        Routie routie = getRoutieById(routieId);

        List<Long> placeIds = routieUpdateRequest.routiePlaces().stream()
                .map(RoutiePlaceRequest::placeId)
                .toList();

        Map<Long, Place> placeMap = placeRepository.findAllById(placeIds).stream()
                .collect(Collectors.toMap(Place::getId, Function.identity()));

        List<Long> routiePlaceIds = routie.getRoutiePlaces().stream()
                .map(RoutiePlace::getId)
                .toList();

        routiePlaceRepository.deleteAllById(routiePlaceIds);

        List<RoutiePlace> routiePlaces = routieUpdateRequest.routiePlaces().stream()
                .map(r -> new RoutiePlace(
                        r.sequence(),
                        Optional.ofNullable(placeMap.get(r.placeId()))
                                .orElseThrow(
                                        () -> new IllegalArgumentException("해당하는 id의 장소를 찾을 수 없습니다: " + r.placeId()))
                )).toList();

        routie.modify(routiePlaces);

        RoutieUpdateResponse.from(routie);
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
        Routie routie = getRoutieById(routieId);

        Map<RoutiePlace, Route> routeByFromRoutiePlace = routeCalculator.calculateRoutes(routie.getRoutiePlaces());
        Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace = timePeriodCalculator.calculateTimePeriods(
                routie.getRoutiePlaces(),
                startDateTime,
                routeByFromRoutiePlace
        );

        boolean isDefaultValid = calculateDefaultValidity(startDateTime, endDateTime, timePeriodByRoutiePlace);
        boolean isStrategyValid = Arrays.stream(ValidationStrategy.values())
                .allMatch(validationStrategy -> validityCalculator.calculateValidity(timePeriodByRoutiePlace,
                        validationStrategy));

        return new RoutieTimeValidationResponse(isDefaultValid && isStrategyValid);
    }

    private boolean calculateDefaultValidity(
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime,
            final Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace
    ) {
        return calculateTotalTimeValidity(startDateTime, endDateTime,
                (LinkedHashMap<RoutiePlace, TimePeriod>) timePeriodByRoutiePlace);
    }

    private boolean calculateTotalTimeValidity(
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime,
            final LinkedHashMap<RoutiePlace, TimePeriod> timePeriodByRoutiePlace
    ) {
        LocalDateTime firstPeriodStartTime = timePeriodByRoutiePlace.firstEntry().getValue().startTime();
        LocalDateTime lastPeriodEndTime = timePeriodByRoutiePlace.lastEntry().getValue().endTime();

        return !firstPeriodStartTime.isBefore(startDateTime) && !lastPeriodEndTime.isAfter(endDateTime);
    }
}
