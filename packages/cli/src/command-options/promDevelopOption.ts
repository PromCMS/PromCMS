import { Option } from 'commander';

export const promDevelopOption = new Option(
  '-pd, --prom-develop',
  'If creating of admin should be skipped'
)
  .argParser((value) => {
    if (value) {
      console.log('Welcome prom developer!');
    }

    return value;
  })
  .default(false);

promDevelopOption.hidden = true;
