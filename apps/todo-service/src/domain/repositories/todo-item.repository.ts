import { DomainTodoItem } from '../entities/todo-item.entity';

export interface TodoItemRepository {
  create(todoItem: DomainTodoItem): Promise<DomainTodoItem>;
  findAll(): Promise<DomainTodoItem[]>;
  findById(id: string): Promise<DomainTodoItem | null>;
  update(id:string , todoItem: DomainTodoItem): Promise<DomainTodoItem>;
  delete(id: string): Promise<DomainTodoItem | null>;
  save(todoItem: DomainTodoItem): Promise<DomainTodoItem>; // This might be missing
  findByTodoListId(todoListId: string): Promise<DomainTodoItem[]>; // This might be missing
  deleteById(id: string): Promise<void>; // This might be missing
}