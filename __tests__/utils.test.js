const utils = require('../utils');
const { readFile, unlink } = require('fs/promises');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchRawAdventData', () => {
  const VALID_DAY = 1;
  const DAY_1_URL = `https://adventofcode.com/2022/day/${VALID_DAY}/input`;
  const VALID_AUTH_HEADERS = { cookie: 'fake-cookie' };
  const FAKE_DATA = '123\n456\n789\n';
  const INVALID_DAY = 27;
  const FETCH_ERROR_404_MSG = '404 - not found';
  const INVALID_AUTH_HEADERS = { cookie: 'no-good' };
  const FETCH_ERROR_AUTH_MSG = 'Puzzle inputs differ by user.';
  const CUSTOM_AUTH_ERROR = 'Invalid authorisation';

  const { fetchRawAdventData } = utils;

  global.fetch = jest.fn((url, { headers }) => {
    // what a faff
    const validUrl = url === DAY_1_URL;
    const validAuth = headers === VALID_AUTH_HEADERS;

    return new Promise((resolve) => {
      resolve({
        text: () => {
          return new Promise((resolve, reject) => {
            if (!validAuth) resolve(FETCH_ERROR_AUTH_MSG);
            if (!validUrl) resolve(FETCH_ERROR_404_MSG);
            else resolve(FAKE_DATA);
          });
        },
        status: validUrl ? 200 : 404
      });
    });
  });

  test('invokes fetch with the correct URL and auth headers', async () => {
    await fetchRawAdventData(VALID_DAY, VALID_AUTH_HEADERS);
    expect(fetch).toHaveBeenCalledWith(DAY_1_URL, {
      headers: VALID_AUTH_HEADERS
    });
  });
  test('returns raw data from given day', async () => {
    const data = await fetchRawAdventData(VALID_DAY, VALID_AUTH_HEADERS);
    expect(data).toBe(FAKE_DATA);
  });
  test('responds with fetch error given invalid day', async () => {
    await expect(
      fetchRawAdventData(INVALID_DAY, VALID_AUTH_HEADERS)
    ).rejects.toEqual(FETCH_ERROR_404_MSG);
  });
  test('responds with custom error given bad auth', async () => {
    await expect(
      fetchRawAdventData(VALID_DAY, INVALID_AUTH_HEADERS)
    ).rejects.toEqual(CUSTOM_AUTH_ERROR);
  });
});

describe('writeAndLog', () => {
  const { writeAndLog } = utils;

  const FAKE_DATA = 'some\ndata\nhere';
  const FILE_PATH = './__tests__/success.txt';
  const AUTH_HEADERS = { cookie: 'fake-cookie' };
  const DAY = 1;
  const SUCCESS_MSG = `Data written to ${FILE_PATH}`;
  const ERROR_MSG = '404 - not found';

  const mockFetchData = jest.spyOn(utils, 'fetchRawAdventData');

  test('writes fetched data to file', async () => {
    mockFetchData.mockResolvedValue(FAKE_DATA);

    await writeAndLog(FILE_PATH, DAY, AUTH_HEADERS);
    const fileContents = await readFile(FILE_PATH, 'utf-8');
    expect(fileContents).toBe(FAKE_DATA);
    await unlink(FILE_PATH);
  });
  test('logs a success message once data written', async () => {
    jest.spyOn(console, 'log');
    mockFetchData.mockResolvedValue(FAKE_DATA);

    await writeAndLog(FILE_PATH, DAY, AUTH_HEADERS);
    expect(console.log).toHaveBeenCalledWith(SUCCESS_MSG);
    await unlink(FILE_PATH);
  });
  test('logs an error message if error occurs in fetching', async () => {
    jest.spyOn(console, 'log');
    mockFetchData.mockRejectedValue(ERROR_MSG);

    await writeAndLog(FILE_PATH, DAY, AUTH_HEADERS);
    expect(console.log).toHaveBeenCalledWith(
      `Something went wrong: ${ERROR_MSG}`
    );
  });
});
