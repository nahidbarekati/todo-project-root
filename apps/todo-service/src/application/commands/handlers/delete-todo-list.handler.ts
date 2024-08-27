import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MongoTodoListRepository } from '../../../infrastructure/repositories/mongo-todo-list.repository';
import { DeleteTodoListCommand } from '../delete-todo-list.command';
import { NotFoundException } from '@nestjs/common';
import { MongoTodoItemRepository } from '@todo-service/infrastructure/repositories/mongo-todo-item.repository';

@CommandHandler(DeleteTodoListCommand)
export class DeleteTodoListHandler
  implements ICommandHandler<DeleteTodoListCommand>
{
  constructor(
    private readonly todoItemRepository: MongoTodoItemRepository,
    private readonly todoListRepository: MongoTodoListRepository,
  ) {}

  async execute(command: DeleteTodoListCommand): Promise<void> {
    const { id } = command;

    //Find the TodoList by id
    const todoList = await this.todoListRepository.findById(id);

    //Check if the TodoList exists
    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${id} not found`);
    }

    await this.todoItemRepository.deleteByTodoListId(id);

    // Delete the TodoList
    await this.todoListRepository.delete(id);

    //Return void (indicating successful deletion)
  }
}
