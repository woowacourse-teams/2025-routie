package routie.routiespace.infrastructure;

import routie.routiespace.domain.RoutieSpaceIdentifierProvider;

public abstract class RandomRoutieSpaceIdentifierProvider implements RoutieSpaceIdentifierProvider {

    @Override
    public final String get() {
        return generateRandomName();
    }

    protected abstract String generateRandomName();
}
