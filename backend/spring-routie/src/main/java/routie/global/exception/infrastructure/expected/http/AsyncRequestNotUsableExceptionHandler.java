package routie.global.exception.infrastructure.expected.http;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;

/**
 * 비동기 요청이 더 이상 유효하지 않을 때 발생하는 예외를 처리하는 예외 핸들러.
 *
 * <ul>
 * <li>비동기 요청이 타임아웃되었거나 취소된 경우.</li>
 * <li>비동기 요청을 처리하는 동안 클라이언트가 연결을 끊은 경우.</li>
 * </ul>
 */
@RestControllerAdvice
public class AsyncRequestNotUsableExceptionHandler {

    @ExceptionHandler(AsyncRequestNotUsableException.class)
    public void handle(final AsyncRequestNotUsableException exception) {
    }
}
