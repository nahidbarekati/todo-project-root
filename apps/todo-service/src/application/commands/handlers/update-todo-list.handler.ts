import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MongoTodoListRepository } from '../../../infrastructure/repositories/mongo-todo-list.repository';
import { DomainTodoList } from '@todo-service/domain/entities/todo-list.entity';
import { UpdateTodoListCommand } from '../update-todo-list.command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateTodoListCommand)
export class UpdateTodoListHandler
  implements ICommandHandler<UpdateTodoListCommand>
{
  constructor(private readonly todoListRepository: MongoTodoListRepository) {}

  async execute(command: UpdateTodoListCommand): Promise<DomainTodoList> {
    const { userId, id, title } = command;

    console.log(command, 'command');

    // Find the TodoList by id
    const todoList = await this.todoListRepository.findById(id);

    // Check if the TodoList exists
    if (!todoList) {
      throw new NotFoundException(`TodoList with id ${id} not found`);
    }

    // Update the title of the TodoList
    todoList.title = title;

    // Save the updated TodoList
    const updatedTodoList = await this.todoListRepository.update(id, todoList);

    // Return the updated TodoList
    return updatedTodoList;
  }
}