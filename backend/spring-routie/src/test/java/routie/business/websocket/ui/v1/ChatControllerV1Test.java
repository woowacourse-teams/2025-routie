package routie.business.websocket.ui.v1;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import routie.business.authentication.domain.Role;
import routie.business.authentication.domain.jwt.JwtProcessor;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.participant.domain.UserRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.business.websocket.domain.ChatMessageRepository;
import routie.business.websocket.domain.MessageType;
import routie.business.websocket.ui.dto.request.ChatRequest;

import java.util.Map;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.lang.reflect.Type;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ChatControllerV1Test {

    @LocalServerPort
    private int port;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProcessor jwtProcessor;

    @Autowired
    private RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    private WebSocketStompClient stompClient;

    @BeforeEach
    void setUp() {
        stompClient = new WebSocketStompClient(new StandardWebSocketClient());

        final MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.getObjectMapper().registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        stompClient.setMessageConverter(converter);

        final ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.afterPropertiesSet();
        stompClient.setTaskScheduler(taskScheduler);
    }

    @AfterEach
    void tearDown() {
        chatMessageRepository.deleteAllInBatch();
        routieSpaceRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
    }

    @Test
    @DisplayName("STOMP 엔드포인트로 채팅 메시지를 전송하고 브로드캐스트로 수신한다.")
    void sendMessageAndReceive() throws Exception {
        // given
        final User user = userRepository.save(UserFixture.emptyUser());
        final RoutieSpace routieSpace = routieSpaceRepository.save(
                RoutieSpace.withIdentifierProvider(user, routieSpaceIdentifierProvider)
        );
        final String jwt = jwtProcessor.createJwt(user);

        final BlockingQueue<Map<String, Object>> blockingQueue = new LinkedBlockingQueue<>();
        final String wsUrl = "ws://localhost:" + port + "/ws/v1";

        // CONNECT 헤더에 토큰 삽입
        final StompHeaders connectHeaders = new StompHeaders();
        connectHeaders.set("Authorization", "Bearer " + jwt);

        // WebSocket 연결
        final StompSession session = stompClient
                .connectAsync(
                        wsUrl,
                        new WebSocketHttpHeaders(),
                        connectHeaders,
                        new StompSessionHandlerAdapter() {
                        }
                )
                .get(10, TimeUnit.SECONDS);

        session.setAutoReceipt(true);

        // STOMP Topic 구독
        final String subscribeDestination = "/topic/chat/room/" + routieSpace.getId();
        final StompSession.Receiptable receiptable = session.subscribe(
                subscribeDestination, new StompFrameHandler() {
                    @Override
                    public Type getPayloadType(final StompHeaders headers) {
                        return Map.class;
                    }

                    @Override
                    @SuppressWarnings("unchecked")
                    public void handleFrame(final StompHeaders headers, final Object payload) {
                        blockingQueue.add((Map<String, Object>) payload);
                    }
                }
        );

        final CountDownLatch latch = new CountDownLatch(1);
        receiptable.addReceiptTask(latch::countDown);
        latch.await(3, TimeUnit.SECONDS);

        // STOMP Message 전송
        final String sendDestination = "/app/chat/room/" + routieSpace.getId();
        final StompHeaders stompHeaders = new StompHeaders();
        stompHeaders.setDestination(sendDestination);

        final ChatRequest request = new ChatRequest("temp-10", MessageType.CHAT, "통합테스트 메시지");

        // when
        session.send(stompHeaders, request);

        // then
        Map<String, Object> response = null;
        final long deadline = System.currentTimeMillis() + 5000;
        while (System.currentTimeMillis() < deadline) {
            final Map<String, Object> message = blockingQueue.poll(
                    Math.max(1, deadline - System.currentTimeMillis()), TimeUnit.MILLISECONDS
            );
            if (message == null) {
                break;
            }
            if (MessageType.CHAT.name().equals(message.get("type"))) {
                response = message;
                break;
            }
        }

        assertThat(response).isNotNull();
        assertThat(response.get("content")).isEqualTo("통합테스트 메시지");
        assertThat(((Number) response.get("senderId")).longValue()).isEqualTo(user.getId());
        assertThat(response.get("senderRole")).isEqualTo(Role.USER.name());
        assertThat(response.get("type")).isEqualTo(MessageType.CHAT.name());
        assertThat(response.get("tempId")).isEqualTo("temp-10");
        assertThat(response.get("senderName")).isEqualTo(user.getNickname());
    }
}
