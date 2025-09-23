package routie.business.routiespace.infrastructure;

import routie.business.routiespace.domain.RoutieSpaceIdentifierProvider;

public abstract class RandomRoutieSpaceIdentifierProvider implements RoutieSpaceIdentifierProvider {

    @Override
    public final String provide() {
        return generateRandomName();
    }

    protected abstract String generateRandomName();
}
