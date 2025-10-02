package routie.business.participant.domain;

import routie.business.authentication.domain.Role;

public interface Participant {
    Long getId();

    String getNickname();

    Role getRole();
}
