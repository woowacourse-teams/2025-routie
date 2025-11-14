package routie.business.word.ui.v1;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import routie.business.word.application.WordService;
import routie.business.word.domain.WordRepository;
import routie.business.word.domain.WordType;
import routie.business.word.ui.dto.WordCreateRequest;
import routie.business.word.ui.dto.WordReplaceRequest;
import routie.util.DatabaseCleaner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class WordControllerV1Test {

    @LocalServerPort
    private int port;

    @Autowired
    private DatabaseCleaner databaseCleaner;

    @Autowired
    private WordRepository wordRepository;

    @Autowired
    private WordService wordService;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        wordRepository.deleteAll();
    }

    @AfterEach
    void tearDown() {
        databaseCleaner.execute();
    }

    @Test
    @DisplayName("닉네임을 성공적으로 생성한다.")
    void getNickname() {
        // given
        wordService.addWord(WordType.ADJECTIVE, "행복한");
        wordService.addWord(WordType.NOUN, "하루");

        // when
        final ExtractableResponse<Response> response = RestAssured.given().log().all()
                .when().get("/v1/words/nickname")
                .then().log().all()
                .extract();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.jsonPath().getString("nickname")).isEqualTo("행복한 하루");
    }

    @Test
    @DisplayName("단어 추가 시 내용이 비어있으면 400 에러를 반환한다.")
    void addWordWithBlankContent() {
        // given
        final WordCreateRequest request = new WordCreateRequest(" ");

        // when
        final ExtractableResponse<Response> response = RestAssured.given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .when().post("/v1/words/{wordType}", WordType.ADJECTIVE)
                .then().log().all()
                .extract();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    @DisplayName("단어 목록 덮어쓰기 시 null 목록이면 400 에러를 반환한다.")
    void replaceAllWordsWithNullList() {
        // given
        final String requestBody = "{\"contents\":null}";

        // when
        final ExtractableResponse<Response> response = RestAssured.given().log().all()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when().put("/v1/words/{wordType}", WordType.ADJECTIVE)
                .then().log().all()
                .extract();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    @DisplayName("단어 목록 덮어쓰기 시 목록 내 단어 내용이 비어있으면 400 에러를 반환한다.")
    void replaceAllWordsWithBlankContentInList() {
        // given
        wordService.addWord(WordType.ADJECTIVE, "오래된1");
        final WordReplaceRequest request = new WordReplaceRequest(List.of("유효한단어", " "));

        // when
        final ExtractableResponse<Response> response = RestAssured.given().log().all()
                .contentType(ContentType.JSON)
                .body(request)
                .when().put("/v1/words/{wordType}", WordType.ADJECTIVE)
                .then().log().all()
                .extract();

        // then
        assertThat(response.statusCode()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    }
}
