package routie.business.place.domain;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class PlaceSearcherTest {

    @Autowired
    private PlaceSearcher placeSearcher;

    @Test
    @Disabled
    void searchPlacesPlaceTest() {
        final String query = "선릉역";
        final List<SearchedPlace> searchedPlaces = placeSearcher.searchPlaces(query, 5);
        for (final SearchedPlace searchedPlace : searchedPlaces) {
            System.out.println(
                    searchedPlace.searchedPlaceId() + ", "
                            + searchedPlace.name() + ", "
                            + searchedPlace.addressName() + ", "
                            + searchedPlace.roadAddressName() + ", "
                            + searchedPlace.longitude() + ", "
                            + searchedPlace.latitude()
            );
        }
    }
}
