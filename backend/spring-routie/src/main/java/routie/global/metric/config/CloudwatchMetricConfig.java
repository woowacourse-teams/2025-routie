package routie.global.metric.config;

import io.micrometer.cloudwatch2.CloudWatchConfig;
import io.micrometer.cloudwatch2.CloudWatchMeterRegistry;
import io.micrometer.core.instrument.Clock;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchAsyncClient;

import java.time.Duration;

@Configuration
public class CloudwatchMetricConfig {

    @Value("${cloudwatch.metrics.enabled:false}")
    private boolean metricsEnabled;

    @Value("${cloudwatch.metrics.namespace:}")
    private String namespace;

    @Value("${cloudwatch.metrics.step:600}")
    private int stepSeconds;

    @Value("${cloudwatch.metrics.region:ap-northeast-2}")
    private String region;

    @Bean
    public CloudWatchAsyncClient cloudWatchAsyncClient() {
        return CloudWatchAsyncClient.builder()
                .region(Region.of(region))
                .build();
    }

    @Bean
    public CloudWatchConfig cloudWatchConfig() {
        return new CloudWatchConfig() {
            @Override
            public String get(final String key) {
                return null;
            }

            @Override
            public String namespace() {
                return namespace;
            }

            @Override
            public Duration step() {
                return Duration.ofSeconds(stepSeconds);
            }

            @Override
            public boolean enabled() {
                return metricsEnabled;
            }
        };
    }

    @Bean
    public MeterRegistry cloudWatchMeterRegistry(
            final CloudWatchConfig cloudWatchConfig,
            final Clock clock,
            final CloudWatchAsyncClient cloudWatchAsyncClient
    ) {
        return new CloudWatchMeterRegistry(cloudWatchConfig, clock, cloudWatchAsyncClient);
    }
}
