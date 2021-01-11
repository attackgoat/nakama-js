/**
 * Copyright 2018 The Nakama Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Page} from "puppeteer";
import {Client} from "../packages/nakama-js/index";
import {createPage, createFacebookInstantGameAuthToken, generateid} from "./utils";

describe('Authenticate Tests', () => {

  it('should authenticate with email', async () => {
    let page : Page = await createPage();

    const email = generateid() + "@example.com";
    const password = generateid();

    const session = await page.evaluate(async (email, password) => {
      const client = new Client();
      const promise = client.authenticateEmail(email, password);
      return promise;
    }, email, password);

    expect(session).not.toBeNull();
    expect(session.token).not.toBeNull();
  });

  it('should authenticate with device id', async () => {
    let page : Page = await createPage();

    const deviceid = generateid();

    const session = await page.evaluate((deviceid) => {
      const client = new Client();
      return client.authenticateDevice(deviceid);
    }, deviceid);

    expect(session).not.toBeNull();
    expect(session.token).not.toBeNull();
  });

  it('should authenticate with custom id', async () => {
    let page : Page = await createPage();

    const customid = generateid();

    const session = await page.evaluate((customid) => {
      const client = new Client();
      return client.authenticateCustom(customid);
    }, customid);

    expect(session).not.toBeNull();
    expect(session.token).not.toBeNull();
  });

  it('should fail to authenticate with new custom id', async () => {
    let page : Page = await createPage();

    const customid = generateid();
    const result = await page.evaluate(async (customid) => {
      const client = new Client();
      try {
        // Expects exception.
        return await client.authenticateCustom(customid, false);
      } catch (err) {
        return err;
      }
    }, customid);

    expect(result).not.toBeNull();
  });

  it('should authenticate with custom id twice', async () => {
    let page : Page = await createPage();

    const customid = "someuniquecustomid";

    const session = await page.evaluate(async (customid) => {
      const client = new Client();
      await client.authenticateCustom(customid);
      return await client.authenticateCustom(customid);
    }, customid);

    expect(session).not.toBeNull();
    expect(session.token).not.toBeNull();
  });

  it('should fail authenticate with custom id', async () => {
    let page : Page = await createPage();

    const result = await page.evaluate(async () => {
      const client = new Client();
      try {
        // Expects exception.
        return await client.authenticateCustom("");
      } catch (err) {
        return err;
      }
    });

    expect(result).not.toBeNull();
  });

  it('should authenticate with facebook instant games', async () => {
    let token : string = createFacebookInstantGameAuthToken("a_player_id");
    let page : Page = await createPage();

    const session = await page.evaluate((token) => {
      const client = new Client();
      return client.authenticateFacebookInstantGame(token);
    }, token);

    expect(session).not.toBeNull();
    expect(session.token).not.toBeNull();
  });
});