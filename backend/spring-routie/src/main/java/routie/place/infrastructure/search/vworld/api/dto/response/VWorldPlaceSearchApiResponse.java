package routie.place.infrastructure.search.vworld.api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import routie.place.domain.SearchedPlace;

public record VWorldPlaceSearchApiResponse(
        @JsonProperty("response") Response response
) {

    public boolean isDataNotFound() {
        return response.isNotFound();
    }

    public List<SearchedPlace> toSearchedPlaces() {
        return response.toSearchedPlaces();
    }

    public record Response(
            @JsonProperty("service") Service service,
            @JsonProperty("status") String status,
            @JsonProperty("record") Record record,
            @JsonProperty("page") Page page,
            @JsonProperty("result") Result result
    ) {

        private List<SearchedPlace> toSearchedPlaces() {
            return result.toSearchedPlaces();
        }

        private boolean isNotFound() {
            return "NOT_FOUND".equals(status);
        }

        public record Service(
                @JsonProperty("name") String name,
                @JsonProperty("version") String version,
                @JsonProperty("operation") String operation,
                @JsonProperty("time") String time
        ) {
        }

        public record Record(
                @JsonProperty("total") String total,
                @JsonProperty("current") String current
        ) {
        }

        public record Page(
                @JsonProperty("total") String total,
                @JsonProperty("current") String current,
                @JsonProperty("size") String size
        ) {
        }

        public record Result(
                @JsonProperty("crs") String crs,
                @JsonProperty("type") String type,
                @JsonProperty("items") List<Item> items
        ) {

            private List<SearchedPlace> toSearchedPlaces() {
                return items.stream()
                        .map(Item::toSearchedPlace)
                        .toList();
            }

            public record Item(
                    @JsonProperty("id") String id,
                    @JsonProperty("title") String name,
                    @JsonProperty("category") String category,
                    @JsonProperty("address") Address address,
                    @JsonProperty("point") Point point
            ) {

                private SearchedPlace toSearchedPlace() {
                    return new SearchedPlace(
                            id,
                            name,
                            address.parcel(),
                            address.road(),
                            point.longitude(),
                            point.latitude()
                    );
                }

                public record Address(
                        @JsonProperty("parcel") String parcel,
                        @JsonProperty("road") String road
                ) {
                }

                public record Point(
                        @JsonProperty("x") Double longitude,
                        @JsonProperty("y") Double latitude
                ) {
                }
            }
        }
    }
}
