import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { MongoTodoItemRepository } from '@todo-service/infrastructure/repositories/mongo-todo-item.repository';
import { DeleteTodoItemCommand } from '../delete-todo-item.command';

@CommandHandler(DeleteTodoItemCommand)
export class DeleteTodoItemHandler
  implements ICommandHandler<DeleteTodoItemCommand>
{
  constructor(private readonly todoItemRepository: MongoTodoItemRepository) {}

  async execute(command: DeleteTodoItemCommand): Promise<void> {
    const { id } = command;

    //Find the TodoItem by id
    const todoItem = await this.todoItemRepository.findById(id);

    //Check if the TodoItem exists
    if (!todoItem) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }

    // Delete the TodoItem
    await this.todoItemRepository.delete(id);

    //Return void (indicating successful deletion)
  }
}
