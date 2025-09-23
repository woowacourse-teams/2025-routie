package routie.global.docs.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI routieOpenAPI() {
        String title = "Routie Docs";
        String description = "Routie API 문서입니다.";

        Info info = new Info().title(title).description(description).version("0.0.1");

        return new OpenAPI().info(info);
    }
}
