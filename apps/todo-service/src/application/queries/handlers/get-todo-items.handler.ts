import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTodoItemsQuery } from '../get-todo-items.query';
import { MongoTodoItemRepository } from '@todo-service/infrastructure/repositories/mongo-todo-item.repository';
import { MongoTodoListRepository } from '@todo-service/infrastructure/repositories/mongo-todo-list.repository';
import { DomainTodoItem } from '@todo-service/domain/entities/todo-item.entity';

@QueryHandler(GetTodoItemsQuery)
export class GetTodoItemsHandler implements IQueryHandler<GetTodoItemsQuery> {
  constructor(
    private readonly todoItemRepository: MongoTodoItemRepository,
    private readonly todoListRepository: MongoTodoListRepository,
  ) {}

  async execute(query: GetTodoItemsQuery): Promise<DomainTodoItem[]> {
    const todoListDocuments = await this.todoListRepository.findByUserId(
      query.id,
    );

    const filteredTodoLists = todoListDocuments.filter(
      (list) => list.todoItems && list.todoItems.length > 0,
    );

    const todoItemIds = filteredTodoLists.flatMap((list) =>
      list.todoItems.map((item) => item.toString()),
    );

    if (todoItemIds.length === 0) {
      return [];
    }

    const todoItems = await this.todoItemRepository.findByIds(todoItemIds);

    return todoItems.sort((a, b) => a.priority - b.priority);
  }
}
