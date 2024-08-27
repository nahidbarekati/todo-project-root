
export class DomainUser {
  constructor(
    public readonly id: string,
    public username: string,
    public password: string,
    public todoLists = [],
  ) {}

  changePassword(newPassword: string) {
    this.password = newPassword;
  }
  addTodoList(todoList) {
    this.todoLists.push(todoList);
  }

  removeTodoList(todoListId: string) {
    this.todoLists = this.todoLists.filter((list) => list.id !== todoListId);
  }
}
