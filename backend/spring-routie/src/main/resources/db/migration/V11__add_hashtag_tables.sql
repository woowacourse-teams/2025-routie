-- hashtags 테이블 생성
CREATE TABLE hashtags
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(50) NOT NULL,
    routie_space_id BIGINT      NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_hashtags_routie_space_id FOREIGN KEY (routie_space_id) REFERENCES routie_spaces (id)
);

-- place_hashtags 테이블 생성
CREATE TABLE place_hashtags
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id   BIGINT NOT NULL,
    hashtag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_place_hashtags_place_id FOREIGN KEY (place_id) REFERENCES places (id),
    CONSTRAINT FK_place_hashtags_hashtag_id FOREIGN KEY (hashtag_id) REFERENCES hashtags (id)
);
