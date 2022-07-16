import { DBItem } from './database';

export class Item {
  constructor(readonly id: number, readonly name: string, readonly price: number, readonly amount: number) {}

  get total() {
    return this.price * this.amount;
  }
}

export type ItemRequestDTO = {
  id: number;
  name: string;
  price: number;
  amount: number;
};

export class ItemFactory {
  static fromRequestDTO(data: ItemRequestDTO) {
    return new Item(data.id, data.name, data.price, data.amount);
  }

  static fromDBItem(dbItem: DBItem) {
    return new Item(dbItem.id, dbItem.name, dbItem.price, dbItem.amount);
  }
}
