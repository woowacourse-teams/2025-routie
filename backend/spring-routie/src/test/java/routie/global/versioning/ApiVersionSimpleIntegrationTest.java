package routie.global.versioning;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import routie.global.versioning.infrastructure.ApiVersionArgumentResolver;
import routie.global.versioning.infrastructure.ApiVersionInterceptor;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ApiVersionSimpleIntegrationTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        TestApiVersionController controller = new TestApiVersionController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .addInterceptors(new ApiVersionInterceptor())
                .setCustomArgumentResolvers(new ApiVersionArgumentResolver())
                .build();
    }

    @Test
    @DisplayName("버전이 필요하지 않은 엔드포인트는 정상적으로 동작한다")
    void noVersionRequiredEndpoint() throws Exception {
        mockMvc.perform(get("/api/test/no-version"))
                .andExpect(status().isOk())
                .andExpect(content().string("No version required"));
    }

    @Test
    @DisplayName("지원되는 버전으로 요청하면 정상적으로 동작한다")
    void supportedVersionRequest() throws Exception {
        mockMvc.perform(get("/api/test/v1")
                        .param("version", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Current version: 1"));
    }

    @Test
    @DisplayName("버전 파라미터가 없으면 기본값 '1'이 사용된다")
    void defaultVersionRequest() throws Exception {
        mockMvc.perform(get("/api/test/v1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Current version: 1"));
    }

    @Test
    @DisplayName("지원되지 않는 버전으로 요청하면 예외가 발생한다")
    void unsupportedVersionRequest() throws Exception {
        try {
            mockMvc.perform(get("/api/test/v1-only")
                    .param("version", "2"));
        } catch (final Exception e) {
            // IllegalArgumentException이 발생하는 것을 확인
            assert e.getCause() instanceof IllegalArgumentException;
        }
    }

    @Test
    @DisplayName("Version 파라미터가 올바르게 주입된다")
    void versionParameterInjection() throws Exception {
        mockMvc.perform(get("/api/test/with-version-param")
                        .param("version", "1.1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Current version: 1.1"));

        mockMvc.perform(get("/api/test/with-version-param"))
                .andExpect(status().isOk())
                .andExpect(content().string("Current version: 1"));
    }

    @Test
    @DisplayName("잘못된 형식의 버전으로 요청하면 예외가 발생한다")
    void invalidVersionFormatRequest() throws Exception {
        try {
            mockMvc.perform(get("/api/test/v1-only")
                    .param("version", "v1.0"));
        } catch (final Exception e) {
            // IllegalArgumentException이 발생하는 것을 확인
            assert e.getCause() instanceof IllegalArgumentException;
        }
    }
}
