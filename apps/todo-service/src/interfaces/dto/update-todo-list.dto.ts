import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoListDto {
  @ApiProperty({
    example: 'My Updated Todo List',
    description: 'The new title of the todo list',
  })
  title: string;
}
