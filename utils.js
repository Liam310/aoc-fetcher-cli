const { writeFile } = require('fs/promises');

exports.fetchRawAdventData = async (day, authHeaders) => {
  const res = await fetch(`https://adventofcode.com/2022/day/${day}/input`, {
    headers: authHeaders
  });
  const data = await res.text();
  if (data.startsWith('Puzzle inputs differ by user'))
    return Promise.reject('Invalid authorisation');
  if (res.status === 404) return Promise.reject(data);
  return data;
};

exports.writeAndLog = async (filePath, day, authHeaders) => {
  try {
    const data = await this.fetchRawAdventData(day, authHeaders);
    await writeFile(filePath, data);
    console.log(`Data written to ${filePath}`);
  } catch (err) {
    console.log(`Something went wrong: ${err}`);
  }
};
