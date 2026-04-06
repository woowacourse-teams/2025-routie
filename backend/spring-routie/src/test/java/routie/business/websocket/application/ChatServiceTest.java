package routie.business.websocket.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import routie.business.participant.domain.Guest;
import routie.business.participant.domain.GuestBuilder;
import routie.business.participant.domain.GuestFixture;
import routie.business.participant.domain.GuestRepository;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserFixture;
import routie.business.participant.domain.UserRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceFixture;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.business.websocket.domain.ChatMessage;
import routie.business.websocket.domain.MessageType;
import routie.business.websocket.ui.dto.request.ChatRequest;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@SpringBootTest
@Transactional
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
@ActiveProfiles("test")
class ChatServiceTest {

    @Autowired
    private ChatService chatService;

    @Autowired
    private RoutieSpaceRepository routieSpaceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GuestRepository guestRepository;

    @Test
    @DisplayName("User가 채팅을 전송하면 정상적으로 저장된다.")
    void saveChatMessage_byUser() {
        // given
        final RoutieSpace routieSpace = routieSpaceRepository.save(RoutieSpaceFixture.emptyRoutieSpace());
        final User user = userRepository.save(UserFixture.emptyUser());
        final ChatRequest request = new ChatRequest("temp-1", MessageType.CHAT, "안녕하세요");

        // when
        final ChatMessage result = chatService.saveChatMessage(routieSpace.getId(), user, request);

        // then
        assertThat(result.getId()).isNotNull();
        assertThat(result.getUser().getId()).isEqualTo(user.getId());
        assertThat(result.getGuest()).isNull();
        assertThat(result.getContent()).isEqualTo("안녕하세요");
        assertThat(result.getMessageType()).isEqualTo(MessageType.CHAT);
    }

    @Test
    @DisplayName("Guest가 채팅을 전송하면 정상적으로 저장된다.")
    void saveChatMessage_byGuest() {
        // given
        final RoutieSpace routieSpace = routieSpaceRepository.save(RoutieSpaceFixture.emptyRoutieSpace());
        final Guest guest = new GuestBuilder()
                .nickname(GuestFixture.anyNickname())
                .password(GuestFixture.anyPassword())
                .routieSpace(routieSpace)
                .build();
        guestRepository.save(guest);

        final ChatRequest request = new ChatRequest("temp-2", MessageType.ENTER, "게스트 입장");

        // when
        final ChatMessage result = chatService.saveChatMessage(routieSpace.getId(), guest, request);

        // then
        assertThat(result.getId()).isNotNull();
        assertThat(result.getGuest().getId()).isEqualTo(guest.getId());
        assertThat(result.getUser()).isNull();
        assertThat(result.getContent()).isEqualTo("게스트 입장");
        assertThat(result.getMessageType()).isEqualTo(MessageType.ENTER);
    }

    @Test
    @DisplayName("존재하지 않는 RoutieSpace에 접근하면 예외가 발생한다.")
    void saveChatMessage_routieSpaceNotFound() {
        // given
        final User user = userRepository.save(UserFixture.emptyUser());
        final ChatRequest request = new ChatRequest("temp-3", MessageType.CHAT, "존재하지 않는 방");

        // when & then
        assertThatThrownBy(() -> chatService.saveChatMessage(9999L, user, request))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ROUTIE_SPACE_NOT_FOUND);
    }
}

