package routie.global.exception.domain;

public record ExceptionContext<T extends Exception>(
        T exception
) {

}
