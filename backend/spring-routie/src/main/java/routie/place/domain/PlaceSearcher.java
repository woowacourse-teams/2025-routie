package routie.place.domain;

import java.util.List;

public interface PlaceSearcher {

    boolean isAvailable();

    List<SearchedPlace> searchPlaces(String query, Integer size);
}
