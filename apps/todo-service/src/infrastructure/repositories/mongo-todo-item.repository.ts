import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoItem, TodoItemDocument } from './todo-item.schema';
import { TodoItemRepository } from '@todo-service/domain/repositories/todo-item.repository';
import { DomainTodoItem } from '@todo-service/domain/entities/todo-item.entity';
import { TodoItemMapper } from './todo-item.mapper'; // Import the Mapper

@Injectable()
export class MongoTodoItemRepository implements TodoItemRepository {
  constructor(
    @InjectModel(TodoItem.name) private todoItemModel: Model<TodoItemDocument>,
  ) {}
  async save(todoItem: DomainTodoItem) {
    const createdTodoItem = new this.todoItemModel({
      title: todoItem.title,
      description: todoItem.description,
      priority: todoItem.priority,
      todoList: todoItem.todoList,
    });

    const savedTodoItem = await createdTodoItem.save();
    return savedTodoItem;
  }
  findByTodoListId(todoListId: string): Promise<DomainTodoItem[]> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async create(todoItem: DomainTodoItem): Promise<DomainTodoItem> {
    const createdTodoItem = new this.todoItemModel(
      TodoItemMapper.toPersistence(todoItem),
    );
    const savedTodoItem = await createdTodoItem.save();
    return TodoItemMapper.toDomain(savedTodoItem);
  }

  async findAll(): Promise<DomainTodoItem[]> {
    const todoItems = await this.todoItemModel.find().exec();
    return todoItems.map(TodoItemMapper.toDomain);
  }

  async findById(id: string): Promise<DomainTodoItem | null> {
    const todoItem = await this.todoItemModel.findById(id).exec();
    return todoItem ? TodoItemMapper.toDomain(todoItem) : null;
  }

  async update(
    id: string,
    todoItem: Partial<DomainTodoItem>,
  ): Promise<DomainTodoItem | null> {
    const updatedTodoItem = await this.todoItemModel
      .findByIdAndUpdate(
        id,
        TodoItemMapper.toPersistence(todoItem as DomainTodoItem),
        { new: true },
      )
      .exec();
    return updatedTodoItem ? TodoItemMapper.toDomain(updatedTodoItem) : null;
  }

  async delete(id: string): Promise<DomainTodoItem | null> {
    const deletedTodoItem = await this.todoItemModel
      .findByIdAndDelete(id)
      .exec();
    return deletedTodoItem ? TodoItemMapper.toDomain(deletedTodoItem) : null;
  }

  async deleteByTodoListId(todoListId: string): Promise<void> {
    await this.todoItemModel.deleteMany({ todoList: todoListId }).exec();
  }


  async findByIds(ids: string[]): Promise<DomainTodoItem[]> {
    return this.todoItemModel
      .find({ _id: { $in: ids } })
      .sort({ priority: 1 })
      .exec();
  }

  private toDomain(todoItemDocument: TodoItemDocument): DomainTodoItem {
    return new DomainTodoItem(
      //todoItemDocument._id.toString(),
      todoItemDocument.title,
      todoItemDocument.description,
      todoItemDocument.priority,
      todoItemDocument.todoList.toString(),
    );
  }
}
