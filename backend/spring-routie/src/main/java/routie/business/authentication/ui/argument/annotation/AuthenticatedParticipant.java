package routie.business.authentication.ui.argument.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import routie.business.authentication.domain.Role;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthenticatedParticipant {

    /**
     * 해당 파라미터에 접근하기 위해 필요한 사용자 역할(Role)을 지정합니다. 기본값은 빈 배열이며, 어떤 역할이든 접근 가능함을 의미합니다.
     */
    Role[] roles() default {};
}
