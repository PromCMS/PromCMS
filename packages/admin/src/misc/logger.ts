let shouldPassIntoConsole = false;

if (typeof window !== 'undefined') {
  shouldPassIntoConsole =
    process.env.NODE_ENV !== 'production' ||
    new URLSearchParams(location.search ?? '').has('debug');
}

declare global {
  interface Window {
    application?: { logs: Record<string, any[]> };
  }
}

const createLogger = <T extends (...args: any) => any>(fnc: T) => {
  const name = fnc.name;

  return (...params: Parameters<T>) => {
    window.application ??= {
      logs: {},
    };

    window.application.logs[name] ??= [];
    window.application.logs[name].push(params);

    if (shouldPassIntoConsole) {
      fnc(...(params as any));
    }
  };
};

export const logger = {
  log: createLogger(console.log),
  error: createLogger(console.error),
  trace: createLogger(console.trace),
  warning: createLogger(console.warn),
};
