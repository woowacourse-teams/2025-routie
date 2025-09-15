package routie.global.exception.domain;

public interface ExceptionResolver {

    ExceptionResolvingResponse resolve(final ExceptionResolvingRequest<?> exceptionResolvingRequest);
}
