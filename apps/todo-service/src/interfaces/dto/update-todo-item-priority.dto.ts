import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoItemPriorityDto {
  

  @ApiProperty({
    description:
      'Priority level of the Todo Item, from 1 (lowest) to 5 (highest)',
    example: 3,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  priority: number;
}
