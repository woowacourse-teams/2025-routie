package routie.place.infrastructure.search.vworld.api.dto.request;

public record VWorldPlaceSearchApiRequest(
        String query,
        Integer size
) {
}
