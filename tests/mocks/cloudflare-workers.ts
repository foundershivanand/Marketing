export class WorkflowEntrypoint<Env = unknown, Params = unknown> {
  ctx: any;
  env: Env;
  constructor(ctx: any, env: Env) {
    this.ctx = ctx;
    this.env = env;
  }
  async run(event: any, step: any): Promise<unknown> {
    throw new Error('Not implemented in mock');
  }
}
