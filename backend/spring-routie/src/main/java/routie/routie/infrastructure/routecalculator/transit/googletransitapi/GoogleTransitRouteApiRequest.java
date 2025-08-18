package routie.routie.infrastructure.routecalculator.transit.googletransitapi;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import lombok.Getter;
import routie.place.domain.Place;
import routie.routie.domain.RoutiePlace;

@Getter
public final class GoogleTransitRouteApiRequest {
    @JsonProperty("departureTime")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private final ZonedDateTime startDateTime;

    @JsonProperty("origin")
    private final CoordinateRequest origin;

    @JsonProperty("destination")
    private final CoordinateRequest destination;

    @JsonProperty("travelMode")
    private final String travelMode;

    private GoogleTransitRouteApiRequest(
            final ZonedDateTime startDateTime,
            final CoordinateRequest origin,
            final CoordinateRequest destination
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
        ZonedDateTime zonedDateTime = startDateTime.atZone(ZoneId.of("Asia/Seoul"));

        return new GoogleTransitRouteApiRequest(
                zonedDateTime,
                CoordinateRequest.from(from),
                CoordinateRequest.from(to)
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
