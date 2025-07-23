package routie.routiespace.controller.dto.request;

public record RoutieSpaceNameRequest(
        String identifier
) {

    public static RoutieSpaceNameRequest from(final String identifier) {
        return new RoutieSpaceNameRequest(identifier);
    }
}
