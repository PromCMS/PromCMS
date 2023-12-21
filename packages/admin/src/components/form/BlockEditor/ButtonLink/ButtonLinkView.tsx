import { Button as CustomButton } from '@components/Button';
import ImageSelect from '@components/form/ImageSelect';
import { Checkbox, Group, Text, TextInput, Title } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';
import { FC, forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'tabler-icons-react';
import * as iconSet from 'tabler-icons-react';

import ContextProviders from '../../../../layouts/ContextProviders';
import { ButtonLinkToolData } from './ButtonLink';

const selectData = Object.entries(iconSet).map(([iconName, icon]) => ({
  icon,
  value: iconName,
  label: upperFirst(iconName),
}));

const SelectItem = forwardRef<HTMLDivElement, { icon: Icon; label: string }>(
  function SelectItem({ icon: Icon, label, ...rest }, ref) {
    return (
      <div ref={ref} {...rest}>
        <Group noWrap>
          <Icon />

          <div>
            <Text size="sm">{label}</Text>
          </div>
        </Group>
      </div>
    );
  }
);

export const ButtonLinkView: FC<{
  dataFromParent: ButtonLinkToolData;
  onDataChange: (data: ButtonLinkToolData) => void;
  readOnly: boolean;
}> = ({ dataFromParent, readOnly, onDataChange }) => {
  const [data, setData] = useState<ButtonLinkToolData>(dataFromParent);
  const { t } = useTranslation();

  useEffect(() => {
    setData(dataFromParent);
  }, [dataFromParent]);

  useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

  const onChange = (key: keyof ButtonLinkToolData, value: any) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  // TODO - more complex solution
  const isUrlValid = useMemo(
    () => true,
    // data.linkTo.length
    //   ? /^((https|http):\/\/).*/.test(data.linkTo)
    //     ? true
    //     : false
    //   : true,
    [data.linkTo]
  );

  const IconComponent = useMemo(
    () => (data.icon ? iconSet[data.icon] : undefined),
    [data.icon]
  );

  return (
    <ContextProviders>
      {!readOnly ? (
        <div className="rounded-lg border-2 border-project-border bg-white p-5 text-left">
          <Title order={3}>{t('Button link')}</Title>

          <Group className="mt-4" noWrap grow>
            <TextInput
              required
              label={t('Link')}
              placeholder="https://google.com"
              error={isUrlValid ? undefined : t('Invalid url')}
              type="string"
              value={data.linkTo}
              onChange={(e) => onChange('linkTo', e.currentTarget.value)}
              rightSection={
                isUrlValid ? (
                  <iconSet.Check size={16} color="green" />
                ) : (
                  <iconSet.Link size={16} />
                )
              }
            />
            <TextInput
              label={t('Label')}
              placeholder={t('Some text')}
              value={data.label}
              onChange={(e) => onChange('label', e.currentTarget.value)}
              rightSection={<iconSet.AB size={16} />}
            />
          </Group>

          <Group className="mt-4 items-start" noWrap grow>
            <div>
              <Checkbox
                label={t('Download on button click')}
                checked={data.isDownload}
                onChange={(e) =>
                  onChange('isDownload', e.currentTarget.checked)
                }
              />
              <Checkbox
                mt="md"
                label={t('Open on new tab')}
                checked={data.openOnNewTab}
                onChange={(e) =>
                  onChange('openOnNewTab', e.currentTarget.checked)
                }
              />
            </div>
            <ImageSelect
              label={t('Placeholder Image')}
              selected={data.placeholderImage || null}
              onChange={(value) => onChange('placeholderImage', value)}
            />
          </Group>
        </div>
      ) : (
        <CustomButton
          color="success"
          size="large"
          className="inline-flex gap-5 !rounded-none"
        >
          {IconComponent && <IconComponent />}
          {data.label || data.linkTo}
        </CustomButton>
      )}
    </ContextProviders>
  );
};
