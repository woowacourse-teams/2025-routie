package routie.logging.extractor;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.List;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import routie.logging.extractor.dto.HandlerParameterDto;

@Component
@RequiredArgsConstructor
public class HandlerMethodAnalyzer {

    public List<HandlerParameterDto> extractParameters(final Object[] args, final Method method) {
        try {
            Parameter[] parameters = method.getParameters();

            return IntStream.range(0, Math.min(parameters.length, args.length))
                    .filter(i -> isLoggableParameter(parameters[i], args[i]))
                    .mapToObj(i -> new HandlerParameterDto(
                            parameters[i].getType().getName(),
                            args[i]
                    ))
                    .toList();
        } catch (final Exception e) {
            return List.of();
        }
    }

    private boolean isLoggableParameter(final Parameter parameter, final Object value) {
        return value != null
                && !isSystemParameter(value.getClass())
                && !isPathVariableOrRequestParam(parameter);
    }

    private boolean isPathVariableOrRequestParam(final Parameter parameter) {
        return parameter.isAnnotationPresent(PathVariable.class) ||
                parameter.isAnnotationPresent(RequestParam.class);
    }

    private boolean isSystemParameter(final Class<?> parameterType) {
        return parameterType.getName().startsWith("jakarta.servlet") ||
                parameterType.getName().startsWith("org.springframework");
    }
}
