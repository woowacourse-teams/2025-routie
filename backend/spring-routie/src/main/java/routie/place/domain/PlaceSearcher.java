package routie.place.domain;

import java.util.List;

public interface PlaceSearcher {

    List<SearchedPlace> search(String query);
}
