package routie.place.infrastructure.search;

import java.util.List;

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
    }

    public record Meta(
            int total_count,
            int pageable_count,
            boolean is_end
    ) {
    }
}
