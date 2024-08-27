import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoListDto {
  @ApiProperty({
    example: 'My Todo List',
    description: 'The title of the todo list',
  })
  title: string;
}
