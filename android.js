const fs = require('fs');
const bitmapManipulation = require('bitmap-manipulation');

class TreeNode {
  constructor(value, parent, move) {
    this.value = value;
    this.descendants = [];
    this.parent = parent;
    this.move = move;
  }
}
const finnishes = [];
let allAvailable = [];

let visited = [];
let path = [];
let pathCoords = [];

const navigate = (currentNode, direction) => {
  visited.push(currentNode.value);
  const left = { x: currentNode.value.x - 1, y: currentNode.value.y };
  const right = { x: currentNode.value.x + 1, y: currentNode.value.y };
  const up = { x: currentNode.value.x, y: currentNode.value.y - 1 };
  const down = { x: currentNode.value.x, y: currentNode.value.y + 1 };

  const continues = [];
  if (allAvailable.find((a) => a.x === left.x && a.y === left.y)
    && !visited.find((a) => a.x === left.x && a.y === left.y)) {
    const nextNode = new TreeNode(left, currentNode, 'L');
    currentNode.descendants.push(nextNode);
    continues.push(nextNode);
  } else {
    continues.push(false);
  }
  if (allAvailable.find((a) => a.x === right.x && a.y === right.y)
  && !visited.find((a) => a.x === right.x && a.y === right.y)) {
    const nextNode = new TreeNode(right, currentNode, 'R');
    currentNode.descendants.push(nextNode);
    continues.push(nextNode);
  } else {
    continues.push(false);
  }
  if (allAvailable.find((a) => a.x === up.x && a.y === up.y)
  && !visited.find((a) => a.x === up.x && a.y === up.y)) {
    const nextNode = new TreeNode(up, currentNode, 'U');
    currentNode.descendants.push(nextNode);
    continues.push(nextNode);
  } else {
    continues.push(false);
  }
  if (allAvailable.find((a) => a.x === down.x && a.y === down.y)
  && !visited.find((a) => a.x === down.x && a.y === down.y)) {
    const nextNode = new TreeNode(down, currentNode, 'D');
    currentNode.descendants.push(nextNode);
    continues.push(nextNode);
  } else {
    continues.push(false);
  }
  if (finnishes.find((a) => a.x === down.x && a.y === down.y)) {
    let traverse = currentNode;
    path.unshift(traverse.move);
    pathCoords.unshift(traverse.value);
    do {
      traverse = traverse.parent;
      path.unshift(traverse.move);
      pathCoords.unshift(traverse.value);
    } while (traverse.parent);
    console.log(path.length);
  }

  if (continues.length > 0) {
    Array.from(Array(direction)).forEach(() => { continues.push(continues.shift()); });
    continues.forEach((a) => { if (a)navigate(a, direction); });
  }
};

const reNavigate = (node, direction) => {
  allAvailable = pathCoords;
  visited = [];
  path = [];
  pathCoords = [];
  navigate(node, direction);
};

module.exports = () => {
  fs.readFile('android.txt', 'utf8', (err, data) => {
    console.log('---->android');
    const bitmap = new bitmapManipulation.BMPBitmap(200, 200);
    const { palette } = bitmap;
    bitmap.drawFilledRect(0, 0, 200, 200, null, 0xff);
    const routes = data.split('\n');
    const routesAsCoord1 = [routes.length];
    const routesAsCoord2 = [routes.length];
    const allAvailable2 = [];
    const finnishes2 = [];
    const walls = [];
    const walls2 = [];
    const starts = [];
    const starts2 = [];

    routes.forEach((a, i) => { routesAsCoord1[i] = a.substring(a.indexOf(' ') + 1).split(','); routesAsCoord1[i].unshift({ x: parseInt(a.substring(0, a.indexOf(',')), 10), y: parseInt(a.substring(a.indexOf(',') + 1, a.indexOf(' ')), 10) }); });
    routesAsCoord1.forEach((r, ir) => {
      let prev = r[0];
      let type = '';
      routesAsCoord2[ir] = r.map((a) => {
        let thisOne = prev;
        if (a.x) return a;
        switch (a) {
          case 'R':
            thisOne = { x: prev.x + 1, y: prev.y };
            break;
          case 'L':
            thisOne = { x: prev.x - 1, y: prev.y };
            break;
          case 'U':
            thisOne = { x: prev.x, y: prev.y - 1 };
            break;
          case 'D':
            thisOne = { x: prev.x, y: prev.y + 1 };
            break;
          case 'S':
            type = a;
            starts.push(prev);
            break;
          case 'F':
            type = a;
            finnishes.push(prev);
            break;
          default:
            type = a;
            walls.push(prev);
        }
        prev = thisOne;
        return thisOne;
      });
      if (type === 'S') {
        starts2.push(routesAsCoord2[ir]);
      }
      if (type === 'F') {
        finnishes2.push(routesAsCoord2[ir]);
      }
      if (type === 'X') {
        walls2.push(routesAsCoord2[ir]);
      }
    });
    routesAsCoord2.forEach((a) => a
      .forEach((b) => allAvailable2.push(b)));
    routesAsCoord2.forEach((a) => a
      .forEach((b) => allAvailable.push(b)));
    const root = new TreeNode(starts[0], null);
    navigate(root, 0);
    Array.from(Array(10)).forEach((x, i) => { reNavigate(root, i + 1); });
    console.log(path.join(','));
    allAvailable2
      .forEach((b) => bitmap.drawFilledRect(b.x, b.y, 1, 1, null, palette.indexOf(0x000000)));

    pathCoords
      .forEach((b) => bitmap.drawFilledRect(b.x, b.y, 1, 1, null, palette.indexOf(0xffff00)));
    starts
      .forEach((b) => bitmap.drawFilledRect(b.x, b.y, 1, 1, null, palette.indexOf(0x00ff00)));
    finnishes
      .forEach((b) => bitmap.drawFilledRect(b.x, b.y, 1, 1, null, palette.indexOf(0xff00ff)));
    walls
      .forEach((b) => bitmap.drawFilledRect(b.x, b.y, 1, 1, null, palette.indexOf(0xff0000)));

    bitmap.save('OUT.bmp');
  });
};
