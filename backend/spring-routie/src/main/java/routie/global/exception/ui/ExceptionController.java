package routie.global.exception.ui;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.application.ExceptionResolverService;
import routie.global.exception.domain.ExceptionResolvingRequest;
import routie.global.exception.domain.ExceptionResolvingResponse;

@RestControllerAdvice
@RequiredArgsConstructor
public class ExceptionController {

    private final ExceptionResolverService exceptionResolverService;

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(final Exception exception) {
        ExceptionResolvingRequest<Exception> exceptionResolvingRequest = new ExceptionResolvingRequest<>(exception);

        ExceptionResolvingResponse exceptionResolvingResponse = exceptionResolverService.resolve(
                exceptionResolvingRequest
        );
        ProblemDetail problemDetail = ProblemDetail.forStatus(exceptionResolvingResponse.status());
        problemDetail.setDetail(exceptionResolvingResponse.detail());
        problemDetail.setProperty("code", exceptionResolvingResponse.code());

        return problemDetail;
    }
}
