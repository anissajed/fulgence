export type Requester = (request_args: unknown, ...rest: unknown[]) => Promise<unknown>;
export type Api = Record<string, Requester>;
