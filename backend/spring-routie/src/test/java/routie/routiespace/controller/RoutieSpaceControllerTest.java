package routie.routiespace.controller;

import static org.assertj.core.api.Assertions.assertThat;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import java.util.regex.Pattern;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpStatus;

@SpringBootTest(webEnvironment = WebEnvironment.DEFINED_PORT)
public class RoutieSpaceControllerTest {

    @Test
    @DisplayName("루티 스페이스를 생성한다")
    public void createRoutieSpace() {
        // given
        Pattern locationUrlPattern = Pattern.compile("/routie-spaces/[a-zA-Z0-9-]+");

        // when
        Response response = RestAssured
                .when()
                .post("/routie-spaces")
                .then()
                .log().all()
                .extract().response();

        HttpStatus actualHttpStatus = HttpStatus.valueOf(response.getStatusCode());
        HttpStatus expectedHttpStatus = HttpStatus.CREATED;

        String locationUrl = response.getHeader("Location");

        // then
        assertThat(expectedHttpStatus).isEqualTo(actualHttpStatus);
        assertThat(locationUrlPattern.matcher(locationUrl).matches()).isTrue();
    }
}
