export class UpdateTodoListCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
  ) {}
}
