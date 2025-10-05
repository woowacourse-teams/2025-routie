-- Flyway 마이그레이션 스크립트

-- 1. users 테이블의 nick_name 컬럼을 nickname으로 변경합니다.
ALTER TABLE users
    RENAME COLUMN nick_name TO nickname;

-- 2. guests 테이블을 새로 생성합니다.
CREATE TABLE IF NOT EXISTS guests
(
    id
    BIGINT
    AUTO_INCREMENT
    PRIMARY
    KEY,
    nickname
    VARCHAR
(
    255
) NOT NULL,
    password VARCHAR
(
    255
) NULL,
    routie_space_id BIGINT NOT NULL,
    created_at DATETIME
(
    6
),
    updated_at DATETIME
(
    6
),
    CONSTRAINT FK_guests_routie_space_id FOREIGN KEY
(
    routie_space_id
) REFERENCES routie_spaces
(
    id
)
    );

-- 3. place_likes 테이블을 수정합니다.
-- 3.1. 컬럼 추가
ALTER TABLE place_likes
    ADD COLUMN user_id BIGINT NULL;
ALTER TABLE place_likes
    ADD COLUMN guest_id BIGINT NULL;
ALTER TABLE place_likes
    ADD COLUMN updated_at DATETIME(6);

-- 3.2. 기존 created_at 컬럼 타입 변경
ALTER TABLE place_likes
ALTER
COLUMN created_at DATETIME(6);

-- 3.3. 외래 키 제약조건 추가
ALTER TABLE place_likes
    ADD CONSTRAINT FK_place_likes_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE place_likes
    ADD CONSTRAINT FK_place_likes_guest_id FOREIGN KEY (guest_id) REFERENCES guests (id);


-- 4. words 테이블의 timestamp 컨벤션을 수정합니다.
-- 4.1. created_at 컬럼 타입 변경 및 DEFAULT 제거
ALTER TABLE words
ALTER
COLUMN created_at DATETIME(6);

-- 4.2. updated_at 컬럼 추가
ALTER TABLE words
    ADD COLUMN updated_at DATETIME(6);
