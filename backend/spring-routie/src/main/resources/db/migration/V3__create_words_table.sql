-- 닉네임에 사용될 단어(수식어, 명사)를 저장하는 테이블
CREATE TABLE words
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    word_type  VARCHAR(20)  NOT NULL,
    content    VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_word_type_content UNIQUE (word_type, content)
);
