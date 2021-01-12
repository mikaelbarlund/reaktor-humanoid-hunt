const fs = require('fs');

const reverseString = (str) => {
  if (str === '') return '';
  return reverseString(str.substr(1)) + str.charAt(0);
};

const convert = (input) => {
  const output = reverseString(input).match(/.{1,1}/g).reduce((a, x, i) => a + x * 2 ** i, 0);
  return output;
};

const getNext = (channels, ia, ib, bits) => {
  const next = convert(channels[ia][ib]);
  // console.log(bits, channels[ia][ib], next);
  const result = bits ? channels[ia][ib] : next;
  return channels[ia][next] ? getNext(channels, ia, next, bits) : result;
};

const convertBinary = (input) => String.fromCharCode(parseInt(input, 2));

const getFirst = (channels, ia, ib) => {
  const next = convert(channels[ia][ib]);
  return channels[ia][next] ? ib : getFirst(channels, ia, ib + 1);
};

const firstIndexes = (channels) => {
  const indexes = [14];
  channels.forEach((a, ia) => {
    const index = getFirst(channels, ia, 0);
    indexes[ia] = index;
  });
  return indexes;
};

module.exports = () => {
  fs.readFile('tattoo.txt', 'utf8', (err, data) => {
    console.log('---->tattoo');
    const pass1 = [];
    const channels = data.split('\n').map((a) => a.match(/.{1,8}/g));
    const indexes = firstIndexes(channels);
    channels.forEach((a, ia) => {
      pass1.push(getNext(channels, ia, indexes[ia], true));
    });
    const x = pass1.reduce((a, b) => a + convertBinary(b), '');
    console.log(x);
  });
};
