package routie.global.versioning;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import routie.global.versioning.domain.ApiVersion;
import routie.global.versioning.domain.ApiVersionParam;
import routie.global.versioning.domain.Version;

@RestController
@RequestMapping("/api/test")
public class TestApiVersionController {

    @GetMapping("/no-version")
    public String noVersionEndpoint() {
        return "No version required";
    }

    @GetMapping("/v1")
    public String singleVersion(@ApiVersionParam final Version version) {
        return "Current version: " + version.value();
    }

    @GetMapping("/with-version-param")
    @ApiVersion(supportedVersions = {"1", "1.1", "2"})
    public String withVersionParam(@ApiVersionParam final Version version) {
        return "Current version: " + version.value();
    }
}
