export interface SomeType {
  port?: number | string;
  onReady?: Function;
  onRequest?: Function;
  beforeResponseSent?: Function;
}
