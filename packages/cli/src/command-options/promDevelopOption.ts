import { Option } from 'commander';

export const promDevelopOption = new Option(
  '--prom-develop',
  '!NOTICE - do not use outside of PromCMS root monorepo. '
)
  .argParser((value) => {
    if (value) {
      console.log('Welcome prom developer!');
    }

    return value;
  })
  .default(false);

promDevelopOption.hidden = true;
