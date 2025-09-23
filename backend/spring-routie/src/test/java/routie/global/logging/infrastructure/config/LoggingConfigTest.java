package routie.global.logging.infrastructure.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import routie.global.logging.infrastructure.ClientRequestLogger;
import routie.global.logging.infrastructure.aspect.RequestLoggingAspect;
import routie.global.logging.infrastructure.config.LoggingConfig;
import routie.global.logging.infrastructure.interceptor.RequestLoggingInterceptor;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = LoggingConfig.class)
class LoggingConfigTest {

    @MockitoBean
    private ClientRequestLogger clientRequestLogger;

    @Nested
    @TestPropertySource(properties = "spring.profiles.active=prod")
    class ProdProfileTest {

        @Autowired
        private ApplicationContext applicationContext;

        @Test
        @DisplayName("prod 프로파일에서 RequestLoggingInterceptor 빈이 생성된다")
        void shouldCreateRequestLoggingInterceptorInProdProfile() {
            assertThat(applicationContext.getBean(RequestLoggingInterceptor.class))
                    .isNotNull();
        }

        @Test
        @DisplayName("prod 프로파일에서 WebMvcConfigurer 빈이 생성된다")
        void shouldCreateWebMvcConfigurerInProdProfile() {
            assertThat(applicationContext.getBean("interceptorConfigurer"))
                    .isNotNull()
                    .isInstanceOf(WebMvcConfigurer.class);
        }

        @Test
        @DisplayName("prod 프로파일에서 RequestLoggingAspect 빈은 생성되지 않는다")
        void shouldNotCreateRequestLoggingAspectInProdProfile() {
            assertThatThrownBy(() -> applicationContext.getBean(RequestLoggingAspect.class))
                    .isInstanceOf(NoSuchBeanDefinitionException.class);
        }
    }

    @Nested
    @TestPropertySource(properties = "spring.profiles.active=dev")
    class DevProfileTest {

        @Autowired
        private ApplicationContext applicationContext;

        @Test
        @DisplayName("dev 프로파일에서 RequestLoggingAspect 빈이 생성된다")
        void shouldCreateRequestLoggingAspectInDevProfile() {
            assertThat(applicationContext.getBean(RequestLoggingAspect.class))
                    .isNotNull();
        }

        @Test
        @DisplayName("dev 프로파일에서 Interceptor 관련 빈들은 생성되지 않는다")
        void shouldNotCreateInterceptorBeansInDevProfile() {
            assertThatThrownBy(() -> applicationContext.getBean(RequestLoggingInterceptor.class))
                    .isInstanceOf(NoSuchBeanDefinitionException.class);

            assertThatThrownBy(() -> applicationContext.getBean("interceptorConfigurer"))
                    .isInstanceOf(NoSuchBeanDefinitionException.class);
        }
    }
}
