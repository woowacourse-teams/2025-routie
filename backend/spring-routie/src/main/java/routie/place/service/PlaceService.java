package routie.place.service;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.place.domain.Place;
import routie.place.domain.PlaceClosedWeekday;
import routie.place.repository.PlaceClosedWeekdayRepository;
import routie.place.repository.PlaceRepository;
import routie.routiespace.controller.dto.request.PlaceCreateRequest;
import routie.routiespace.controller.dto.response.PlaceCreateResponse;
import routie.routiespace.controller.dto.response.PlaceListResponse;
import routie.routiespace.domain.RoutieSpace;
import routie.routiespace.repository.RoutieSpaceRepository;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final RoutieSpaceRepository routieSpaceRepository;


    @Transactional
    public PlaceCreateResponse add(final PlaceCreateRequest placeCreateRequest, final String routieSpaceIdentifier) {
        RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("해당 루티 스페이스를 찾을 수 없습니다."));

        Place place = Place.create(
                placeCreateRequest.name(),
                placeCreateRequest.address(),
                placeCreateRequest.stayDurationMinutes(),
                placeCreateRequest.openAt(),
                placeCreateRequest.closeAt(),
                placeCreateRequest.breakStartAt(),
                placeCreateRequest.breakEndAt(),
                routieSpace,
                placeCreateRequest.closedDays()
        );
        return new PlaceCreateResponse(placeRepository.save(place).getId());
    }

    public PlaceListResponse readPlaces(final String routieSpaceIdentifier) {
        RoutieSpace routieSpace = routieSpaceRepository.findByIdentifier(routieSpaceIdentifier)
                .orElseThrow(() -> new IllegalArgumentException("해당 루티 스페이스를 찾을 수 없습니다."));
        final List<Place> places = routieSpace.getPlaces();
        return PlaceListResponse.from(places);
    }
}
