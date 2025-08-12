package routie.routie.domain;

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
import routie.place.domain.Place;

@Entity
@Getter
@Table(name = "routie_places")
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

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public RoutiePlace(final int sequence, final Place place) {
        validateSequence(sequence);
        validatePlace(place);
        this.id = null;
        this.sequence = sequence;
        this.place = place;
        this.createdAt = null;
    }

    private void validatePlace(final Place place) {
        if (place == null) {
            throw new IllegalArgumentException("장소는 null일 수 없습니다.");
        }
    }

    public void updateSequence(final int sequence) {
        validateSequence(sequence);
        this.sequence = sequence;
    }

    private void validateSequence(final int sequence) {
        if (sequence < 1) {
            throw new IllegalArgumentException("루티 장소 순서는 1 이상의 값이어야 합니다.");
        }
    }
}
