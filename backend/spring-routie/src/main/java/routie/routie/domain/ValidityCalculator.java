package routie.routie.domain;

import java.util.Map;
import routie.routie.domain.timeperiod.TimePeriod;

public interface ValidityCalculator {

    boolean supportsStrategy(ValidationStrategy validationStrategy);

    boolean calculateValidity(
            Map<RoutiePlace, TimePeriod> timePeriodByRoutiePlace,
            ValidationStrategy validationStrategy
    );
}
