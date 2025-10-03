package routie.business.authentication.domain.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import routie.business.authentication.domain.Role;
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.GuestRepository;
import routie.business.participant.domain.Participant;
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Component
public class JwtProcessor {

    private static final String CLAIM_KEY_ROLE = "role";

    private final long expiration;
    private final SecretKey secretKey;
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;

    public JwtProcessor(
            @Value("${authentication.jwt.expiration}") final long expiration,
            @Value("${authentication.jwt.secret}") final String secret,
            final UserRepository userRepository,
            final GuestRepository guestRepository) {
        this.expiration = expiration;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.userRepository = userRepository;
        this.guestRepository = guestRepository;
    }

    public String createJwt(final Participant participant) {
        Claims claims = Jwts.claims()
                .subject(participant.getId().toString())
                .add(CLAIM_KEY_ROLE, participant.getRole().getKey())
                .build();

        Date now = new Date();
        Date expiration = new Date(now.getTime() + this.expiration);

        return Jwts.builder()
                .claims(claims)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    public User parseUser(final String jwt) {
        try {
            final Claims claims = getPayload(jwt);
            final String userId = claims.getSubject();
            final Role role = parseRole(jwt);
            assertRole(role, Role.USER);

            return userRepository.findById(Long.parseLong(userId))
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        } catch (final Exception e) {
            throw new JwtException(e.getMessage(), e);
        }
    }

    private void assertRole(final Role role, final Role expectedRole) {
        if (role != expectedRole) {
            throw new IllegalArgumentException("요청과 role이 일치하지 않습니다");
        }
    }

    private Claims getPayload(final String jwt) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }

    public Role parseRole(final String jwt) {
        try {
            final Claims claims = getPayload(jwt);
            return Role.of(claims.get(CLAIM_KEY_ROLE, String.class));

        } catch (final Exception e) {
            throw new JwtException(e.getMessage(), e);
        }
    }

    public Guest parseGuest(final String jwt) {
        try {
            Claims claims = getPayload(jwt);
            String userId = claims.getSubject();
            final Role role = parseRole(jwt);
            assertRole(role, Role.GUEST);

            return guestRepository.findById(Long.parseLong(userId))
                    .orElseThrow(() -> new BusinessException(ErrorCode.GUEST_NOT_FOUND));
        } catch (final Exception e) {
            throw new JwtException(e.getMessage(), e);
        }
    }

    public Participant parseParticipant(final String jwt) {
        final Role role = parseRole(jwt);

        // 확장성을 위해 Map 고려할 수 있으나, 가능성이 낮다고 판단하여 아래와 같이 구현
        if (role == Role.GUEST) {
            return parseGuest(jwt);
        }
        if (role == Role.USER) {
            return parseUser(jwt);
        }
        throw new BusinessException(ErrorCode.INVALID_ROLE);
    }
}
