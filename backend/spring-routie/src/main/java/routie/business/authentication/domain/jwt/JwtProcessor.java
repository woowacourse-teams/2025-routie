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
import routie.business.participant.domain.User;
import routie.business.participant.domain.UserRepository;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Component
public class JwtProcessor {

    private final long expiration;
    private final SecretKey secretKey;
    private final UserRepository userRepository;

    public JwtProcessor(
            @Value("${authentication.jwt.expiration}") final long expiration,
            @Value("${authentication.jwt.secret}") final String secret,
            final UserRepository userRepository
    ) {
        this.expiration = expiration;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.userRepository = userRepository;
    }

    public String createJwt(final User user) {
        Claims claims = Jwts.claims()
                .subject(user.getId().toString())
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
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(jwt)
                    .getPayload();

            String userId = claims.getSubject();

            return userRepository.findById(Long.parseLong(userId))
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        } catch (final Exception e) {
            throw new JwtException(e.getMessage(), e);
        }
    }
}
