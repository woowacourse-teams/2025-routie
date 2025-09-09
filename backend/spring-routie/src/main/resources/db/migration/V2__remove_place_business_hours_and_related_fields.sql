-- 검증과 관련된 컬럼 및 테이블 제거

-- NOTE: Flyway user 에게 DROP 권한이 없기 떄문에 아래 명령어 수동 실행 필요

-- ALTER TABLE places DROP COLUMN stay_duration_minutes;
-- ALTER TABLE places DROP COLUMN open_at;
-- ALTER TABLE places DROP COLUMN close_at;
-- ALTER TABLE places DROP COLUMN break_start_at;
-- ALTER TABLE places DROP COLUMN break_end_at;

-- flyway migration을 위한 DB 테이블에 영향이 없는 의미 없는 쿼리
SELECT 1 as migration_completed;
