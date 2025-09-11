package routie.business.place.infrastructure.search.kakao.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import routie.business.place.domain.SearchedPlace;

public record KakaoPlaceSearchApiResponse(
        @JsonProperty("documents") List<Document> documents,
        @JsonProperty("meta") Meta meta
) {

    public record Document(
            @JsonProperty("id") String id,
            @JsonProperty("place_name") String name,
            @JsonProperty("address_name") String addressName,
            @JsonProperty("road_address_name") String roadAddressName,
            @JsonProperty("x") Double longitude,
            @JsonProperty("y") Double latitude
    ) {

        public SearchedPlace toSearchedPlace() {
            return new SearchedPlace(
                    this.id,
                    this.name,
                    this.addressName,
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
