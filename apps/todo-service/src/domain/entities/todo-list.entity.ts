import { DomainTodoItem } from "./todo-item.entity";



export class DomainTodoList {
  constructor(
   // public readonly id: string,
    public title: string,
    public userId: string,
    public todoItems: DomainTodoItem[] = [],
  ) {}

  // addTodoItem(todoItem: DomainTodoItem) {
  //   this.todoItems.push(todoItem);
  //   //this.todoItems.sort((a, b) => a.priority - b.priority);
  // }

  // removeTodoItem(todoItemId: string) {
  //   this.todoItems = this.todoItems.filter((item) => item.id !== todoItemId);
  // }

  // editTodoItem(
  //   todoItemId: string,
  //   title: string,
  //   description: string,
  //   priority: number,
  // ) {
  //   const item = this.todoItems.find((item) => item.id === todoItemId);
  //   if (item) {
  //     item.title = title;
  //     item.description = description;
  //     item.priority = priority;
  //     this.todoItems.sort((a, b) => a.priority - b.priority);
  //   }
  // }
}
