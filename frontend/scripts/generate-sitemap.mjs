import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 기본 도메인은 운영 주소를 사용하고, 필요하면 CI/스테이징에서 환경변수로 덮어쓴다.
const SITE_URL = (process.env.SITEMAP_SITE_URL || 'https://routie.me').replace(
  /\/+$/,
  '',
);
// 검색 인덱싱 대상인 공개 정적 라우트만 유지한다.
const STATIC_PATHS = ['/', '/routie-spaces', '/version'];
// 동적 라우트 사이트맵은 현재 비활성화 상태다.
// 추후 운영 시점에 공개 가능한 식별자 목록 + 실제 updatedAt(lastmod)을
// 백엔드에서 조회한 뒤 sitemap 항목으로 병합하는 방식으로 확장한다.
const GENERATED_AT = new Date().toISOString();

const escapeXml = (value) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const createUrlNode = ({ path, lastmod }) => {
  return [
    '  <url>',
    `    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </url>',
  ].join('\n');
};

const createStaticEntries = () => {
  return STATIC_PATHS.map((path) => ({
    path,
    lastmod: GENERATED_AT,
  }));
};

// TODO: 동적 라우트 사이트맵 확장 시 아래 로직을 활성화한다.
// const createDynamicEntries = (dynamicSpaces) => {
//   return dynamicSpaces.map((space) => ({
//     path: `/routie-spaces?routieSpaceIdentifier=${encodeURIComponent(space.id)}`,
//     lastmod: space.updatedAt,
//   }));
// };

const createSitemapXml = () => {
  // 현재는 정적 라우트만 포함한다.
  // 추후: [...createStaticEntries(), ...createDynamicEntries(dynamicSpaces)]
  const sitemapEntries = createStaticEntries();
  const urlNodes = sitemapEntries.map(createUrlNode).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>\n`;
};

// public 경로에 생성해 webpack 복사 단계에서 배포 산출물에 포함되도록 한다.
const outputPath = resolve(__dirname, '../public/sitemap.xml');
const sitemapXml = createSitemapXml();

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, sitemapXml, 'utf8');

console.log(`Generated sitemap: ${outputPath}`);
console.log(`Included URLs: ${STATIC_PATHS.length} (static only)`);
