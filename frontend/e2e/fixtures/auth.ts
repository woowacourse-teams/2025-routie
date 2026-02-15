import { test as base, Page } from '@playwright/test';

const USER_ACCESS_TOKEN =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYwMDAzNzg0LCJleHAiOjE4MjA0ODM3ODR9.VYRnzW1teqgtkVolRL2-CCCalzopE47-Jt1OwD7IDSkKDfPLa5KGK3zro4PdQiazXLjh0FtYS-cdeFK5RCnsCw';

export const setupUserAuth = async (page: Page) => {
  await page.addInitScript(
    (token) => {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('role', 'USER');
    },
    USER_ACCESS_TOKEN
  );
};

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    await setupUserAuth(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
