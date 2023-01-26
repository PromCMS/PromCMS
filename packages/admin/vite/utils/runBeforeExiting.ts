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
    process.on(signal, async () => {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!wasCleanedUp) {
        await fun();
        wasCleanedUp = true;
      }

      process.exit();
    });
  }
};
