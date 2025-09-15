package routie.global.exception.infrastructure.resolver.expected;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.BinaryOperator;
import java.util.stream.Collectors;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.stereotype.Component;
import routie.global.exception.domain.resolver.expected.ExpectedExceptionResolver;

@Component
public class ExpectedExceptionResolverDuplicateChecker implements BeanDefinitionRegistryPostProcessor {

    @Override
    public void postProcessBeanDefinitionRegistry(final BeanDefinitionRegistry registry) throws BeansException {
        DuplicateExpectedExceptionResolverThrowingMerger duplicateExpectedExceptionResolverThrowingMerger
                = new DuplicateExpectedExceptionResolverThrowingMerger();

        Arrays.stream(registry.getBeanDefinitionNames())
                .map(registry::getBeanDefinition)
                .map(this::mapExpectedExceptionResolverBeanDefinition)
                .flatMap(Optional::stream)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        duplicateExpectedExceptionResolverThrowingMerger
                ));
    }

    private Optional<Map.Entry<Class<? extends Exception>, BeanDefinition>> mapExpectedExceptionResolverBeanDefinition(
            final BeanDefinition beanDefinition
    ) {
        return getBeanClass(beanDefinition)
                .filter(ExpectedExceptionResolver.class::isAssignableFrom)
                .flatMap(this::getExceptionClass)
                .map(exceptionClass -> Map.entry(exceptionClass, beanDefinition));
    }

    private Optional<Class<?>> getBeanClass(final BeanDefinition beanDefinition) {
        String beanClassName = beanDefinition.getBeanClassName();
        if (beanClassName == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(Class.forName(beanClassName));
        } catch (final ClassNotFoundException e) {
            throw new BeanCreationException("Bean에서 클래스를 읽어오는 데에 실패했습니다: " + beanClassName, e);
        }
    }

    @SuppressWarnings("unchecked")
    private Optional<Class<? extends Exception>> getExceptionClass(final Class<?> expectedExceptionResolverClass) {
        Type genericClass = expectedExceptionResolverClass.getGenericSuperclass();
        if (!(genericClass instanceof final ParameterizedType parameterizedType)) {
            throw new BeanCreationException(
                    "ExpectedExceptionResolver의 제네릭 타입이 잘못 명시되었습니다: " + expectedExceptionResolverClass.getName()
            );
        }

        Type exceptionType = parameterizedType.getActualTypeArguments()[0];
        if (!(exceptionType instanceof Class)) {
            throw new BeanCreationException(
                    "ExpectedExceptionResolver의 제네릭 타입이 Class<?> 타입이 아닙니다: " + expectedExceptionResolverClass.getName()
            );
        }

        return Optional.of((Class<? extends Exception>) exceptionType);
    }

    private static final class DuplicateExpectedExceptionResolverThrowingMerger implements
            BinaryOperator<BeanDefinition> {

        private static final String DUPLICATE_RESOLVER_ERROR_FORMAT =
                "같은 예외에 대해 중복된 ExceptionResolver가 존재합니다: '%s' '%s'";

        @Override
        public BeanDefinition apply(
                final BeanDefinition existingExpectedExceptionResolver,
                final BeanDefinition replacementExpectedExceptionResolver
        ) {
            String errorMessage = String.format(
                    DUPLICATE_RESOLVER_ERROR_FORMAT,
                    existingExpectedExceptionResolver.getBeanClassName(),
                    replacementExpectedExceptionResolver.getBeanClassName()
            );
            throw new BeanCreationException(errorMessage);
        }
    }
}
