export interface EmailWorkerConfig {
  redis: {
    host: string;
    port: number;
  };
  mail: {
    apiKey: string;
    from: string;
    auth?: {
      user: string;
      pass: string;
    };

  };
}