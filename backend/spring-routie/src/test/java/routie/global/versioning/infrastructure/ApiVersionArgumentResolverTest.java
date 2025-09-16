package routie.global.versioning.infrastructure;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.web.context.request.NativeWebRequest;
import routie.global.versioning.domain.ApiVersionParam;
import routie.global.versioning.domain.Version;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApiVersionArgumentResolverTest {

    private ApiVersionArgumentResolver resolver;

    @Mock
    private MethodParameter methodParameter;

    @Mock
    private NativeWebRequest webRequest;

    @BeforeEach
    void setUp() {
        resolver = new ApiVersionArgumentResolver();
    }

    @Test
    @DisplayName("버전 파라미터가 있으면 해당 값으로 Version 객체를 생성한다")
    void resolveArgumentWithVersionParameter() {
        // given
        when(webRequest.getParameter("version")).thenReturn("2.1");

        // when
        Object result = resolver.resolveArgument(methodParameter, null, webRequest, null);

        // then
        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(Version.class);
        Version version = (Version) result;
        assertThat(version.value()).isEqualTo("2.1");
    }

    @Test
    @DisplayName("버전 파라미터가 없으면 기본값 '1'로 Version 객체를 생성한다")
    void resolveArgumentWithoutVersionParameter() {
        // given
        when(webRequest.getParameter("version")).thenReturn(null);

        // when
        Object result = resolver.resolveArgument(methodParameter, null, webRequest, null);

        // then
        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(Version.class);
        Version version = (Version) result;
        assertThat(version.value()).isEqualTo("1");
    }

    @Test
    @DisplayName("버전 파라미터가 빈 문자열이면 기본값 '1'로 Version 객체를 생성한다")
    void resolveArgumentWithEmptyVersionParameter() {
        // given
        when(webRequest.getParameter("version")).thenReturn("");

        // when
        Object result = resolver.resolveArgument(methodParameter, null, webRequest, null);

        // then
        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(Version.class);
        Version version = (Version) result;
        assertThat(version.value()).isEqualTo("1");
    }
}
