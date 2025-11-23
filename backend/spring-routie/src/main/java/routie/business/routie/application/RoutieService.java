package routie.business.routie.application;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceRepository;
import routie.business.routie.domain.Routie;
import routie.business.routie.domain.RoutiePlace;
import routie.business.routie.domain.RoutiePlaceRepository;
import routie.business.routie.domain.event.RoutePlaceCreateEvent;
import routie.business.routie.domain.event.RoutePlaceDeleteEvent;
import routie.business.routie.domain.event.RoutieUpdateEvent;
import routie.business.routie.domain.route.MovingStrategy;
import routie.business.routie.domain.route.RouteCalculationContext;
import routie.business.routie.domain.route.RouteCalculator;
import routie.business.routie.domain.route.Routes;
import routie.business.routie.domain.routievalidator.RoutieValidator;
import routie.business.routie.domain.routievalidator.ValidationContext;
import routie.business.routie.domain.routievalidator.ValidationResult;
import routie.business.routie.domain.routievalidator.ValidationStrategy;
import routie.business.routie.domain.timeperiod.TimePeriodCalculator;
import routie.business.routie.domain.timeperiod.TimePeriods;
import routie.business.routie.ui.dto.request.RoutiePlaceCreateRequest;
import routie.business.routie.ui.dto.request.RoutieUpdateRequest;
import routie.business.routie.ui.dto.request.RoutieUpdateRequest.RoutiePlaceRequest;
import routie.business.routie.ui.dto.response.RoutiePlaceCreateResponse;
import routie.business.routie.ui.dto.response.RoutieReadResponse;
import routie.business.routie.ui.dto.response.RoutieValidationResponse;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoutieService {

    private static final int MIN_ROUTIE_PLACES_FOR_ROUTE = 2;

    private final RoutieValidator routieValidator;
    private final PlaceRepository placeRepository;
    private final RouteCalculator routeCalculator;
    private final TimePeriodCalculator timePeriodCalculator;
    private final RoutiePlaceRepository routiePlaceRepository;
    private final RoutieSpaceRepository routieSpaceRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final EntityManager entityManager;

    @Transactional
    public RoutiePlaceCreateResponse addRoutiePlace(
            final String routieSpaceIdentifier,
            final RoutiePlaceCreateRequest routiePlaceCreateRequest
    ) {
        final RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        final Routie routie = routieSpace.getRoutie();
        final Place place = getPlaceByRoutieSpaceAndPlaceId(routieSpace, routiePlaceCreateRequest.placeId());
        final RoutiePlace routiePlace = routie.createLastRoutiePlace(place);
        routiePlaceRepository.save(routiePlace);
        applicationEventPublisher.publishEvent(new RoutePlaceCreateEvent(this, place.getId(), routieSpaceIdentifier));
        return RoutiePlaceCreateResponse.from(routiePlace);
    }

    private Place getPlaceByRoutieSpaceAndPlaceId(final RoutieSpace routieSpace, final Long placeId) {
        return placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_IN_ROUTIE_SPACE,
                        "루티 스페이스 내에서 해당하는 장소를 찾을 수 없습니다: " + placeId
                ));
    }

    public RoutieReadResponse getRoutie(
            final String routieSpaceIdentifier,
            final LocalDateTime startDateTime,
            final MovingStrategy movingStrategy
    ) {
        final Routie routie = getRoutieSpaceByIdentifier(routieSpaceIdentifier).getRoutie();
        final List<RoutiePlace> routiePlaces = routie.getRoutiePlaces();
        final Routes routes = getRoutes(startDateTime, routiePlaces, movingStrategy);
        final TimePeriods timePeriods = getTimePeriods(startDateTime, movingStrategy, routes, routiePlaces);

        return RoutieReadResponse.from(routie, routes.orderedList(), timePeriods);
    }

    private Routes getRoutes(
            final LocalDateTime startDateTime,
            final List<RoutiePlace> routiePlaces,
            final MovingStrategy movingStrategy
    ) {
        Routes routes = Routes.empty();
        final RouteCalculationContext routeCalculationContext = new RouteCalculationContext(
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
        final RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        final Routie routie = routieSpace.getRoutie();
        final List<RoutiePlace> routiePlaces = routie.getRoutiePlaces();

        final Map<Long, RoutiePlace> existingRoutiePlacesByPlaceId = routiePlaces.stream()
                .collect(Collectors.toMap(rp -> rp.getPlace().getId(), Function.identity()));

        final Set<Long> requestedPlaceIds = routieUpdateRequest.routiePlaces().stream()
                .map(RoutiePlaceRequest::placeId)
                .collect(Collectors.toSet());

        removeUnrequestedPlaces(routiePlaces, requestedPlaceIds);

        final Map<Long, Place> newPlacesByPlaceId = fetchNewPlaces(
                existingRoutiePlacesByPlaceId.keySet(),
                requestedPlaceIds
        );

        applyRoutiePlaceChanges(
                routieUpdateRequest.routiePlaces(),
                routiePlaces,
                existingRoutiePlacesByPlaceId,
                newPlacesByPlaceId
        );

        applicationEventPublisher.publishEvent(new RoutieUpdateEvent(this, routieSpaceIdentifier));
    }

    private void removeUnrequestedPlaces(final List<RoutiePlace> routiePlaces, final Set<Long> requestedPlaceIds) {
        final List<RoutiePlace> toRemove = routiePlaces.stream()
                .filter(routiePlace -> !requestedPlaceIds.contains(routiePlace.getPlace().getId()))
                .toList();

        if (!toRemove.isEmpty()) {
            final List<Long> idsToRemove = toRemove.stream()
                    .map(RoutiePlace::getId)
                    .toList();
            routiePlaceRepository.deleteAllById(idsToRemove);
            routiePlaces.removeAll(toRemove);
        }
    }

    private Map<Long, Place> fetchNewPlaces(final Set<Long> existingPlaceIds, final Set<Long> requestedPlaceIds) {
        final Set<Long> newPlaceIds = requestedPlaceIds.stream()
                .filter(id -> !existingPlaceIds.contains(id))
                .collect(Collectors.toSet());

        return placeRepository.findAllById(newPlaceIds).stream()
                .collect(Collectors.toMap(Place::getId, Function.identity()));
    }

    private void applyRoutiePlaceChanges(
            final List<RoutiePlaceRequest> routiePlaceRequests,
            final List<RoutiePlace> routiePlaces,
            final Map<Long, RoutiePlace> updatedRoutiePlacesWithId,
            final Map<Long, Place> newPlacesWithId
    ) {
        for (final RoutiePlaceRequest request : routiePlaceRequests) {
            if (updatedRoutiePlacesWithId.containsKey(request.placeId())) {
                final RoutiePlace existingPlace = updatedRoutiePlacesWithId.get(request.placeId());
                existingPlace.updateSequence(request.sequence());
                continue;
            }

            if (!newPlacesWithId.containsKey(request.placeId())) {
                throw new BusinessException(
                        ErrorCode.PLACE_NOT_FOUND_BY_ID,
                        "해당하는 id의 장소를 찾을 수 없습니다: " + request.placeId()
                );
            }
            final Place place = newPlacesWithId.get(request.placeId());
            routiePlaces.add(new RoutiePlace(request.sequence(), place));
        }
    }

    private RoutieSpace getRoutieSpaceByIdentifier(final String routieSpaceIdentifier) {
        return routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND_BY_IDENTIFIER));
    }

    public RoutieValidationResponse validateRoutie(
            final String routieSpaceIdentifier,
            final LocalDateTime startDateTime,
            final LocalDateTime endDateTime,
            final MovingStrategy movingStrategy
    ) {
        final Routie routie = getRoutieSpaceByIdentifier(routieSpaceIdentifier).getRoutie();
        final List<RoutiePlace> routiePlaces = routie.getRoutiePlaces();
        final Routes routes = getRoutes(startDateTime, routiePlaces, movingStrategy);
        final TimePeriods timePeriods = timePeriodCalculator.calculateTimePeriods(startDateTime, routes, routiePlaces);

        final ValidationContext validationContext = new ValidationContext(startDateTime, endDateTime, timePeriods);
        final List<ValidationResult> validationResults = new ArrayList<>();

        for (final ValidationStrategy validationStrategy : ValidationStrategy.values()) {
            final ValidationResult validationResult = routieValidator.validate(validationContext, validationStrategy);
            validationResults.add(validationResult);
        }

        return RoutieValidationResponse.from(validationResults);
    }

    @Transactional
    public void removeRoutiePlace(final String routieSpaceIdentifier, final Long placeId) {
        final RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        final Place place = getPlaceByRoutieSpaceAndPlaceId(routieSpace, placeId);
        final Routie routie = routieSpace.getRoutie();
        routie.removePlace(place);
        applicationEventPublisher.publishEvent(new RoutePlaceDeleteEvent(this, placeId, routieSpaceIdentifier));
    }
}
