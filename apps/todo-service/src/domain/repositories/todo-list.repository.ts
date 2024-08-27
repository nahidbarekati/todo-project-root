import { DomainTodoList } from '../entities/todo-list.entity';

export interface TodoListRepository {
  save(todoList: DomainTodoList): Promise<DomainTodoList>;
  findById(id: string): Promise<DomainTodoList | null>;
  findByUserId(userId: string): Promise<DomainTodoList[]>;
}
