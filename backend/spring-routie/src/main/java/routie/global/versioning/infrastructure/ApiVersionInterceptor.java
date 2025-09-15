package routie.global.versioning.infrastructure;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import routie.global.versioning.domain.ApiVersion;
import routie.global.versioning.domain.Version;

@Component
public class ApiVersionInterceptor implements HandlerInterceptor {

    private static final String DEFAULT_VERSION = "1";
    private static final String VERSION_PARAM = "version";

    @Override
    public boolean preHandle(
            final HttpServletRequest request,
            final HttpServletResponse response,
            final Object handler
    ) {
        if (!(handler instanceof final HandlerMethod handlerMethod)) {
            return true;
        }

        ApiVersion apiVersion = handlerMethod.getMethodAnnotation(ApiVersion.class);
        if (apiVersion == null) {
            return true;
        }

        Version requestedVersion = getVersionFromRequest(request);
        String[] supportedVersions = apiVersion.supportedVersions();

        if (!requestedVersion.isCompatibleWith(supportedVersions)) {
            throw new IllegalArgumentException(); // TODO: 머랭 코드 merge 후 변경
        }

        return true;
    }

    private Version getVersionFromRequest(final HttpServletRequest request) {
        String versionValue = request.getParameter(VERSION_PARAM);
        String resolvedVersion = (versionValue != null && !versionValue.isEmpty())
                ? versionValue : DEFAULT_VERSION;

        return new Version(resolvedVersion);
    }
}
