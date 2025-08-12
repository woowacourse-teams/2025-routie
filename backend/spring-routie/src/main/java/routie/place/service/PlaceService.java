package routie.place.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.place.controller.dto.request.PlaceCreateRequest;
import routie.place.controller.dto.request.PlaceUpdateRequest;
import routie.place.controller.dto.response.PlaceCreateResponse;
import routie.place.controller.dto.response.PlaceListResponse;
import routie.place.controller.dto.response.PlaceReadResponse;
import routie.place.domain.Place;
import routie.place.repository.PlaceClosedDayOfWeekRepository;
import routie.place.repository.PlaceRepository;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.repository.RoutieSpaceRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final RoutieSpaceRepository routieSpaceRepository;
    private final PlaceClosedDayOfWeekRepository placeClosedDayOfWeekRepository;

    public PlaceReadResponse getPlace(final String routieSpaceIdentifier, final long placeId) {
        final RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        final Place place = getPlaceByIdAndRoutieSpace(placeId, routieSpace);
        return PlaceReadResponse.from(place);
    }

    @Transactional
    public PlaceCreateResponse addPlace(
            final String routieSpaceIdentifier,
            final PlaceCreateRequest placeCreateRequest
    ) {
        RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("해당 루티 스페이스를 찾을 수 없습니다."));

        Place place = Place.create(
                placeCreateRequest.name(),
                placeCreateRequest.roadAddressName(),
                placeCreateRequest.longitude(),
                placeCreateRequest.latitude(),
                placeCreateRequest.stayDurationMinutes(),
                placeCreateRequest.openAt(),
                placeCreateRequest.closeAt(),
                placeCreateRequest.breakStartAt(),
                placeCreateRequest.breakEndAt(),
                routieSpace,
                placeCreateRequest.closedDayOfWeeks()
        );
        return new PlaceCreateResponse(placeRepository.save(place).getId());
    }

    public PlaceListResponse readPlaces(final String routieSpaceIdentifier) {
        RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("해당 루티 스페이스를 찾을 수 없습니다."));
        final List<Place> places = routieSpace.getPlaces();
        return PlaceListResponse.from(places);
    }

    @Transactional
    public void modifyPlace(
            final PlaceUpdateRequest placeUpdateRequest,
            final String routieSpaceIdentifier,
            final long placeId
    ) {
        final RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        final Place place = getPlaceByIdAndRoutieSpace(placeId, routieSpace);

        place.getPlaceClosedDayOfWeeks()
                .forEach(closedDayOfWeek -> placeClosedDayOfWeekRepository.deleteById(closedDayOfWeek.getId()));

        place.modify(
                placeUpdateRequest.stayDurationMinutes(),
                placeUpdateRequest.openAt(),
                placeUpdateRequest.closeAt(),
                placeUpdateRequest.breakStartAt(),
                placeUpdateRequest.breakEndAt(),
                placeUpdateRequest.closedDayOfWeeks()
        );
    }

    @Transactional
    public void removePlace(final String routieSpaceIdentifier, final long placeId) {
        RoutieSpace routieSpace = getRoutieSpaceByIdentifier(routieSpaceIdentifier);
        if (!placeRepository.existsByIdAndRoutieSpace(placeId, routieSpace)) {
            throw new IllegalArgumentException("해당 장소를 찾을 수 없습니다.");
        }
        placeRepository.deleteById(placeId);
    }

    private RoutieSpace getRoutieSpaceByIdentifier(final String routieSpaceIdentifier) {
        return routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("해당 루티 스페이스를 찾을 수 없습니다."));
    }

    public Place getPlaceByIdAndRoutieSpace(final long placeId, final RoutieSpace routieSpace) {
        return placeRepository.findByIdAndRoutieSpace(placeId, routieSpace)
                .orElseThrow(() -> new IllegalArgumentException("해당 장소를 찾을 수 없습니다."));
    }
}
