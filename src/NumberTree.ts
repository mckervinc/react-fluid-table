type LeafProps = {
  height: number;
  index: number;
};

class Leaf {
  index: number;
  height: number;
  constructor(props: LeafProps) {
    this.index = props.index;
    this.height = props.height;
  }
}

/**
 * Quick and dirty BST used to calculate the median of a set
 * of numbers without having to sort every time
 */
export default class NumberTree {
  #data: Leaf[] = [];
  #indexedRows = new Set<number>();
  constructor() {}

  getMedian = () => {
    if (!this.#data.length) {
      return 0;
    }

    if (this.#data.length % 2 === 0) {
      const l = this.#data[Math.floor(this.#data.length / 2)];
      const r = this.#data[Math.ceil(this.#data.length / 2)];

      return (l.height + r.height) / 2;
    }

    const m = Math.floor(this.#data.length / 2);
    return this.#data[m].height;
  };

  // recursively binary insert
  insert = (leaf: LeafProps) => {
    const m = Math.floor(this.#data.length / 2);
    this._insert(0, m, this.#data.length, leaf);
  };

  /**
   * clear data from this index forward.
   */
  clearFromIndex = (index: number) => {
    if (index <= 0) {
      this.#data = [];
      this.#indexedRows.clear();
    } else {
      this.#data = this.#data.filter(leaf => leaf.index < index);
      this.#indexedRows = new Set(this.#data.map(leaf => leaf.index));
    }
  };

  // ignore already indexed rows
  hasIndex = (index: number) => this.#indexedRows.has(index);

  private _insert = (l: number, m: number, r: number, data: LeafProps) => {
    const leaf = this.#data[m];
    if (!leaf || leaf.height === data.height) {
      this._addLeafNode(m, data);
      return;
    }

    // check less than
    if (data.height < leaf.height) {
      if (m === l) {
        this._addLeafNode(l, data);
        return;
      }
      const nM = Math.floor((m - l) / 2);
      this._insert(l, nM, m, data);
    } else {
      const nM = Math.ceil((r + m) / 2);
      if (nM === r) {
        this._addLeafNode(r, data);
        return;
      }

      this._insert(m, nM, r, data);
    }
  };

  private _addLeafNode = (m: number, data: LeafProps) => {
    this.#data.splice(m, 0, new Leaf(data));
    this.#indexedRows.add(data.index);
  };
}
