package routie.routie.infrastructure.routecalculator.transit.googletransitapi;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import routie.place.domain.Place;
import routie.routie.domain.RoutiePlace;

public final class GoogleTransitRouteApiRequest {
    private final LocalDateTime startDateTime;
    private final CoordinateRequest origin;
    private final CoordinateRequest destination;
    private final String travelMode;

    public GoogleTransitRouteApiRequest(
            @JsonProperty("departureTime") final LocalDateTime startDateTime,
            @JsonProperty("origin") final CoordinateRequest origin,
            @JsonProperty("destination") final CoordinateRequest destination
    ) {
        this.startDateTime = startDateTime;
        this.origin = origin;
        this.destination = destination;
        this.travelMode = "TRANSIT";
    }

    public static GoogleTransitRouteApiRequest from(
            final LocalDateTime startDateTime,
            final RoutiePlace from,
            final RoutiePlace to
    ) {
        return new GoogleTransitRouteApiRequest(
                startDateTime,
                CoordinateRequest.from(from),
                CoordinateRequest.from(to)
        );
    }

    @JsonProperty("origin")
    public CoordinateRequest origin() {
        return origin;
    }

    @JsonProperty("destination")
    public CoordinateRequest destination() {
        return destination;
    }

    @JsonProperty("travelMode")
    public String travelMode() {
        return travelMode;
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
