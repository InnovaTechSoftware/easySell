export abstract class Queue<T> {
  protected items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  moveToEnd(item: T): void {
    const index = this.items.findIndex((i) => i === item);
    if (index !== -1) {
      const [removedItem] = this.items.splice(index, 1);
      this.items.push(removedItem);
    }
  }

  printQueue(): void {
    console.log('Elementos en la cola:');
    this.items.forEach((item, index) => {
      console.log(`[${index}]:`, item);
    });
  }

  getQueue(): T[] {
    return this.items;
  }

  abstract process(item: T): Promise<string | void>;
}
