package routie.place.domain;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;
import routie.place.repository.PlaceRepository;

@TestComponent
public class PlaceFixture {

    private static int placeCounter = 0;
    private final PlaceRepository placeRepository;

    @Autowired
    public PlaceFixture(final PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public Place getPlaceWithoutId() {
        return getPlacesWithoutId(1).getFirst();
    }

    public List<Place> getPlacesWithoutId(final int count) {
        List<Place> places = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            String index = String.valueOf(placeCounter++);

            Place place = new PlaceBuilder()
                    .name("테스트 장소" + index)
                    .roadAddressName("테스트 도로명 주소" + index)
                    .addressName("테스트 지번 주소" + index)
                    .longitude(127.04896282498558)
                    .latitude(37.504497373023206)
                    .stayDurationMinutes(60)
                    .openAt(LocalTime.of(0, 0))
                    .closeAt(LocalTime.of(23, 59))
                    .breakStartAt(null)
                    .breakEndAt(null)
                    .routieSpace(null)
                    .placeClosedDayOfWeeks(List.of())
                    .build();
            places.add(place);
        }

        return places;
    }

    public Place persistAndGetPlace() {
        return persistAndGetPlaces(1).getFirst();
    }

    public List<Place> persistAndGetPlaces(final int count) {
        return getPlacesWithoutId(count).stream()
                .map(placeRepository::save)
                .toList();
    }
}
