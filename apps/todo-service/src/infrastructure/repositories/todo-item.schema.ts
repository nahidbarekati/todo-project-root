import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'; // ایمپورت mongoose

export type TodoItemDocument = TodoItem & Document;

@Schema()
export class TodoItem extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  priority: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TodoList',
    required: true,
  })
  todoList: string;
  
}

export const TodoItemSchema = SchemaFactory.createForClass(TodoItem);
