import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { TodoItem } from './todo-item.schema';

export type TodoListDocument = TodoList & Document;

@Schema()
export class TodoList extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TodoItem' }] }) // استفاده از mongoose.Schema.Types.ObjectId
  todoItems: TodoItem[];
}

export const TodoListSchema = SchemaFactory.createForClass(TodoList);
