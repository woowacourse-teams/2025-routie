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

    public Participant parseParticipant(final String jwt) {
        try {
            final Claims claims = getPayload(jwt);
            final Role role = parseRole(claims);
            final String participantId = claims.getSubject();

            if (role == Role.GUEST) {
                return findGuestById(participantId);
            }
            if (role == Role.USER) {
                return findUserById(participantId);
            }
            throw new BusinessException(ErrorCode.INVALID_ROLE);

        } catch (final BusinessException e) {
            throw e;
        } catch (final Exception e) {
            throw new JwtException(e.getMessage(), e);
        }
    }

    private User findUserById(final String userId) {
        return userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private Guest findGuestById(final String guestId) {
        return guestRepository.findById(Long.parseLong(guestId))
                .orElseThrow(() -> new BusinessException(ErrorCode.GUEST_NOT_FOUND));
    }

    private Claims getPayload(final String jwt) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }

    private Role parseRole(final Claims claims) {
        return Role.from(claims.get(CLAIM_KEY_ROLE, String.class));
    }
}
