package routie.global.exception.infrastructure.logger;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class ExceptionLogger {

    private ExceptionLogger() {
        throw new UnsupportedOperationException("싱글톤 클래스는 인스턴스화할 수 없습니다.");
    }

    public static void logExpectedException(final Exception exception) {
        log.warn("[EXPECTED] {}", exception.getMessage(), exception);
    }

    public static void logUnexpectedException(final Exception exception) {
        log.error("[UNEXPECTED] {}", exception.getMessage(), exception);
    }

    public static void logFallbackException(final Throwable throwable) {
        log.error("[EXCEPTION FALLBACK] {}", throwable.getMessage(), throwable);
    }
}
