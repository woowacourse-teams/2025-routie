package routie.place.infrastructure.search;

import java.util.List;
import routie.place.domain.SearchedPlace;

public record KakaoPlaceSearchResponse(
        List<Document> documents,
        Meta meta
) {

    public record Document(
            String id,
            String place_name,
            String road_address_name,
            double x, // longitude
            double y  // latitude
    ) {

        public SearchedPlace toSearchedPlace() {
            return new SearchedPlace(
                    this.id,
                    this.place_name,
                    this.road_address_name,
                    this.x,
                    this.y
            );
        }
    }

    public record Meta(
            int total_count,
            int pageable_count,
            boolean is_end
    ) {
    }
}
