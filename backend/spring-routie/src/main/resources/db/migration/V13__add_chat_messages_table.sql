CREATE TABLE `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `routie_space_id` BIGINT NOT NULL,
    `user_id` BIGINT,
    `guest_id` BIGINT,
    `message_type` VARCHAR(20) NOT NULL,
    `content` VARCHAR(1000),
    `created_at` DATETIME(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE INDEX `idx_chat_messages_space_time` ON `chat_messages` (`routie_space_id`, `created_at`);
