package routie.global.logging.domain;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import routie.global.logging.domain.extractor.HandlerParameter;
import routie.global.logging.infrastructure.strategy.DevLoggingStrategy;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class LogDataBuilderTest {

    private LogDataBuilder logDataBuilder;

    @BeforeEach
    void setUp() {
        final LoggingStrategy devLoggingStrategy = new DevLoggingStrategy();
        logDataBuilder = new LogDataBuilder(devLoggingStrategy);
    }

    @Test
    @DisplayName("실제 HttpServletRequest로 로그 데이터 생성 성공")
    void buildLogData_WithRealHttpRequest_Success() {
        // given
        final MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/test");
        request.addHeader("X-Forwarded-For", "123.123.123.123");

        final TestLoggingContext loggingContext = TestLoggingContext.builder()
                .request(request)
                .executionTime(250L)
                .handlerMethod("TestController#getTest")
                .requestResult("SUCCESS")
                .handlerParameters(List.of(
                        new HandlerParameter("id", "123"),
                        new HandlerParameter("name", "test")
                ))
                .build();

        // when
        final Map<LoggingField, Object> result = logDataBuilder.buildLogData(loggingContext);

        // then
        assertThat(result).hasSize(7);
        assertThat(result.get(LoggingField.HTTP_METHOD)).isEqualTo("GET");
        assertThat(result.get(LoggingField.URL)).isEqualTo("/api/test");
        assertThat(result.get(LoggingField.CLIENT_IP)).isEqualTo("123.123.123.123");
        assertThat(result.get(LoggingField.RESPONSE_TIME_MS)).isEqualTo(250L);
        assertThat(result.get(LoggingField.HANDLER_METHOD)).isEqualTo("TestController#getTest");
        assertThat(result.get(LoggingField.REQUEST_RESULT)).isEqualTo("SUCCESS");
        assertThat(result.get(LoggingField.HANDLER_PARAMS)).isInstanceOf(List.class);
    }

    @Test
    @DisplayName("빈 핸들러 파라미터로 로그 데이터 생성")
    void buildLogData_WithEmptyHandlerParams_Success() {
        // given
        final MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/health");

        final TestLoggingContext loggingContext = TestLoggingContext.builder()
                .request(request)
                .executionTime(50L)
                .handlerMethod("HealthController#check")
                .requestResult("SUCCESS")
                .handlerParameters(List.of())
                .build();

        // when
        final Map<LoggingField, Object> result = logDataBuilder.buildLogData(loggingContext);

        // then
        assertThat(result).hasSize(7);
        assertThat(result.get(LoggingField.HANDLER_PARAMS)).isEqualTo(List.of());
    }

    @Test
    @DisplayName("null 값들이 포함된 경우 필터링하여 로그 데이터 생성")
    void buildLogData_WithNullValues_FiltersNullFields() {
        // given
        final MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/test");

        final TestLoggingContext loggingContext = TestLoggingContext.builder()
                .request(request)
                .executionTime(75L)
                .requestResult("SUCCESS")
                .handlerMethod(null)
                .handlerParameters(null)
                .build();

        // when
        final Map<LoggingField, Object> result = logDataBuilder.buildLogData(loggingContext);

        // then
        assertThat(result).hasSize(5);
        assertThat(result).doesNotContainKey(LoggingField.HANDLER_METHOD);
        assertThat(result).doesNotContainKey(LoggingField.HANDLER_PARAMS);
        assertThat(result.get(LoggingField.HTTP_METHOD)).isEqualTo("GET");
        assertThat(result.get(LoggingField.REQUEST_RESULT)).isEqualTo("SUCCESS");
    }

    @Test
    @DisplayName("UnsupportedOperationException 발생 시 해당 필드 제외")
    void buildLogData_WithUnsupportedOperationException_FiltersExceptionFields() {
        // given
        final MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/test");

        final TestLoggingContext loggingContext = new TestLoggingContext(request, 100L, null, "SUCCESS", null) {
            @Override
            public String getHandlerMethod() {
                throw new UnsupportedOperationException("Handler method not available");
            }

            @Override
            public List<HandlerParameter> getHandlerParameters() {
                throw new UnsupportedOperationException("Handler parameters not available");
            }
        };

        // when
        final Map<LoggingField, Object> result = logDataBuilder.buildLogData(loggingContext);

        // then
        assertThat(result).hasSize(5);
        assertThat(result).doesNotContainKey(LoggingField.HANDLER_METHOD);
        assertThat(result).doesNotContainKey(LoggingField.HANDLER_PARAMS);
        assertThat(result.get(LoggingField.HTTP_METHOD)).isEqualTo("GET");
        assertThat(result.get(LoggingField.REQUEST_RESULT)).isEqualTo("SUCCESS");
    }

    private static class TestLoggingContext implements LoggingContext {
        private final HttpServletRequest request;
        private final long executionTime;
        private final String handlerMethod;
        private final String requestResult;
        private final List<HandlerParameter> handlerParameters;

        private TestLoggingContext(
                final HttpServletRequest request,
                final long executionTime,
                final String handlerMethod,
                final String requestResult,
                final List<HandlerParameter> handlerParameters
        ) {
            this.request = request;
            this.executionTime = executionTime;
            this.handlerMethod = handlerMethod;
            this.requestResult = requestResult;
            this.handlerParameters = handlerParameters;
        }

        public static Builder builder() {
            return new Builder();
        }

        @Override
        public HttpServletRequest getRequest() {
            return request;
        }

        @Override
        public long getExecutionTime() {
            return executionTime;
        }

        @Override
        public String getHandlerMethod() {
            return handlerMethod;
        }

        @Override
        public String getRequestResult() {
            return requestResult;
        }

        @Override
        public List<HandlerParameter> getHandlerParameters() {
            return handlerParameters;
        }

        public static class Builder {
            private HttpServletRequest request;
            private long executionTime;
            private String handlerMethod;
            private String requestResult;
            private List<HandlerParameter> handlerParameters;

            public Builder request(final HttpServletRequest request) {
                this.request = request;
                return this;
            }

            public Builder executionTime(final long executionTime) {
                this.executionTime = executionTime;
                return this;
            }

            public Builder handlerMethod(final String handlerMethod) {
                this.handlerMethod = handlerMethod;
                return this;
            }

            public Builder requestResult(final String requestResult) {
                this.requestResult = requestResult;
                return this;
            }

            public Builder handlerParameters(final List<HandlerParameter> handlerParameters) {
                this.handlerParameters = handlerParameters;
                return this;
            }

            public TestLoggingContext build() {
                return new TestLoggingContext(request, executionTime, handlerMethod, requestResult, handlerParameters);
            }
        }
    }
}
