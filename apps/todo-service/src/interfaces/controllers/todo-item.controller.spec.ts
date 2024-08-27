import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemController } from './todo-item.controller';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateTodoItemPriorityCommand } from '@todo-service/application/commands/todoItem/update-todo-item-priority.command';

describe('TodoItemController', () => {
  let controller: TodoItemController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoItemController>(TodoItemController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should update priority successfully', async () => {
    const id = 'test-id';
    const priority = 1;
    const token = 'test-token';

    await controller.updatePriority(id, priority, token);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new UpdateTodoItemPriorityCommand(id, priority),
    );
  });
});
