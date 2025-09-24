package routie.business.authentication.domain.external;

public interface ExternalAuthenticationProcessor {

    String getAuthorizationUri();

    String getAuthenticationIdentifier(final String authenticationCode);

    ExternalAuthenticationProvider getExternalAuthenticationProvider();
}
