package routie.global.versioning.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class VersionTest {

    @DisplayName("유효한 버전 형식으로 Version 객체를 생성할 수 있다")
    @ParameterizedTest
    @ValueSource(strings = {"1", "1.0", "1.2.3", "2.1.0"})
    void createVersionWithValidFormat(final String versionValue) {
        // when & then
        Version version = new Version(versionValue);
        assertThat(version.value()).isEqualTo(versionValue);
    }

    @DisplayName("유효하지 않은 버전 형식으로 Version 객체를 생성하면 예외가 발생한다")
    @ParameterizedTest
    @ValueSource(strings = {"", "v1.0", "1.0.0.0", "1.0-SNAPSHOT", "1.a.0", "1..0"})
    void createVersionWithInvalidFormat(final String invalidVersion) {
        // when & then
        assertThatThrownBy(() -> new Version(invalidVersion))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid version format");
    }

    @Test
    @DisplayName("null 버전으로 Version 객체를 생성하면 예외가 발생한다")
    void createVersionWithNull() {
        // when & then
        assertThatThrownBy(() -> new Version(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid version format");
    }

    @Test
    @DisplayName("지원되는 버전 목록에 포함된 버전은 호환 가능하다")
    void isCompatibleWithSupportedVersions() {
        // given
        Version version = new Version("1.2");
        String[] supportedVersions = {"1", "1.2", "2.0"};

        // when & then
        assertThat(version.isCompatibleWith(supportedVersions)).isTrue();
    }

    @Test
    @DisplayName("지원되는 버전 목록에 포함되지 않은 버전은 호환되지 않는다")
    void isNotCompatibleWithUnsupportedVersions() {
        // given
        Version version = new Version("1.3");
        String[] supportedVersions = {"1", "1.2", "2.0"};

        // when & then
        assertThat(version.isCompatibleWith(supportedVersions)).isFalse();
    }
}
