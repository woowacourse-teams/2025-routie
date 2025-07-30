package routie.routie.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Routie {

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "routie_id", nullable = false)
    private List<RoutiePlace> routiePlaces = new ArrayList<>();

    public static Routie empty() {
        return new Routie(new ArrayList<>());
    }

    public static Routie create(final List<RoutiePlace> routiePlaces) {
        return new Routie(routiePlaces);
    }
}
