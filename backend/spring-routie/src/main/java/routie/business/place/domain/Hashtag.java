package routie.business.place.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import routie.business.routiespace.domain.RoutieSpace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Entity
@Getter
@Table(name = "hashtags")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Hashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routie_space_id", nullable = false)
    private RoutieSpace routieSpace;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Hashtag(final String name, final RoutieSpace routieSpace) {
        validateName(name);
        this.name = name;
        this.routieSpace = routieSpace;
    }

    private void validateName(final String name) {
        if (name.isEmpty() || name.length() > 7) {
            throw new BusinessException(ErrorCode.HASHTAG_LENGTH_INVALID);
        }
    }
}
