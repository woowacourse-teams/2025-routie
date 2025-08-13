package routie.routie.infrastructure.routecalculator.transit.googletransitapi;

import com.fasterxml.jackson.annotation.JsonProperty;
import routie.place.domain.Place;
import routie.routie.domain.RoutiePlace;

public record GoogleTransitRouteApiRequest(
        @JsonProperty("origin") CoordinateRequest origin,
        @JsonProperty("destination") CoordinateRequest destination,
        @JsonProperty("travelMode") String travelMode
) {
    public static GoogleTransitRouteApiRequest from(final RoutiePlace from, final RoutiePlace to) {
        return new GoogleTransitRouteApiRequest(
                CoordinateRequest.from(from),
                CoordinateRequest.from(to),
                "TRANSIT"
        );
    }

    public record CoordinateRequest(
            @JsonProperty("location") Location location
    ) {
        public static CoordinateRequest from(final RoutiePlace routiePlace) {
            Place place = routiePlace.getPlace();
            return new CoordinateRequest(
                    new Location(
                            new LatLng(
                                    place.getLongitude(),
                                    place.getLatitude()
                            )
                    )
            );
        }
    }

    public record Location(
            @JsonProperty("latLng") LatLng latLng
    ) {
    }

    public record LatLng(
            @JsonProperty("longitude") double longitude,
            @JsonProperty("latitude") double latitude
    ) {
    }
}
