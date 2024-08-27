import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class MessagingService {
  public userDetailsClient: ClientProxy;
  public addTodoListClient: ClientProxy;

  constructor() {
    this.userDetailsClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'user_details_queue',
        queueOptions: {
          durable: true,
          exclusive: false,
          autoDelete: false,
        },
      },
    });

    this.addTodoListClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'todo_list_queue',
        queueOptions: {
          durable: true,
          exclusive: false,
          autoDelete: false,
        },
      },
    });
  }
}
