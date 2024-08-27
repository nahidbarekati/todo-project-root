export class UpdateTodoItemPriorityCommand {
  constructor(
    public readonly id: string,
    public readonly priority: number,

  ) {}
}
