package routie.business.authentication.ui.argument.resolver;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import routie.business.authentication.domain.Role;
import routie.business.authentication.domain.jwt.JwtProcessor;
import routie.business.authentication.ui.argument.annotation.AuthenticatedParticipant;
import routie.business.participant.domain.Participant;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Component
@RequiredArgsConstructor
public class AuthenticatedParticipantArgumentResolver implements HandlerMethodArgumentResolver {

    private final JwtProcessor jwtProcessor;

    @Override
    public boolean supportsParameter(final MethodParameter parameter) {
        return parameter.hasParameterAnnotation(AuthenticatedParticipant.class);
    }

    @Override
    public Participant resolveArgument(
            final MethodParameter parameter,
            final ModelAndViewContainer mavContainer,
            final NativeWebRequest webRequest,
            final WebDataBinderFactory binderFactory
    ) {
        final HttpServletRequest request = getRequest(webRequest);
        final String jwt = getJwt(request);
        final Participant participant = jwtProcessor.parseParticipant(jwt);
        final AuthenticatedParticipant annotation = parameter.getParameterAnnotation(AuthenticatedParticipant.class);
        final Role[] requiredRoles = annotation.roles();

        if (requiredRoles.length > 0) {
            final Role participantRole = participant.getRole();
            final boolean isAuthorized = Arrays.asList(requiredRoles).contains(participantRole);

            if (!isAuthorized) {
                throw new BusinessException(ErrorCode.FORBIDDEN);
            }
        }

        return participant;
    }

    private HttpServletRequest getRequest(final NativeWebRequest webRequest) {
        return Optional.ofNullable(webRequest.getNativeRequest(HttpServletRequest.class))
                .orElseThrow(() -> new BusinessException(ErrorCode.UNEXPECTED_EXCEPTION));
    }

    private String getJwt(final HttpServletRequest request) {
        return Optional.ofNullable(request.getAttribute("jwt"))
                .map(Object::toString)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTHENTICATION_REQUIRED));
    }
}
