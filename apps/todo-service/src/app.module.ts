import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoListSchema } from './infrastructure/repositories/todo-list.schema';
import { TodoItemSchema } from './infrastructure/repositories/todo-item.schema';
import { MongoTodoListRepository } from './infrastructure/repositories/mongo-todo-list.repository';
import { MongoTodoItemRepository } from './infrastructure/repositories/mongo-todo-item.repository';
import { TodoListController } from './interfaces/controllers/todo-list.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTodoListHandler } from './application/commands/handlers/create-todo-list.handler';
import { MessagingModule } from './api-gateway/src/massaging.module';
import { UpdateTodoListHandler } from './application/commands/handlers/update-todo-list.handler';
import { DeleteTodoListHandler } from './application/commands/handlers/delete-todo-list.handler';
import { TodoItemController } from './interfaces/controllers/todo-item.controller';
import { CreateTodoItemHandler } from './application/commands/todoItem/handler/create-todo-item.handler';
import { DeleteTodoItemHandler } from './application/commands/todoItem/handler/delete-todo-item.handler';
import { UpdateTodoItemHandler } from './application/commands/todoItem/handler/update-todo-item.handler';
import { GetTodoItemsHandler } from './application/queries/handlers/get-todo-items.handler';
import { UpdateTodoItemPriorityHandler } from './application/commands/todoItem/handler/update-todo-item-priority.handler';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/todo'),
    MongooseModule.forFeature([
      { name: 'TodoList', schema: TodoListSchema },
      { name: 'TodoItem', schema: TodoItemSchema },
    ]),
    CqrsModule,
    // MessagingModule,
  ],
  providers: [
    MongoTodoListRepository,
    MongoTodoItemRepository,
    CreateTodoListHandler,
    UpdateTodoListHandler,
    DeleteTodoListHandler,
    UpdateTodoItemHandler,
    DeleteTodoItemHandler,
    CreateTodoItemHandler,
    GetTodoItemsHandler,
    UpdateTodoItemPriorityHandler,
  ],
  exports: [MongoTodoListRepository, MongoTodoItemRepository],
  controllers: [TodoListController, TodoItemController],
})
export class AppModule {}
