package routie.business.routie.ui.dto.response;

import routie.business.routie.domain.RoutiePlace;

public record RoutiePlaceCreateResponse(
        Long id,
        int sequence,
        Long placeId
) {

    public static RoutiePlaceCreateResponse from(final RoutiePlace routiePlace) {
        return new RoutiePlaceCreateResponse(
                routiePlace.getId(),
                routiePlace.getSequence(),
                routiePlace.getPlace().getId()
        );
    }
}
