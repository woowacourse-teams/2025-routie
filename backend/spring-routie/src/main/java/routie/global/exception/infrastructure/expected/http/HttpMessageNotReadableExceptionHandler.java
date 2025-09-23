package routie.global.exception.infrastructure.expected.http;

import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.domain.ErrorCode;

/**
 * 요청 본문을 처리하는 과정에서 발생하는 예외를 처리하는 예외 핸들러.
 *
 * <ul>
 * <li>요청 본문이 비어 있을 때..</li>
 * <li>요청 본문의 데이터 타입이 잘못되었을 때.</li>
 * <li>요청 본문 역직렬화에 실패했을 때.</li>
 * <li>요청의 Content-Type 헤더가 지원되지 않을 때.</li>
 * <li>JSON 문법이 잘못된 형식일 때 (예: 쉼표나 중괄호 누락).</li>
 * </ul>
 */
@RestControllerAdvice
public class HttpMessageNotReadableExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handle() {
        return ErrorCode.FAIL_TO_READ_REQUEST_BODY.toProblemDetail();
    }
}
