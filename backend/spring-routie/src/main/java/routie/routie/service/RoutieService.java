package routie.routie.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
import routie.routie.controller.dto.response.RoutieUpdateResponse;
import routie.routie.controller.dto.response.RoutieValidationResponse;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;
import routie.routie.domain.route.MovingStrategy;
import routie.routie.domain.route.RouteCalculationContext;
import routie.routie.domain.route.RouteCalculator;
import routie.routie.domain.route.Routes;
import routie.routie.domain.routievalidator.RoutieValidator;
import routie.routie.domain.routievalidator.ValidationContext;
import routie.routie.domain.routievalidator.ValidationResult;
import routie.routie.domain.routievalidator.ValidationStrategy;
import routie.routie.domain.timeperiod.TimePeriodCalculator;
import routie.routie.domain.timeperiod.TimePeriods;
import routie.routie.repository.RoutiePlaceRepository;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.repository.RoutieSpaceRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoutieService {

    private static final int MIN_ROUTIE_PLACES_FOR_ROUTE = 2;

    private final RoutieSpaceRepository routieSpaceRepository;
    private final PlaceRepository placeRepository;
    private final RoutiePlaceRepository routiePlaceRepository;
    private final TimePeriodCalculator timePeriodCalculator;
    private final RouteCalculator routeCalculator;
    private final RoutieValidator routieValidator;

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

    public RoutieReadResponse getRoutie(
            final String routieSpaceIdentifier,
            final LocalDateTime startDateTime,
            final MovingStrategy movingStrategy
    ) {
        Routie routie = getRoutieSpaceByIdentifier(routieSpaceIdentifier).getRoutie();
        List<RoutiePlace> routiePlaces = routie.getRoutiePlaces();

        Routes routes = getRoutes(startDateTime, routiePlaces, movingStrategy);
        TimePeriods timePeriods = getTimePeriods(startDateTime, movingStrategy, routes, routiePlaces);

        return RoutieReadResponse.from(routie, routes.orderedList(), timePeriods);
    }

    private Routes getRoutes(
            final LocalDateTime startDateTime,
            final List<RoutiePlace> routiePlaces,
            final MovingStrategy movingStrategy
    ) {
        Routes routes = Routes.empty();
        RouteCalculationContext routeCalculationContext = new RouteCalculationContext(
                startDateTime,
                routiePlaces,
                movingStrategy
        );

        if (routiePlaces.size() >= MIN_ROUTIE_PLACES_FOR_ROUTE && movingStrategy != null) {
            routes = routeCalculator.calculateRoutes(routeCalculationContext);
        }
        return routes;
    }

    private TimePeriods getTimePeriods(
            final LocalDateTime startDateTime,
            final MovingStrategy movingStrategy,
            final Routes routes,
            final List<RoutiePlace> routiePlaces
    ) {
        TimePeriods timePeriods = TimePeriods.empty();
        if (startDateTime != null && movingStrategy != null) {
            timePeriods = timePeriodCalculator.calculateTimePeriods(startDateTime, routes, routiePlaces);
        }
        return timePeriods;
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

        List<RoutiePlace> routiePlaces = routieUpdateRequest.routiePlaces().stream()
                .map(r -> new RoutiePlace(
                        r.sequence(),
                        Optional.ofNullable(placeMap.get(r.placeId()))
                                .orElseThrow(
                                        () -> new IllegalArgumentException("해당하는 id의 장소를 찾을 수 없습니다: " + r.placeId()))
                )).toList();

        routieSpace.getRoutie().updateRoutiePlaces(routiePlaces);

        RoutieUpdateResponse.from(routie);
    }

    private RoutieSpace getRoutieSpaceByIdentifier(final String routieSpaceIdentifier) {
        return routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 식별자의 루티 스페이스를 찾을 수 없습니다."));
    }

    public RoutieValidationResponse validateRoutie(
            final String routieSpaceIdentifier,
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime,
            final MovingStrategy movingStrategy
    ) {
        Routie routie = getRoutieSpaceByIdentifier(routieSpaceIdentifier).getRoutie();
        List<RoutiePlace> routiePlaces = routie.getRoutiePlaces();
        Routes routes = getRoutes(startDateTime, routiePlaces, movingStrategy);

        TimePeriods timePeriods = timePeriodCalculator.calculateTimePeriods(
                startDateTime,
                routes,
                routiePlaces
        );

        ValidationContext validationContext = new ValidationContext(startDateTime, endDateTime, timePeriods);
        List<ValidationResult> validationResults = new ArrayList<>();

        for (final ValidationStrategy validationStrategy : ValidationStrategy.values()) {
            ValidationResult validationResult = routieValidator.validate(validationContext, validationStrategy);
            validationResults.add(validationResult);
        }

        return RoutieValidationResponse.from(validationResults);
    }

    @Transactional
    public void removeRoutiePlace(final String routieSpaceIdentifier, final Long placeId) {
        RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        Place place = getPlaceByRoutieSpaceAndPlaceId(routieSpace, placeId);
        Routie routie = routieSpace.getRoutie();
        routie.removePlace(place);
    }
}
