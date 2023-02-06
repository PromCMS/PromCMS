import child_process from 'child_process';

export type RunPHPScriptOptions = {
  path: string;
  arguments?: object;
};

const formatArguments = (args: object) =>
  Object.entries(args)
    .map(([key, value]) => {
      let formattedValue = value;

      switch (typeof value) {
        case 'string':
          formattedValue = `"${value}"`;
          break;
        case 'object':
          if (Array.isArray(value)) {
            formattedValue = value.join(',');
          } else {
            formattedValue = JSON.stringify(value);
          }
          break;
      }

      return `--${key}=${formattedValue}`;
    })
    .join(' ');

export const runPHPScript = ({
  path: scriptPath,
  arguments: args = {},
}: RunPHPScriptOptions) => {
  let messages = '';

  return new Promise((resolve, reject) => {
    const child = child_process.exec(
      `php ${scriptPath} ${formatArguments(args)}`
    );

    child.stdout?.on('data', (data) => {
      messages += data;
      console.log(data);
    });

    child.on('exit', function (code) {
      if (code === 0) {
        resolve(true);
      } else {
        reject(messages);
      }
    });
  });
};
