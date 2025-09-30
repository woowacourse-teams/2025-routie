CREATE TABLE place_likes
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id   BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_place_likes_place_id FOREIGN KEY (place_id) REFERENCES places (id)
);
