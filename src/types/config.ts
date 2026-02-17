
export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
}
export interface EmailWorkerConfig {
  redis?: RedisConfig;
  mail: {
    apiKey?: string;
    from?: string;
    service?: string;
    auth?: {
      user: string;
      pass: string;
    };

  };
}
export interface WorkerConfig {
  redis?: RedisConfig;
  timeout?: number; // for HTTP/webhook requests if needed
  concurrency?: number; // number of parallel jobs
  limiter?: {
    max: number;       // max jobs
    duration: number;  // per milliseconds
  };
}