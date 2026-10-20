// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { config } from 'node:process';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  reporter : 'html',
  timeout: 60 * 1000,
  expect : {
    timeout: 5000,
  },
  use: {
    baseURL: 'https://www.cheapflights.com.au/',
    browserName : 'chromium'
  },


  fullyParallel: true,

});

