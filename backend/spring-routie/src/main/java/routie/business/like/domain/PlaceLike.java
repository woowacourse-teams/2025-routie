package routie.business.like.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
import routie.business.participant.domain.Guest;
import routie.business.participant.domain.User;
import routie.business.place.domain.Place;
import routie.global.exception.domain.BusinessException;
import routie.global.exception.domain.ErrorCode;

@Entity
@Getter
@Table(name = "place_likes")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlaceLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public PlaceLike(final Place place, final User user, final Guest guest) {
        this.place = place;
        validateExclusiveLiker(user, guest);
        this.user = user;
        this.guest = guest;
    }

    public static PlaceLike of(final Place place, final User user) {
        return new PlaceLike(place, user, null);
    }

    public static PlaceLike of(final Place place, final Guest guest) {
        return new PlaceLike(place, null, guest);
    }

    private void validateExclusiveLiker(final User user, final Guest guest) {
        if ((user == null) == (guest == null)) {
            throw new BusinessException(ErrorCode.PLACE_LIKE_DUPLICATED);
        }
    }
}
