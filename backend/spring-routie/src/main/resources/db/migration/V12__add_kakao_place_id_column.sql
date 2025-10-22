-- kakao_place_id 컬럼을 places 테이블에 추가

ALTER TABLE places
    ADD COLUMN kakao_place_id VARCHAR(255);
