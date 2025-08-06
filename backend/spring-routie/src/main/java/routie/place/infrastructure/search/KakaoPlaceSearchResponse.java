package routie.place.infrastructure.search;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import routie.place.domain.SearchedPlace;

public record KakaoPlaceSearchResponse(
        @JsonProperty("documents") List<Document> documents,
        @JsonProperty("meta") Meta meta
) {

    public record Document(
            @JsonProperty("id") String id,
            @JsonProperty("place_name") String placeName,
            @JsonProperty("road_address_name") String roadAddressName,
            @JsonProperty("x") String longitude,
            @JsonProperty("y") String latitude
    ) {

        public SearchedPlace toSearchedPlace() {
            return new SearchedPlace(
                    this.id,
                    this.placeName,
                    this.roadAddressName,
                    this.longitude,
                    this.latitude
            );
        }
    }

    public record Meta(
            @JsonProperty("totalCount") int totalCount,
            @JsonProperty("pageable_count") int pageableCount,
            @JsonProperty("is_end") boolean isEnd
    ) {
    }
}
