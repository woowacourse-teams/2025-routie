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
import jakarta.persistence.UniqueConstraint;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Entity
@Table(name = "place_closed_weekdays", uniqueConstraints = {
        @UniqueConstraint(
                name = "uk_place_closed_day", columnNames = {"place_id", "closed_day"}
        )
})
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlaceClosedWeekday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "closed_day", nullable = false, columnDefinition = "VARCHAR(255)")
    private DayOfWeek closedDay;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public PlaceClosedWeekday(final DayOfWeek closedDay, final LocalDateTime createdAt) {
        this(
                null,
                closedDay,
                createdAt
        );
    }
}
