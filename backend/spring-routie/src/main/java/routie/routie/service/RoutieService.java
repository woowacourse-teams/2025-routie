package routie.routie.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationStrategy;
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
    private final RoutiePlaceRepository routiePlaceRepository;
    private final TimePeriodCalculator timePeriodCalculator;
    private final RouteCalculator routeCalculator;
    private final RoutieValidator routieValidator;

    public RoutieReadResponse getRoutie(final String routieSpaceIdentifier) {
        Routie routie = getRoutieSpaceByIdentifier(routieSpaceIdentifier).getRoutie();
        Map<RoutiePlace, Route> routeByFromRoutiePlace = routeCalculator.calculateRoutes(routie.getRoutiePlaces());
        List<Route> routes = new ArrayList<>(routeByFromRoutiePlace.values());

        return RoutieReadResponse.from(routie, routes);
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

        routieSpace.updateRoutie(Routie.create(routiePlaces));

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

        ValidationContext validationContext = new ValidationContext(startDateTime, endDateTime,
                timePeriodByRoutiePlace);

        boolean isStrategyValid = Arrays.stream(ValidationStrategy.values())
                .allMatch(validationStrategy ->
                        routieValidator.isValid(validationContext, validationStrategy));

        return new RoutieTimeValidationResponse(isStrategyValid);
    }
}
