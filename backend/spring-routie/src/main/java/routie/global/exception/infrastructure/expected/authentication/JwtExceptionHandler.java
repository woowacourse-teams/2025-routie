package routie.global.exception.infrastructure.expected.authentication;


import io.jsonwebtoken.JwtException;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import routie.global.exception.domain.ErrorCode;

/**
 * JWT 처리 과정에서 발생하는 예외를 처리하는 예외 핸들러.
 *
 * <ul>
 * <li>JWT가 만료되었을 때.</li>
 * <li>JWT의 서명이 잘못되었을 때.</li>
 * <li>JWT의 형식이 잘못되었을 때.</li>
 * <li>JWT의 클레임이 유효하지 않을 때.</li>
 * <li>기타 JWT 처리 중 발생하는 예외.</li>
 * </ul>
 */
@RestControllerAdvice
public class JwtExceptionHandler {

    @ExceptionHandler(JwtException.class)
    public ProblemDetail handle() {
        return ErrorCode.INVALID_JWT.toProblemDetail();
    }
}
