package routie.business.routie.application;

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
import routie.business.place.domain.Place;
import routie.business.place.domain.PlaceRepository;
import routie.business.routie.domain.Routie;
import routie.business.routie.domain.RoutiePlace;
import routie.business.routie.domain.RoutiePlaceRepository;
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
        routiePlaceRepository.deleteByRoutieSpaceId(routieSpace.getId());

        Map<Long, Place> placeMap = getPlaceMap(routieUpdateRequest);
        List<RoutiePlace> newRoutiePlaces = createNewRoutiePlaces(routieUpdateRequest, placeMap);

        routieSpace.getRoutie().getRoutiePlaces().addAll(newRoutiePlaces);
    }

    private Map<Long, Place> getPlaceMap(final RoutieUpdateRequest request) {
        List<Long> placeIds = request.routiePlaces().stream()
                .map(RoutiePlaceRequest::placeId)
                .toList();

        return placeRepository.findAllById(placeIds).stream()
                .collect(Collectors.toMap(Place::getId, Function.identity()));
    }

    private List<RoutiePlace> createNewRoutiePlaces(final RoutieUpdateRequest request,
                                                    final Map<Long, Place> placeMap) {
        return request.routiePlaces().stream()
                .map(r -> new RoutiePlace(
                        r.sequence(),
                        Optional.ofNullable(placeMap.get(r.placeId()))
                                .orElseThrow(() -> new BusinessException(
                                        ErrorCode.PLACE_NOT_FOUND_BY_ID,
                                        "해당하는 id의 장소를 찾을 수 없습니다: " + r.placeId()
                                ))
                )).toList();
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
        Routie routie = getRoutieSpaceByIdentifier(routieSpaceIdentifier).getRoutie();
        List<RoutiePlace> routiePlaces = routie.getRoutiePlaces();
        Routes routes = getRoutes(startDateTime, routiePlaces, movingStrategy);
        TimePeriods timePeriods = timePeriodCalculator.calculateTimePeriods(startDateTime, routes, routiePlaces);

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
