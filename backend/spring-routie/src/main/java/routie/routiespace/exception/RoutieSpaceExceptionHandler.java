package routie.routiespace.exception;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RoutieSpaceExceptionHandler {

    // TODO: 예외 형식 통일을 위해 임시로 ProblemDetail 사용
    // 추후 예외처리 방식 통일 필요
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleException(final Exception e) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(500);
        problemDetail.setTitle("Internal Server Error");
        problemDetail.setDetail(e.getMessage());
        return problemDetail;
    }
}
