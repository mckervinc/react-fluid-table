interface LeafProps {
  height: number;
  index: number;
}

class Leaf {
  height: number;
  indices: number = 0;
  constructor(props: LeafProps) {
    this.height = props.height;
    this.indices++;
  }
}

/**
 * Quick and dirty BST used to calculate the median of a set
 * of numbers without having to sort every time
 */
export default class NumberTree {
  #size = 0;
  #data: Leaf[] = [];
  #indexedRows = new Set<number>();
  constructor() {}

  getMedian = () => {
    let sum = 0;
    const m = this.#size / 2;
    const leaf = this.#data.find(l => {
      sum += l.indices;
      return m <= sum;
    });

    return !leaf ? 0 : leaf.height;
  };

  // recursively binary insert
  insert = (leaf: LeafProps) => {
    // ignore already indexed rows
    if (this.#indexedRows.has(leaf.index)) {
      return;
    }

    const m = Math.floor(this.#data.length / 2);
    this._insert(0, m, this.#data.length, leaf);
  };

  clear = () => {
    this.#size = 0;
    this.#data = [];
    this.#indexedRows = new Set<number>();
  }

  private _insert = (l: number, m: number, r: number, data: LeafProps) => {
    const leaf = this.#data[m];
    if (!leaf) {
      this._addLeafNode(m, data);
      return;
    }

    if (leaf.height === data.height) {
      leaf.indices++;
      this._increment(data);
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
    this._increment(data);
  };

  private _increment = (data: LeafProps) => {
    this.#indexedRows.add(data.index);
    this.#size++;
  }
}
