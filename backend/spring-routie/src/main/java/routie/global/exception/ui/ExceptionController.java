package routie.global.exception.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.domain.ExceptionDetail;
import routie.global.exception.domain.ExceptionResolver;

@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionController {

    private final ExceptionResolver exceptionResolver;

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(final Exception exception) {
        ExceptionDetail exceptionDetail = exceptionResolver.resolve(exception);
        return toProblemDetail(exceptionDetail);
    }

    public ProblemDetail toProblemDetail(final ExceptionDetail exceptionDetail) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(exceptionDetail.status());
        problemDetail.setDetail(exceptionDetail.detail());
        problemDetail.setProperty("code", exceptionDetail.code());
        return problemDetail;
    }
}
