CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nick_name VARCHAR(255) NOT NULL,
    oauth_identifier VARCHAR(255) NOT NULL,
    oauth_provider VARCHAR(255) NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

-- 마이그레이션 완료 후, not null 제약조건 추가 예정
ALTER TABLE routie_spaces ADD COLUMN owner_id BIGINT NULL;
ALTER TABLE routie_spaces ADD CONSTRAINT FK_routie_spaces_owner_id FOREIGN KEY (owner_id) REFERENCES users (id);
