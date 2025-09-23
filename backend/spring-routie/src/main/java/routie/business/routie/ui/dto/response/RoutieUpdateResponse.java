package routie.business.routie.ui.dto.response;

import java.util.List;
import routie.business.routie.domain.Routie;
import routie.business.routie.domain.RoutiePlace;

public record RoutieUpdateResponse(
        List<RoutiePlaceResponse> places
) {
    public static RoutieUpdateResponse from(final Routie routie) {
        return new RoutieUpdateResponse(
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
