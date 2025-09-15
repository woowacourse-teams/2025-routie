package routie.global.exception.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.application.ExceptionResolverService;
import routie.global.exception.domain.ExceptionDetail;

@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionController {

    private final ExceptionResolverService exceptionResolverService;

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(final Exception exception) {
        ExceptionDetail exceptionDetail = exceptionResolverService.resolve(exception);
        ProblemDetail problemDetail = ProblemDetail.forStatus(exceptionDetail.status());
        problemDetail.setDetail(exceptionDetail.detail());
        problemDetail.setProperty("code", exceptionDetail.code());

        return problemDetail;
    }
}
