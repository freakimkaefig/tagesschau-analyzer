export class TestCommand {
  public async run(): Promise<void> {
    console.log('Run test command');

    return Promise.resolve();
  }
}
