-- 검증과 관련된 컬럼 및 테이블 제거

ALTER TABLE places DROP COLUMN stay_duration_minutes;
ALTER TABLE places DROP COLUMN open_at;
ALTER TABLE places DROP COLUMN close_at;
ALTER TABLE places DROP COLUMN break_start_at;
ALTER TABLE places DROP COLUMN break_end_at;
