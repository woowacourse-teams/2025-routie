package routie.place.domain;

import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PlaceSearcherTest {

    @Autowired
    private PlaceSearcher placeSearcher;

    @Test
    @Disabled
    void searchPlaceTest() {
        String query = "선릉역";
        List<SearchedPlace> searchedPlaces = placeSearcher.search(query);
        for (final SearchedPlace searchedPlace : searchedPlaces) {
            System.out.println(
                    searchedPlace.id() + ", "
                            + searchedPlace.placeName() + ", "
                            + searchedPlace.roadAddressName() + ", "
                            + searchedPlace.latitude() + ", "
                            + searchedPlace.longitude() + ", "
            );
        }
    }
}
