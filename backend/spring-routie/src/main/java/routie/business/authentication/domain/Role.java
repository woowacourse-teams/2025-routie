package routie.business.authentication.domain;

public enum Role {
    USER("user"),
    GUEST("guest"),
    ;

    private final String key;

    Role(final String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }
}
