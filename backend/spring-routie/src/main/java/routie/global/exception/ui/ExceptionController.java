package routie.global.exception.ui;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.ExceptionResolver;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionController {

    private final ExceptionResolver exceptionResolver;

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(final Exception ex) {
        ExceptionDetail exceptionDetail = exceptionResolver.resolve(ex);
        return exceptionDetail.toProblemDetail();
    }
}
