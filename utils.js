// function to fetch the data
// takes one argument: day
// returns string of data

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
