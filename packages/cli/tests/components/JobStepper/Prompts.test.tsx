import React from 'react';

import { Input } from '@boost/cli/react';
import { describe, expect, it } from 'vitest';
import { render } from 'ink-testing-library';

import {
  Prompts,
  PromptsProps,
} from '../../../src/components/JobStepper/Prompts';

describe('ink components', () => {
  describe('JobStepper', () => {
    describe('Prompts', () => {
      it('should render each prompt correctly', () => {
        const prompts: PromptsProps['prompts'] = [
          [
            'someKey',
            {
              type: Input,
              props: {
                label: 'Input something',
              },
            },
          ],
          [
            'someOtherKey',
            {
              type: Input,
              props: {
                label: 'Input something different',
              },
            },
          ],
        ];

        const onSubmit = (res) => {
          console.log({ res });
        };

        const { lastFrame, rerender, stdin, stdout } = render(
          <Prompts prompts={prompts} onSuccess={onSubmit} />
        );

        // TODO make this work
        expect(lastFrame()).to.match(/.*Input something.*/g);
      });
    });
  });
});
