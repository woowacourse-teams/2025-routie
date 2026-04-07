package routie.business.websocket.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import routie.business.authentication.ui.argument.resolver.websocket.WebSocketAuthenticatedParticipantArgumentResolver;
import routie.business.websocket.ui.interceptor.StompAuthInterceptor;
import java.util.List;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${websocket.cors.allowed-origins}")
    private String[] allowedOrigins;

    private final StompAuthInterceptor stompAuthInterceptor;
    private final WebSocketAuthenticatedParticipantArgumentResolver webSocketAuthenticatedParticipantArgumentResolver;

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/v1")
                .setAllowedOriginPatterns(allowedOrigins);
    }

    @Override
    public void configureClientInboundChannel(final ChannelRegistration registration) {
        registration.interceptors(stompAuthInterceptor);
    }

    @Override
    public void addArgumentResolvers(final List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(webSocketAuthenticatedParticipantArgumentResolver);
    }
}
