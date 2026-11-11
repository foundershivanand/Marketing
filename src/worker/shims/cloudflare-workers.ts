export class WorkflowEntrypoint<Env = any, Params = any> {
  ctx: any;
  env: Env;
  constructor(ctx: any, env: Env) {
    this.ctx = ctx;
    this.env = env;
  }
  async run(event: any, step: any): Promise<any> {
    throw new Error('Workflow run not implemented in local dev mode');
  }
}

export interface WorkflowEvent<T = any> {
  payload: T;
  timestamp: Date;
  instanceId: string;
}

export interface WorkflowStep {
  do<T>(name: string, callback: () => Promise<T>): Promise<T>;
  do<T>(name: string, config: any, callback: () => Promise<T>): Promise<T>;
  sleep(name: string, duration: number | string): Promise<void>;
  sleepUntil(name: string, timestamp: Date | number): Promise<void>;
}
