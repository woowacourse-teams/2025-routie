package routie.routiespace.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    private static final String DEFAULT_NAME = "새 루티 스페이스";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "identifier", nullable = false)
    private String identifier;

    @OneToMany(mappedBy = "routieSpace", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    private List<Place> places = new ArrayList<>();

    @Embedded
    private Routie routie;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public static RoutieSpace from(
            final RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider
    ) {
        validateRoutieSpaceIdentifierProvider(routieSpaceIdentifierProvider);
        return new RoutieSpace(
                null,
                DEFAULT_NAME,
                routieSpaceIdentifierProvider.provide(),
                new ArrayList<>(),
                Routie.empty(),
                null,
                null
        );
    }

    public static void validateRoutieSpaceIdentifierProvider(
            final RoutieSpaceIdentifierProvider routieSpaceIdentifierProvider
    ) {
        if (routieSpaceIdentifierProvider == null) {
            throw new IllegalArgumentException("루티 스페이스 식별자 제공자는 null일 수 없습니다.");
        }
    }

    public void updateName(final String name) {
        validateName(name);
        this.name = name;
    }

    private void validateName(final String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("루티 스페이스 이름은 비어있을 수 없습니다.");
        }
        if (name.length() > 50) {
            throw new IllegalArgumentException("루티 스페이스 이름은 50자 이하여야 합니다.");
        }
    }
}
