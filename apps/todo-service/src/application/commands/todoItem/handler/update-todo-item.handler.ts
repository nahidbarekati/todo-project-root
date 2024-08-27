import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from '@nestjs/common';
import { UpdateTodoItemCommand } from '../update-todo-item.command';
import { MongoTodoItemRepository } from '@todo-service/infrastructure/repositories/mongo-todo-item.repository';
import { DomainTodoItem } from '@todo-service/domain/entities/todo-item.entity';

@CommandHandler(UpdateTodoItemCommand)
export class UpdateTodoItemHandler
  implements ICommandHandler<UpdateTodoItemCommand>
{
  constructor(private readonly todoItemRepository: MongoTodoItemRepository) {}

  async execute(command: UpdateTodoItemCommand): Promise<DomainTodoItem> {
    const { id, title, description, priority, todoList } = command;

    console.log(command, 'command');

    // Find the TodoItem by id
    const todoItem = await this.todoItemRepository.findById(id);

    // Check if the TodoItem exists
    if (!todoItem) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }

    // Update the title of the TodoItem
    todoItem.title = title;
    todoItem.description = description;
    todoItem.priority = priority;
    todoItem.todoList = todoList;

    // Save the updated TodoItem
    const updatedTodoItem = await this.todoItemRepository.update(id, todoItem);

    // Return the updated TodoItem
    return updatedTodoItem;
  }
}