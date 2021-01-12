const fs = require('fs');

const mostFrequent = (input) => {
  const counts = new Map();
  [...input].forEach((x) => counts.set(x, (counts.get(x) || 0) + 1));

  const sorted = new Map([...counts.entries()]
    .filter(([a]) => !(/.\d/.test(a)))
    .sort((a, b) => b[1] - a[1]));
  // console.log(sorted);
  const [firtLetter] = sorted
    .entries()
    .next().value;
  return firtLetter;
};
const nextChar = (input, a) => {
  const re = new RegExp(`${a}.`, 'g');
  const seconds = input.match(re);
  return mostFrequent(seconds).substring(1);
};

module.exports = () => {
  fs.readFile('nanobots.txt', 'utf8', (err, data) => {
    let baseValue = '';
    console.log('---->nanobots');
    let thisChar = mostFrequent(data);
    do {
      baseValue += thisChar;
      thisChar = nextChar(data, thisChar);
    } while (thisChar !== ';');
    console.log(baseValue);
  });
};
