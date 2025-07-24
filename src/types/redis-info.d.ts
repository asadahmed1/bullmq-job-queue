declare module 'redis-info' {
  // There is no exported member RedisInfo in redis-info, but @bull-board/api expects one
  // So we fake it here to silence the error
  export interface RedisInfo {
    [key: string]: string | number;
  }

  export function parse(info: string): RedisInfo;
}