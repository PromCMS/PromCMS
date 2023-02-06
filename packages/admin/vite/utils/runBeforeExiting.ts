export type ExitSignals = Parameters<NodeJS.Process['on']>[0];

export const runBeforeExiting = (fun: Function) => {
  let wasCleanedUp = false;
  const exitSignals: ExitSignals[] = [
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'uncaughtException',
  ];

  for (const signal of exitSignals) {
    process.on(signal, async (...rest) => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!wasCleanedUp) {
        await fun(...rest);
        wasCleanedUp = true;
      }

      process.exit();
    });
  }
};
