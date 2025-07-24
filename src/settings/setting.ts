export const timeOutSettings={
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s, then 10s, then 20s...
    },
    removeOnComplete: true,
    removeOnFail: false,
  }