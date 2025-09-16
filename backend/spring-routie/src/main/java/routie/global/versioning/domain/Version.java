package routie.global.versioning.domain;

import java.util.Arrays;
import java.util.Objects;
import lombok.Getter;

public record Version(String value) {
    public Version {
        if (!isValidVersion(value)) {
            throw new IllegalArgumentException("Invalid version format: " + value);
        }
    }

    public boolean isCompatibleWith(final String... supportedVersions) {
        return Arrays.asList(supportedVersions).contains(this.value);
    }

    private boolean isValidVersion(final String version) {
        return version != null && version.matches("^\\d+(\\.\\d+)?(\\.\\d+)?$");
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Version version = (Version) o;
        return Objects.equals(value, version.value);
    }

    @Override
    public String toString() {
        return value;
    }
}
