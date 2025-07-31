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
import routie.routie.controller.dto.request.RoutiePlaceCreateRequest;
import routie.routie.controller.dto.request.RoutieUpdateRequest;
import routie.routie.controller.dto.request.RoutieUpdateRequest.RoutiePlaceRequest;
import routie.routie.controller.dto.response.RoutiePlaceCreateResponse;
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
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.repository.RoutieSpaceRepository;

@Service
@RequiredArgsConstructor
public class RoutieService {

    private final RoutieSpaceRepository routieSpaceRepository;
    private final PlaceRepository placeRepository;
    private final TimePeriodCalculator timePeriodCalculator;
    private final RouteCalculator routeCalculator;
    private final ValidityCalculator validityCalculator;
    private final RoutiePlaceRepository routiePlaceRepository;

    @Transactional
    public RoutiePlaceCreateResponse addRoutiePlace(
            final String routieSpaceIdentifier,
            final RoutiePlaceCreateRequest routiePlaceCreateRequest
    ) {
        RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        Routie routie = routieSpace.getRoutie();
        Place place = getPlaceByRoutieSpaceAndPlaceId(routieSpace, routiePlaceCreateRequest.placeId());
        RoutiePlace routiePlace = routie.createLastRoutiePlace(place);
        routiePlaceRepository.save(routiePlace);
        return RoutiePlaceCreateResponse.from(routiePlace);
    }

    private Place getPlaceByRoutieSpaceAndPlaceId(final RoutieSpace routieSpace, final Long placeId) {
        return placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new IllegalArgumentException("루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId));
    }

    public RoutieReadResponse getRoutie(final String routieSpaceIdentifier, final LocalDateTime startDateTime) {
        Routie routie = getRoutieSpaceByIdentifier(routieSpaceIdentifier).getRoutie();
        Map<RoutiePlace, Route> routeByFromRoutiePlace = routeCalculator.calculateRoutes(routie.getRoutiePlaces());
        List<Route> routes = new ArrayList<>(routeByFromRoutiePlace.values());

        Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace = null;
        if (startDateTime != null) {
            timePeriodByRoutiePlace = timePeriodCalculator.calculateTimePeriods(
                    routie.getRoutiePlaces(),
                    startDateTime,
                    routeByFromRoutiePlace
            );
        }
        return RoutieReadResponse.from(routie, routes, timePeriodByRoutiePlace);
    }

    @Transactional
    public void modifyRoutie(final String routieSpaceIdentifier, final RoutieUpdateRequest routieUpdateRequest) {
        RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        Routie routie = routieSpace.getRoutie();

        List<Long> placeIds = routieUpdateRequest.routiePlaces().stream()
                .map(RoutiePlaceRequest::placeId)
                .toList();

        Map<Long, Place> placeMap = placeRepository.findAllById(placeIds).stream()
                .collect(Collectors.toMap(Place::getId, Function.identity()));

//        List<Long> routiePlaceIds = routie.getRoutiePlaces().stream()
//                .map(RoutiePlace::getId)
//                .toList();
//        routiePlaceRepository.deleteAllById(routiePlaceIds);

        routie.getRoutiePlaces().clear(); // 급한 예외로 인해 새로 작성된 줄

        List<RoutiePlace> routiePlaces = routieUpdateRequest.routiePlaces().stream()
                .map(r -> new RoutiePlace(
                        r.sequence(),
                        Optional.ofNullable(placeMap.get(r.placeId()))
                                .orElseThrow(
                                        () -> new IllegalArgumentException("해당하는 id의 장소를 찾을 수 없습니다: " + r.placeId()))
                )).toList();

        routieSpace.getRoutie().getRoutiePlaces().addAll(routiePlaces); // 급한 예외로 인해 새로 작성한 줄
//        routieSpace.updateRoutie(Routie.create(routiePlaces));

        RoutieUpdateResponse.from(routie);
    }

    private RoutieSpace getRoutieSpaceByIdentifier(final String routieSpaceIdentifier) {
        return routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 식별자의 루티 스페이스를 찾을 수 없습니다."));
    }

    public RoutieTimeValidationResponse validateRoutie(
            final String routieSpaceIdentifier,
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime
    ) {
        Routie routie = getRoutieSpaceByIdentifier(routieSpaceIdentifier).getRoutie();

        Map<RoutiePlace, Route> routeByFromRoutiePlace = routeCalculator.calculateRoutes(routie.getRoutiePlaces());
        Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace = timePeriodCalculator.calculateTimePeriods(
                routie.getRoutiePlaces(),
                startDateTime,
                routeByFromRoutiePlace
        );

        boolean isDefaultValid = calculateDefaultValidity(startDateTime, endDateTime, timePeriodByRoutiePlace);
        boolean isStrategyValid = Arrays.stream(ValidationStrategy.values())
                .allMatch(validationStrategy -> validityCalculator.calculateValidity(
                        timePeriodByRoutiePlace,
                        validationStrategy
                ));

        return new RoutieTimeValidationResponse(isDefaultValid && isStrategyValid);
    }

    private boolean calculateDefaultValidity(
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime,
            final Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace
    ) {
        if (timePeriodByRoutiePlace.isEmpty()) {
            return true;
        }
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

    @Transactional
    public void removeRoutiePlace(final String routieSpaceIdentifier, final Long placeId) {
        RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        Place place = getPlaceByRoutieSpaceAndPlaceId(routieSpace, placeId);
        Routie routie = routieSpace.getRoutie();
        routie.removePlace(place);
    }
}
