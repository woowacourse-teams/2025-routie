package routie.business.routie.domain;

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
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import routie.business.place.domain.Place;
import routie.business.routiespace.domain.RoutieSpace;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Entity
@Getter
@Table(
        name = "routie_places",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_routie_space_place",
                        columnNames = {"routie_space_id", "place_id"}
                )
        }
)
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoutiePlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sequence", nullable = false)
    private int sequence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @ManyToOne(fetch = FetchType.LAZY)
    private RoutieSpace routieSpace;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public RoutiePlace(final int sequence, final Place place) {
        validateSequence(sequence);
        validatePlace(place);
        this.id = null;
        this.sequence = sequence;
        this.place = place;
        this.routieSpace = place.getRoutieSpace();
        this.createdAt = null;
    }

    private void validatePlace(final Place place) {
        if (place == null) {
            throw new BusinessException(ErrorCode.ROUTIE_PLACE_ENTITY_NULL);
        }
    }

    public void updateSequence(final int sequence) {
        validateSequence(sequence);
        this.sequence = sequence;
    }

    private void validateSequence(final int sequence) {
        if (sequence < 1) {
            throw new BusinessException(ErrorCode.ROUTIE_PLACE_ORDER_INVALID);
        }
    }
}
