import { ProColumns } from '@ant-design/pro-components';
import { SwitchProps } from 'antd';

export const COLUMN_VALUE_TYPE_MAP: { [key: string]: ProColumns } = {
  default: { width: 100 },
  textarea: { width: 100 },
  password: { width: 100 },
  money: { width: 100 },
  date: { width: 100 },
  dateWeek: { width: 100 },
  dateMonth: { width: 100 },
  dateQuarter: { width: 100 },
  dateYear: { width: 100 },
  dateRange: { width: 100 },
  dateTime: { width: 120 },

  dateTimeRange: {
    width: 100,
    formItemProps: {
      getValueProps: (value) => ({
        value: [value?.startAt, value?.endAt],
      }),
      getValueFromEvent: (value) =>
        value && {
          startAt: value[0],
          endAt: value[1],
        },
    },
  },
  time: { width: 100 },
  timeRange: { width: 100 },
  index: { width: 100 },
  indexBorder: { width: 100 },
  progress: { width: 100 },
  percent: { width: 100 },
  digit: { width: 100 },
  second: { width: 100 },
  fromNow: { width: 100 },
  avatar: { width: 100 },
  code: { width: 100 },
  image: { width: 100 },
  jsonCode: { width: 100 },
  color: { width: 100 },
  option: {},
  id: {
    valueType: 'digit',
    width: 100,
  },
  boolean: {
    width: 100,
    valueType: 'switch',
    fieldProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
    } as SwitchProps,
  },
};
