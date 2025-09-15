package routie.global.exception.domain;

public record ExceptionResolvingRequest<T extends Exception>(
        T exception
) {
}
