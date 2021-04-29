import { DEFAULT_SIZE } from './constants.js';
import { setGodNumbers, getRandomInteger } from './helpers.js';
import Position from './Position.js';

const godNumbers = setGodNumbers();

class FifteenNodes {
  constructor(size = DEFAULT_SIZE, nodes = []) {
    this.size = size;
    this.finishNode = this.createFinishNode();
    this.initNodes(nodes);
  }

  initNodes(nodes) {
    if (nodes.length === 0) {
      this.nodes = [this.finishNode];
      this.generateNodes();
    } else {
      this.nodes = nodes;
    }
  }

  createFinishNode() {
    const node = [];
    let k = 1;
    for (let i = 0; i < this.size; i++) {
      node[i] = [];
      for (let j = 0; j < this.size; j++) {
        node[i][j] = k++;
      }
    }

    node[this.size-1][this.size-1] = 0;

    return node;
  }

  generateNodes() {
    let variants;
    const godNumber = godNumbers.get(this.size);
    let node = this.finishNode;

    for (let i = 0; i < godNumber; i++) {
      variants = this.moveTile(node);

      let index = getRandomInteger(0, variants.length - 1);

      if (
        this.nodes.length > 1
        && this.isEqualNodes(variants[index], this.nodes[this.nodes.length - 2])
      ) {
        variants.splice(index, 1);
        index = getRandomInteger(0, variants.length - 1);
      }

      node = variants[index];
      this.nodes.push(node);
    }
  }

  isEqualNodes(node1, node2) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (node1[i][j] !== node2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  findTile(node, tileValue) {
    let y = 0;
    for (let x = 0; x < this.size; x++) {
      y = node[x].indexOf(tileValue);
      if (y !== -1) {
        return new Position(x, y);
      }
    }
  }

  copyNode(node) {
    return node.map(item => item.slice());
  }

  swapTiles(node, pos1, pos2) {
    const nextNode = this.copyNode(node);
    nextNode[pos1.x][pos1.y] = node[pos2.x][pos2.y];
    nextNode[pos2.x][pos2.y] = node[pos1.x][pos1.y];

    return nextNode;
  }

  moveTile(node) {
    const emptyPosition = this.findTile(node, 0);

    const movedNodes = [];

    if (emptyPosition.y - 1 > -1) {
      movedNodes.push(
        this.swapTiles(
          node,
          emptyPosition,
          new Position(emptyPosition.x, emptyPosition.y - 1)
        )
      );
    }

    if (emptyPosition.y + 1 < this.size) {
      movedNodes.push(
        this.swapTiles(
          node,
          emptyPosition,
          new Position(emptyPosition.x, emptyPosition.y + 1)
        )
      );
    }

    if (emptyPosition.x - 1 > -1) {
      movedNodes.push(
        this.swapTiles(
          node,
          emptyPosition,
          new Position(emptyPosition.x - 1, emptyPosition.y)
        )
      );
    }

    if (emptyPosition.x + 1 < this.size) {
      movedNodes.push(
        this.swapTiles(
          node,
          emptyPosition,
          new Position(emptyPosition.x + 1, emptyPosition.y)
        )
      );
    }

    return movedNodes;
  }

  getNodes() {
    return this.nodes;
  }

  getLastNode() {
    return this.nodes[this.nodes.length - 1];
  }

  addNode(node) {
    this.nodes.push(node);
  }
}

export default FifteenNodes;
