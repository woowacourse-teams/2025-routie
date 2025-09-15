package routie.global.versioning.infrastructure;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import routie.global.versioning.domain.ApiVersionParam;
import routie.global.versioning.domain.Version;

@Component
public class ApiVersionArgumentResolver implements HandlerMethodArgumentResolver {

    private static final String DEFAULT_VERSION = "1";
    private static final String VERSION_PARAM = "version";

    @Override
    public boolean supportsParameter(final MethodParameter parameter) {
        return parameter.hasParameterAnnotation(ApiVersionParam.class)
                && parameter.getParameterType().equals(Version.class);
    }

    @Override
    public Object resolveArgument(final MethodParameter parameter,
                                  final ModelAndViewContainer mavContainer,
                                  final NativeWebRequest webRequest,
                                  final WebDataBinderFactory binderFactory) {

        String versionValue = webRequest.getParameter(VERSION_PARAM);
        String resolvedVersion = (versionValue != null && !versionValue.isEmpty())
                ? versionValue : DEFAULT_VERSION;

        return new Version(resolvedVersion);
    }
}
