
export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
}
export interface EmailWorkerConfig {
  redis: RedisConfig;
  mail: {
    apiKey: string;
    from: string;
    auth?: {
      user: string;
      pass: string;
    };

  };
}