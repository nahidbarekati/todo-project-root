import { DomainTodoItem } from '@todo-service/domain/entities/todo-item.entity';
import { TodoItem } from './todo-item.schema';

export class TodoItemMapper {
  static toPersistence(domainTodoItem: DomainTodoItem): TodoItem {
    return {
     // _id: domainTodoItem.id,
      title: domainTodoItem.title,
      description: domainTodoItem.description,
      priority: domainTodoItem.priority,
      todoList: domainTodoItem.todoList,
    } as TodoItem;
  }

  static toDomain(todoItem: TodoItem): DomainTodoItem {
    return new DomainTodoItem(
      //todoItem._id.toString(),
      todoItem.title,
      todoItem.description,
      todoItem.priority,
      todoItem.todoList,
    );
  }
}
