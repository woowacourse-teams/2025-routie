package routie.global.exception.infrastructure.config;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.support.BeanDefinitionValidationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

class ExceptionHandlerPostProcessorTest {

    private ExceptionHandlerPostProcessor validator;

    @BeforeEach
    void setUp() {
        validator = new ExceptionHandlerPostProcessor();
    }

    @Nested
    @DisplayName("검증 성공 케이스")
    class ValidCases {

        @Test
        @DisplayName("@ExceptionHandler 의 예외와 파라메터의 예외가 같다면, 예외를 발생시키지 않는다")
        void validHandlerDoesNotThrowException() {
            // given
            @RestControllerAdvice
            class ValidControllerAdvice {
                @ExceptionHandler(IllegalArgumentException.class)
                public String handleException(final IllegalArgumentException exception) {
                    return null;
                }
            }

            // when & then
            assertDoesNotThrow(
                    () -> validator.postProcessBeforeInitialization(new ValidControllerAdvice(),
                            "validControllerAdvice"));
        }

        @Test
        @DisplayName("예외 파라미터가 없다면 예외를 발생시키지 않는다")
        void validHandlerWithoutParameterDoesNotThrowException() {
            // given
            @RestControllerAdvice
            class ValidControllerAdvice {
                @ExceptionHandler(IllegalArgumentException.class)
                public String handleException(final HttpServletRequest request) {
                    return null;
                }
            }

            // when & then
            assertDoesNotThrow(
                    () -> validator.postProcessBeforeInitialization(new ValidControllerAdvice(),
                            "validControllerAdvice"));
        }

        @Test
        @DisplayName("예외 파라미터와 더불어 다른 파라메터도 바인딩받을 수 있다.")
        void canBindOtherParameters() {
            // given
            @RestControllerAdvice
            class ValidControllerAdvice {
                @ExceptionHandler(IllegalArgumentException.class)
                public String handleException(
                        final IllegalArgumentException exception,
                        final HttpServletRequest request,
                        final HttpServletResponse response
                ) {
                    return null;
                }
            }

            // when & then
            assertDoesNotThrow(
                    () -> validator.postProcessBeforeInitialization(new ValidControllerAdvice(),
                            "validControllerAdvice"));
        }
    }

    @Nested
    @DisplayName("검증 실패 케이스")
    class InvalidCases {

        @Test
        @DisplayName("ExceptionHandler에 예외 클래스가 없는 경우 예외를 던진다")
        void handlerWithNoExceptionClassThrowsException() {
            // given
            @RestControllerAdvice
            class InvalidControllerAdvice {
                @ExceptionHandler
                public String handleException(final IllegalArgumentException exception) {
                    return null;
                }
            }

            // when & then
            assertThrows(
                    BeanDefinitionValidationException.class,
                    () -> validator.postProcessBeforeInitialization(
                            new InvalidControllerAdvice(),
                            "invalidControllerAdvice"
                    )
            );
        }

        @Test
        @DisplayName("ExceptionHandler에 두 개 이상의 예외 클래스가 있는 경우 예외를 던진다")
        void handlerWithMultipleExceptionClassesThrowsException() {
            // given
            @RestControllerAdvice
            class InvalidControllerAdvice {
                @ExceptionHandler({IllegalArgumentException.class, NullPointerException.class}) // 2개 예외 클래스
                public String handleException(final IllegalArgumentException exception) {
                    return null;
                }
            }

            // when & then
            assertThrows(BeanDefinitionValidationException.class,
                    () -> validator.postProcessBeforeInitialization(
                            new InvalidControllerAdvice(),
                            "invalidControllerAdvice"
                    )
            );
        }

        @Test
        @DisplayName("예외 메서드 파라미터가 두 개 이상인 경우 예외를 던진다")
        void handlerWithMultipleParametersThrowsException() {
            // given
            @RestControllerAdvice
            class InvalidControllerAdvice {
                @ExceptionHandler(IllegalArgumentException.class)
                public String handleException(
                        final IllegalArgumentException illegalArgumentException,
                        final NullPointerException nullPointerException
                ) {
                    return null;
                }
            }

            // when & then
            assertThrows(BeanDefinitionValidationException.class,
                    () -> validator.postProcessBeforeInitialization(new InvalidControllerAdvice(),
                            "invalidControllerAdvice"));
        }

        @Test
        @DisplayName("예외 파라미터와 어노테이션 예외 클래스가 일치하지 않는 경우 예외를 던진다")
        void handlerWithMismatchedParameterThrowsException() {
            // given
            @RestControllerAdvice
            class InvalidControllerAdvice {
                @ExceptionHandler(IllegalArgumentException.class)
                public String handleException(final NullPointerException nullPointerException) { // 파라미터 타입 불일치
                    return null;
                }
            }

            // when & then
            assertThrows(BeanDefinitionValidationException.class,
                    () -> validator.postProcessBeforeInitialization(new InvalidControllerAdvice(),
                            "invalidControllerAdvice"));
        }

        @Nested
        @DisplayName("중복 핸들러 검증")
        class DuplicateHandlerTests {

            @Test
            @DisplayName("새 핸들러가 기존 핸들러와 동일한 예외를 처리하는 경우 예외를 던진다")
            void newHandlerWithDuplicateExceptionThrowsException() {
                // given
                @RestControllerAdvice
                class ValidControllerAdvice1 {
                    @ExceptionHandler(IllegalArgumentException.class)
                    public String handleException(final IllegalArgumentException exception) {
                        return null;
                    }
                }

                @RestControllerAdvice
                class ValidControllerAdvice2 {
                    @ExceptionHandler(IllegalArgumentException.class)
                    public String handleException(final IllegalArgumentException exception) {
                        return null;
                    }
                }

                // when & then
                assertThrows(BeanDefinitionValidationException.class,
                        () -> {
                            validator.postProcessBeforeInitialization(new ValidControllerAdvice1(),
                                    "validControllerAdvice1");
                            validator.postProcessBeforeInitialization(new ValidControllerAdvice2(),
                                    "validControllerAdvice2");
                        });
            }
        }
    }
}
