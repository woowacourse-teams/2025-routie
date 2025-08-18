package routie.place.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import routie.exception.BusinessException;
import routie.exception.ErrorCode;

@Getter
@Entity
@Table(name = "place_closed_dayofweeks")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlaceClosedDayOfWeek {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "closed_dayofweek", nullable = false, columnDefinition = "VARCHAR(255)")
    private DayOfWeek closedDayOfWeek;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public PlaceClosedDayOfWeek(final DayOfWeek closedDayOfWeek) {
        validateClosedDayOfWeek(closedDayOfWeek);
        this.id = null;
        this.closedDayOfWeek = closedDayOfWeek;
        this.createdAt = null;
    }

    private void validateClosedDayOfWeek(final DayOfWeek closedDayOfWeek) {
        if (closedDayOfWeek == null) {
            throw new BusinessException(ErrorCode.PLACE_CLOSED_DAY_NULL);
        }
    }
}
