import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoItemDto {
  @ApiProperty({
    description: 'Title of the Todo Item',
    example: 'Buy groceries',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Detailed description of the Todo Item',
    example: 'Buy milk, eggs, and bread from the supermarket.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description:
      'Priority level of the Todo Item, from 1 (lowest) to 5 (highest)',
    example: 3,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number;

  @ApiProperty({
    description: 'The ID of the Todo List that this item belongs to',
    example: '64d2b44f44b85f5b0f9817d2',
    required: false,
  })
  @IsString()
  @IsOptional()
  todoList?: string;
}
