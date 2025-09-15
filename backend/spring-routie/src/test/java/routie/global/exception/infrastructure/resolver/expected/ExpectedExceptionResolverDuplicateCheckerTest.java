package routie.global.exception.infrastructure.resolver.expected;

import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatExceptionOfType;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import routie.global.exception.domain.ExceptionResolvingRequest;
import routie.global.exception.domain.ExceptionResolvingResponse;
import routie.global.exception.domain.resolver.expected.ExpectedExceptionResolver;

class ExpectedExceptionResolverDuplicateCheckerTest {

    private final ExpectedExceptionResolverDuplicateChecker checker = new ExpectedExceptionResolverDuplicateChecker();
    private final BeanDefinitionRegistry registry = new DefaultListableBeanFactory();

    @Test
    @DisplayName("중복된 ExpectedExceptionResolver가 없을 때, 정상적으로 실행된다.")
    void noDuplicateResolversShouldExecuteSuccessfully() {
        // given
        registry.registerBeanDefinition("resolver1", BeanDefinitionBuilder
                .rootBeanDefinition(TestResolver1.class)
                .getBeanDefinition());

        registry.registerBeanDefinition("resolver2", BeanDefinitionBuilder
                .rootBeanDefinition(TestResolver2.class)
                .getBeanDefinition());

        // when & then
        assertThatNoException()
                .isThrownBy(() -> checker.postProcessBeanDefinitionRegistry(registry));
    }

    @Test
    @DisplayName("중복된 ExpectedExceptionResolver가 있을 때, BeanCreationException이 발생한다.")
    void duplicateResolversShouldThrowBeanCreationException() {
        // given
        registry.registerBeanDefinition("testResolver1", BeanDefinitionBuilder
                .rootBeanDefinition(TestResolver1.class)
                .getBeanDefinition());

        registry.registerBeanDefinition("testResolver2", BeanDefinitionBuilder
                .rootBeanDefinition(TestResolver2.class)
                .getBeanDefinition());

        registry.registerBeanDefinition("testResolver3", BeanDefinitionBuilder
                .rootBeanDefinition(TestResolver3.class)
                .getBeanDefinition());

        // when & then
        assertThatExceptionOfType(BeanCreationException.class)
                .isThrownBy(() -> checker.postProcessBeanDefinitionRegistry(registry));
    }

    private static class TestResolver1 extends ExpectedExceptionResolver<IllegalArgumentException> {

        @Override
        protected ExceptionResolvingResponse resolveInternal(
                final ExceptionResolvingRequest<IllegalArgumentException> exception) {
            return null;
        }
    }

    private static class TestResolver2 extends ExpectedExceptionResolver<IllegalStateException> {

        @Override
        protected ExceptionResolvingResponse resolveInternal(
                final ExceptionResolvingRequest<IllegalStateException> exception) {
            return null;
        }
    }

    private static class TestResolver3 extends ExpectedExceptionResolver<IllegalArgumentException> {

        @Override
        protected ExceptionResolvingResponse resolveInternal(
                final ExceptionResolvingRequest<IllegalArgumentException> exception) {
            return null;
        }
    }

}
