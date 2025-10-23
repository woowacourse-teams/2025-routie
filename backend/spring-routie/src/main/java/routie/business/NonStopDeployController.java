package routie.business;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NonStopDeployController {

    @GetMapping("/non-stop-deploy/test")
    public String test() {
        return "test2!";
    }
}
