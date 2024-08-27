import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from '@nestjs/common';
import { MongoTodoItemRepository } from '@todo-service/infrastructure/repositories/mongo-todo-item.repository';
import { DomainTodoItem } from '@todo-service/domain/entities/todo-item.entity';
import { UpdateTodoItemPriorityCommand } from '../update-todo-item-priority.command';

@CommandHandler(UpdateTodoItemPriorityCommand)
export class UpdateTodoItemPriorityHandler
  implements ICommandHandler<UpdateTodoItemPriorityCommand>
{
  constructor(private readonly todoItemRepository: MongoTodoItemRepository) {}

  async execute(
    command: UpdateTodoItemPriorityCommand,
  ): Promise<DomainTodoItem> {
    const { id, priority } = command;

    console.log(command, 'command');

    // Find the TodoItem by id
    const todoItem = await this.todoItemRepository.findById(id);

    // Check if the TodoItem exists
    if (!todoItem) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }

    // Update the title of the TodoItem

    todoItem.priority = priority;

    // Save the updated TodoItem
    const updatedTodoItem = await this.todoItemRepository.update(id, todoItem);

    // Return the updated TodoItem
    return updatedTodoItem;
  }
}