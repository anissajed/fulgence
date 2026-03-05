export type Client = (request_args: unknown, ...rest: unknown[]) => Promise<unknown>;
export type Api = Record<string, Client>;
