package routie.routie.controller.dto.response;

import java.util.List;
import routie.routie.domain.Routie;
import routie.routie.domain.RoutiePlace;

public record RoutieUpdateResponse(
        Long id,
        List<RoutiePlaceResponse> places
) {
    public static RoutieUpdateResponse from(final Routie routie) {
        return new RoutieUpdateResponse(
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
        private static RoutiePlaceResponse from(final RoutiePlace routiePlace) {
            return new RoutiePlaceResponse(
                    routiePlace.getId(),
                    routiePlace.getSequence(),
                    routiePlace.getPlace().getId()
            );
        }
    }
}
