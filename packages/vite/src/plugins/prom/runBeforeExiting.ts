import { ExitSignals } from './types.js';

export const runBeforeExiting = (fun: (...args: any[]) => void) => {
  let wasCleanedUp = false;
  const exitSignals: ExitSignals[] = [
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'uncaughtException',
  ];

  for (const signal of exitSignals) {
    process.on(signal, async (...args) => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!wasCleanedUp) {
        await fun(...args);
        wasCleanedUp = true;
      }

      process.exit();
    });
  }
};
