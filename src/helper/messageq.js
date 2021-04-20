// this is used to fix the bug - connection status is updated wrong
class MessageQ {
  items = [];
  constructor() {
  }
  queue(item) {
    this.items.push(item);
  }
  dequeue() {
    return this.items.shift();
  }
  sortByTime() {
    this.items = [...this.items].sort((a,b) => a.time - b.time); // sort by time asc
  }
  run() {
    this.sortByTime();
    for (let item of this.items) {
      item.func(item.status);
    }
  }

}

export default MessageQ;