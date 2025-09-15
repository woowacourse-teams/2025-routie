package routie.global.exception.domain;

public interface ExceptionResolver {

    ExceptionDetail resolve(final ExceptionContext<?> exceptionContext);
}
