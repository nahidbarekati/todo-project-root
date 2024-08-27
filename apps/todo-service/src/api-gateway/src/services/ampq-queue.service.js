"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let MessagingService = class MessagingService {
    constructor() {
        this.userDetailsClient = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
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
        this.addTodoListClient = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.RMQ,
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
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MessagingService);
//# sourceMappingURL=ampq-queue.service.js.map