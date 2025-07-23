package routie.routie.controller.dto.response;

import java.util.List;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;

public record RoutieReadResponse(
        Long id,
        List<RoutiePlaceResponse> places
) {
    public static RoutieReadResponse from(final Routie routie) {
        return new RoutieReadResponse(
                routie.getId(),
                routie.getRoutiePlaces().stream()
                        .map(RoutiePlaceResponse::from)
                        .toList()
        );
    }

    private record RoutiePlaceResponse(
            Long id,
            int sequence,
            Long placeId
    ) {
        public static RoutiePlaceResponse from(final RoutiePlace routiePlace) {
            return new RoutiePlaceResponse(
                    routiePlace.getId(),
                    routiePlace.getSequence(),
                    routiePlace.getPlace().getId()
            );
        }
    }
}
