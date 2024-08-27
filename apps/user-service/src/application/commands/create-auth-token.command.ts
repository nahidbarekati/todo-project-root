export class CreateAuthTokenCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
