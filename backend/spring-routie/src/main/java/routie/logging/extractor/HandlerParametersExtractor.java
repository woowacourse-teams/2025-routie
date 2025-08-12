package routie.logging.extractor;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.List;
import java.util.stream.IntStream;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import routie.logging.extractor.dto.HandlerParameter;

public class HandlerParametersExtractor {

    public static List<HandlerParameter> extractParameters(final Object[] args, final Method method) {
        try {
            Parameter[] parameters = method.getParameters();

            return IntStream.range(0, Math.min(parameters.length, args.length))
                    .filter(i -> isLoggableParameter(parameters[i], args[i]))
                    .mapToObj(i -> new HandlerParameter(
                            parameters[i].getType().getName(),
                            args[i]
                    ))
                    .toList();
        } catch (final Exception e) {
            return List.of();
        }
    }

    private static boolean isLoggableParameter(final Parameter parameter, final Object value) {
        return value != null
                && parameter.isAnnotationPresent(RequestBody.class);
    }
}
