import { test as base, Page, APIRequestContext } from '@playwright/test';

const USER_ACCESS_TOKEN =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYwMDAzNzg0LCJleHAiOjE4MjA0ODM3ODR9.VYRnzW1teqgtkVolRL2-CCCalzopE47-Jt1OwD7IDSkKDfPLa5KGK3zro4PdQiazXLjh0FtYS-cdeFK5RCnsCw';

const API_BASE_URL = 'https://dapi.routie.me';

const SAMPLE_PLACES = [
  {
    name: '스타벅스 강남점',
    roadAddressName: '서울 강남구 강남대로 396',
    addressName: '서울 강남구 역삼동 858-12',
    longitude: 127.0274,
    latitude: 37.4979,
    searchedPlaceId: '1169818138',
    hashtags: [],
  },
  {
    name: '강남역',
    roadAddressName: '서울 강남구 강남대로',
    addressName: '서울 강남구 역삼동',
    longitude: 127.0281,
    latitude: 37.498,
    searchedPlaceId: '7946755',
    hashtags: [],
  },
];

export const setupUserAuth = async (page: Page) => {
  await page.addInitScript(
    (token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('role', 'USER');
    },
    USER_ACCESS_TOKEN,
  );
};

const createSpace = async (request: APIRequestContext): Promise<string> => {
  const response = await request.post(`${API_BASE_URL}/v2/routie-spaces`, {
    headers: { Authorization: `Bearer ${USER_ACCESS_TOKEN}` },
  });
  const data = await response.json();
  return data.routieSpaceIdentifier;
};

const addPlace = async (
  request: APIRequestContext,
  spaceUuid: string,
  place: (typeof SAMPLE_PLACES)[0],
): Promise<number> => {
  const response = await request.post(
    `${API_BASE_URL}/v2/routie-spaces/${spaceUuid}/places`,
    { data: place },
  );
  const data = await response.json();
  return data.id;
};

const addRoutiePlace = async (
  request: APIRequestContext,
  spaceUuid: string,
  placeId: number,
): Promise<void> => {
  await request.post(
    `${API_BASE_URL}/v1/routie-spaces/${spaceUuid}/routie/places`,
    { data: { placeId } },
  );
};

type SpaceFixture = { page: Page; spaceUuid: string };

export const test = base.extend<{
  authenticatedPage: Page;
  spaceWithPlaces: SpaceFixture;
  spaceWithRoutie: SpaceFixture;
  spaceUuid: string;
}>({
  authenticatedPage: async ({ page }, use) => {
    await setupUserAuth(page);
    await use(page);
  },

  // 장소 2개가 장소 목록에 미리 추가된 스페이스
  spaceWithPlaces: async ({ page, request }, use) => {
    await setupUserAuth(page);
    const spaceUuid = await createSpace(request);
    await addPlace(request, spaceUuid, SAMPLE_PLACES[0]);
    await addPlace(request, spaceUuid, SAMPLE_PLACES[1]);
    await page.goto(`/routie-spaces?routieSpaceIdentifier=${spaceUuid}`);
    await page.waitForURL(/\/routie-spaces/);
    // SSE로 장소 데이터가 도착할 때까지 대기
    await page.getByText('스타벅스 강남점').waitFor({ state: 'visible', timeout: 10000 });
    await use({ page, spaceUuid });
  },

  // 장소 2개가 동선에도 추가된 스페이스
  spaceWithRoutie: async ({ page, request }, use) => {
    await setupUserAuth(page);
    const spaceUuid = await createSpace(request);
    const placeId1 = await addPlace(request, spaceUuid, SAMPLE_PLACES[0]);
    const placeId2 = await addPlace(request, spaceUuid, SAMPLE_PLACES[1]);
    await addRoutiePlace(request, spaceUuid, placeId1);
    await addRoutiePlace(request, spaceUuid, placeId2);
    await page.goto(`/routie-spaces?routieSpaceIdentifier=${spaceUuid}`);
    await page.waitForURL(/\/routie-spaces/);
    // SSE로 장소 데이터가 도착할 때까지 대기
    await page.getByText('스타벅스 강남점').waitFor({ state: 'visible', timeout: 10000 });
    await use({ page, spaceUuid });
  },

  // 스페이스 UUID만 필요한 경우 (페이지 없이 API로만 생성)
  spaceUuid: async ({ request }, use) => {
    const uuid = await createSpace(request);
    await use(uuid);
  },
});

export { expect } from '@playwright/test';
