export class Queue<T> {

    private _elements: T[] = [];

    enqueue(element: T){
        this._elements.push(element);
    }

    dequeue(): T | undefined {
        return this._elements.shift();
    }

    peek(): T {
        return this._elements[0];
    }

    size(): number{
        return this._elements.length;
    }

    isEmpty(): boolean {
        return !this.size();
    }
}