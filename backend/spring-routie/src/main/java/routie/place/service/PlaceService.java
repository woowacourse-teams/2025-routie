package routie.place.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.place.controller.dto.request.PlaceUpdateRequest;
import routie.place.controller.dto.response.PlaceReadResponse;
import routie.place.domain.Place;
import routie.place.repository.PlaceRepository;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;

    public PlaceReadResponse getPlaceDetail(final long placeId) {
        final Place place = getPlaceById(placeId);
        return PlaceReadResponse.from(place);
    }

    @Transactional
    public void modifyPlace(final PlaceUpdateRequest placeUpdateRequest, final long placeId) {
        final Place place = getPlaceById(placeId);
        place.modify(
                placeUpdateRequest.stayDurationMinutes(),
                placeUpdateRequest.openAt(),
                placeUpdateRequest.closeAt(),
                placeUpdateRequest.breakStartAt(),
                placeUpdateRequest.breakEndAt(),
                placeUpdateRequest.closedDays()
        );
    }

    @Transactional
    public void removePlace(final long placeId) {
        if (!placeRepository.existsById(placeId)) {
            throw new IllegalArgumentException("해당 장소를 찾을 수 없습니다.");
        }
        placeRepository.deleteById(placeId);
    }

    public Place getPlaceById(final long placeId) {
        return placeRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 장소를 찾을 수 없습니다."));
    }
}
