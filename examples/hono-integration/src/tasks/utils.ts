export type Task = (input: unknown) => unknown;

export interface RouteInput {
  example: boolean;
};

export type FulgenceTaskImpl<T extends (input: any) => any, Api> = 
  T extends (input: infer I) => infer O
    ? (input: I, api: Api) => O
    : never;
