import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { TodoListRepository } from '@todo-service/domain/repositories/todo-list.repository';
import { TodoList, TodoListDocument } from './todo-list.schema';
import { DomainTodoList } from '@todo-service/domain/entities/todo-list.entity';
 // Import the Mapper

@Injectable()
export class MongoTodoListRepository implements TodoListRepository {
  constructor(
    @InjectModel(TodoList.name) private todoListModel: Model<TodoListDocument>,
  ) {}

  async save(todoList: DomainTodoList): Promise<DomainTodoList> {
    const createdTodoList = new this.todoListModel({
      title: todoList.title,
      todoItems: todoList.todoItems,
      userId: todoList.userId,
    });
    const savedTodoList = await createdTodoList.save();
    return this.toDomain(savedTodoList);
  }

  async findAll(): Promise<DomainTodoList[]> {
    const todoLists = await this.todoListModel
      .find()
      .populate('todoItems')
      .exec();
    return todoLists.map(this.toDomain);
  }

  async findById(id: string): Promise<DomainTodoList | null> {
    const todoListDocument = await this.todoListModel.findById(id).exec();
    if (!todoListDocument) {
      return null;
    }
    return this.toDomain(todoListDocument);
  }

  async findByUserId(userId: string) {
    const todoLists = await this.todoListModel.find({ userId }).exec();
    return todoLists.map(this.toDomain);
  }

  async update(
    id: string,
    todoList: Partial<DomainTodoList>,
  ): Promise<DomainTodoList | null> {
    const updatedTodoList = await this.todoListModel
      .findByIdAndUpdate(id, todoList, { new: true })
      .exec();
    return updatedTodoList ? this.toDomain(updatedTodoList) : null;
  }

  async delete(id: string): Promise<DomainTodoList | null> {
    const deletedList = await this.todoListModel.findByIdAndDelete(id).exec();
    return deletedList ? this.toDomain(deletedList) : null;
  }

  async addTodoItemToList(
    todoListId: string,
    todoItemId: string,
  ) {
    const updatedTodoList = await this.todoListModel
      .findByIdAndUpdate(
        todoListId,
        { $push: { todoItems: todoItemId } },
        { new: true },
      )
      .exec();

    return updatedTodoList ? updatedTodoList : null;
  }

  private toDomain(todoListDocument: TodoList): DomainTodoList {
    return new DomainTodoList(
      //todoListDocument._id.toString(),
      todoListDocument.title,
      todoListDocument.userId,
      todoListDocument.todoItems,
    );
  }
}
