const { writeFile } = require('fs/promises');

exports.fetchRawAdventData = async (year, day, authHeaders) => {
  const res = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    headers: authHeaders,
  });
  const data = await res.text();
  if (data.startsWith('Puzzle inputs differ by user'))
    return Promise.reject('Invalid authorisation');
  if (res.status === 404) return Promise.reject(data);
  return data;
};

exports.writeAndLog = async (filePath, year, day, authHeaders) => {
  try {
    const data = await this.fetchRawAdventData(year, day, authHeaders);
    await writeFile(filePath, data);
    console.log(`Data written to ${filePath}`);
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
  }
};
