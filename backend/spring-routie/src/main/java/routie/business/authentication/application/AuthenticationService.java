package routie.business.authentication.application;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import routie.business.authentication.domain.external.ExternalAuthenticationProcessor;
import routie.business.authentication.domain.external.ExternalAuthenticationProcessorRegistry;
import routie.business.authentication.domain.external.ExternalAuthenticationProvider;
import routie.business.authentication.domain.jwt.JwtProcessor;
import routie.business.authentication.ui.v1.dto.request.ExternalAuthenticationRequest;
import routie.business.authentication.ui.v1.dto.request.GuestAuthenticationRequest;
import routie.business.authentication.ui.v1.dto.response.ExternalAuthenticationResponse;
import routie.business.authentication.ui.v1.dto.response.ExternalAuthenticationUriResponse;
import routie.business.authentication.ui.v1.dto.response.GuestAuthenticationResponse;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.GuestRepository;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserRepository;
import routie.business.routiespace.domain.RoutieSpace;
import routie.business.routiespace.domain.RoutieSpaceRepository;
import routie.business.word.domain.Word;
import routie.business.word.domain.WordRepository;
import routie.business.word.domain.WordType;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthenticationService {

    private final JwtProcessor jwtProcessor;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;
    private final ExternalAuthenticationProcessorRegistry externalAuthenticationProcessorRegistry;
    private final GuestRepository guestRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoutieSpaceRepository routieSpaceRepository;

    @Transactional
    public ExternalAuthenticationResponse authenticateByExternalAuthenticationProvider(
            final ExternalAuthenticationRequest request
    ) {
        ExternalAuthenticationProvider externalAuthenticationProvider = ExternalAuthenticationProvider.fromName(
                request.providerName()
        );
        ExternalAuthenticationProcessor externalAuthenticationProcessor =
                externalAuthenticationProcessorRegistry.getExternalAuthenticationProcessor(
                        externalAuthenticationProvider
                );
        String externalAuthenticationIdentifier = externalAuthenticationProcessor.getAuthenticationIdentifier(
                request.code()
        );
        User user = userRepository.findByExternalAuthenticationIdentifierAndExternalAuthenticationProvider(
                        externalAuthenticationIdentifier,
                        externalAuthenticationProvider
                )
                .orElseGet(() -> createUser(externalAuthenticationIdentifier, externalAuthenticationProvider));

        return new ExternalAuthenticationResponse(jwtProcessor.createJwt(user));
    }

    private User createUser(
            final String externalAuthenticationIdentifier,
            final ExternalAuthenticationProvider externalAuthenticationProvider
    ) {
        User user = new User(getRandomNickname(), externalAuthenticationIdentifier, externalAuthenticationProvider);
        return userRepository.save(user);
    }

    private String getRandomNickname() {
        final List<Word> adjectives = wordRepository.findAllByWordType(WordType.ADJECTIVE);
        if (adjectives.isEmpty()) {
            throw new BusinessException(ErrorCode.ADJECTIVE_NOT_FOUND);
        }

        final List<Word> nouns = wordRepository.findAllByWordType(WordType.NOUN);
        if (nouns.isEmpty()) {
            throw new BusinessException(ErrorCode.NOUN_NOT_FOUND);
        }

        final Word randomAdjective = adjectives.get(ThreadLocalRandom.current().nextInt(adjectives.size()));
        final Word randomNoun = nouns.get(ThreadLocalRandom.current().nextInt(nouns.size()));

        return randomAdjective.getContent() + " " + randomNoun.getContent();
    }

    public ExternalAuthenticationUriResponse getExternalAuthenticationUri(
            final String providerName
    ) {
        ExternalAuthenticationProvider externalAuthenticationProvider = ExternalAuthenticationProvider.fromName(
                providerName
        );
        ExternalAuthenticationProcessor externalAuthenticationProcessor =
                externalAuthenticationProcessorRegistry.getExternalAuthenticationProcessor(
                        externalAuthenticationProvider
                );
        String uri = externalAuthenticationProcessor.getAuthorizationUri();
        return new ExternalAuthenticationUriResponse(uri);
    }

    @Transactional
    public GuestAuthenticationResponse authenticateGuest(
            final GuestAuthenticationRequest guestAuthenticationRequest
    ) {
        final RoutieSpace routieSpace = routieSpaceRepository.findById(guestAuthenticationRequest.routieSpaceId())
                .orElseThrow(() -> new BusinessException(ErrorCode.ROUTIE_SPACE_NOT_FOUND));

        final Guest guest = guestRepository.findByNickname(guestAuthenticationRequest.nickname())
                .orElseGet(() -> createGuest(
                        guestAuthenticationRequest.nickname(),
                        guestAuthenticationRequest.password(),
                        routieSpace
                ));

        return new GuestAuthenticationResponse(jwtProcessor.createJwt(guest));
    }

    private Guest createGuest(
            final String nickname,
            final String password,
            final RoutieSpace routieSpace
    ) {
        if (guestRepository.existsByNicknameAndRoutieSpaceId(nickname, routieSpace.getId())) {
            throw new BusinessException(ErrorCode.GUEST_NICKNAME_DUPLICATED);
        }

        final String encodedPassword = passwordEncoder.encode(password);
        final Guest guest = new Guest(nickname, encodedPassword, routieSpace);
        return guestRepository.save(guest);
    }
}
