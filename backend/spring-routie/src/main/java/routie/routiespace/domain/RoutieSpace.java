package routie.routiespace.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import routie.place.domain.Place;
import routie.routie.domain.Routie;

@Getter
@Entity
@Table(name = "routie_spaces")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoutieSpace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "identifier", nullable = false)
    private String identifier;

    @OneToMany
    @JoinColumn(name = "routie_space_id", nullable = false)
    private List<Place> places = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "routie_space_id", nullable = false)
    private List<Routie> routies = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RoutieSpace(
            final String name,
            final String identifier,
            final List<Place> places,
            final List<Routie> routies,
            final LocalDateTime createdAt,
            final LocalDateTime updatedAt
    ) {
        this(
                null,
                name,
                identifier,
                places,
                routies,
                createdAt,
                updatedAt
        );
    }
}
