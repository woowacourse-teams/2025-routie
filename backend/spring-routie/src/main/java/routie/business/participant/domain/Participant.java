package routie.business.participant.domain;

import routie.business.authentication.domain.Role;

public interface Participant {
    String getNickname();

    Role getRole();
}
