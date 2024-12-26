import {
  Button,
  Input,
  Option,
  Popover,
  PopoverContent,
  PopoverHandler,
  Select,
  Typography,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';

import tw from 'tailwind-styled-components';

const Field = tw.div`mobile:w-full w-[70%] rounded-lg px-5 flex flex-col transition-all gap-1`;

// Handle app time format
const getTime = (date, hour, minute, indicator, inputType, dateFormat, timeFormat) => {
  if (!date) return '';
  let result = dateFormat
    .replace('yyyy', new Date(date).getFullYear())
    .replace('mm', String(new Date(date).getMonth() + 1).padStart(2, '0'))
    .replace('dd', String(new Date(date).getDate()).padStart(2, '0'));
  if (inputType === 'date' || !date || !hour || !minute) return result;

  if (timeFormat === '12' && hour > 12) {
    indicator = hour < 12 ? 'AM' : 'PM';
    hour = hour % 12 || 12;
  }

  result += ` ${+hour < 10 ? `0${+hour}` : hour}`;
  result += `:${+minute < 10 ? `0${+minute}` : minute}`;
  if (timeFormat === '12') result += ' ' + indicator;
  return result;
};

// Hanlde time format such as response from bot
// Eg: Sun, 18 Aug 2024 16:00:00 GMT.
const formatTime = (timeStr, dateFormat, timeFormat, inputType) => {
  let date = new Date(timeStr);
  if (isNaN(date.getTime())) return '';
  let result = dateFormat
    .replace('yyyy', date.getFullYear())
    .replace('mm', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('dd', String(date.getDate()).padStart(2, '0'));

  if (inputType === 'date') return result;

  result += ` ${String(timeFormat === '12' ? date.getHours() % 12 || 12 : date.getHours()).padStart(2, '0')}`;
  result += `:${String(date.getMinutes()).padStart(2, '0')}`;
  if (timeFormat === '12') result += ' ' + (date.getHours() < 12 && date.getMinutes() <= 0 ? 'AM' : 'PM');
  return result;
};

const getTimeValues = (timeStr, timeFormat) => {
  if (typeof timeStr !== 'string' || !timeStr) return { hour: '12', minute: '00', indicator: 'AM', date: new Date() };
  let [date, time, indicator] = timeStr.split(' ');
  if (isNaN(new Date(date).getTime())) {
    let dateArr = date.split('/');
    [dateArr[0], dateArr[1]] = [dateArr[1], dateArr[0]];
    date = dateArr.join('/');
  }

  if (!time)
    return {
      hour: '12',
      minute: '00',
      indicator: 'AM',
      date: new Date(date),
    };
  let [hour, minute] = time.split(':');
  if (+hour >= 12 && +minute > 0) {
    indicator = 'PM';
  }
  hour = `${String(timeFormat === '12' ? hour % 12 || 12 : hour).padStart(2, '0')}`;
  return {
    hour: hour || '12',
    minute: minute || '00',
    indicator: indicator || 'AM',
    date: new Date(date),
  };
};

const DatePickerField = ({ data, errors, register, requireMsg, mark, setValue, currentValue }) => {
  const { inputType, timeFormat, dateFormat } = data;
  const crV = getTimeValues(currentValue || data.defaultValue, timeFormat);
  const [date, setDate] = useState(crV.date);
  const [hour, setHour] = useState(crV.hour);
  const [minute, setMinute] = useState(crV.minute);
  const [indicator, setIndicator] = useState(crV.indicator);
  const [open, setOpen] = useState();
  useEffect(() => {
    setValue(data.answerVariable, getTime(date, hour, minute, indicator, inputType, dateFormat, timeFormat));
  }, [currentValue]);
  const handleDate = (value) => {
    setDate((prev) => value);
    if (value && data.inputType !== 'datetime') {
      setOpen(false);
      setValue(data.answerVariable, getTime(value, hour, minute, indicator, inputType, dateFormat, timeFormat));
    }
  };

  const handleHour = (value) => {
    setHour((prev) => value);
  };

  const handleMinute = (value) => {
    setMinute((prev) => value);
  };

  const handleIndicator = (value) => {
    setIndicator((prev) => value);
  };
  const dismiss = {
    outsidePress: () => {
      if (inputType === 'datetime') {
        const resetValue = getTimeValues(currentValue);
        setDate(resetValue.date);
        setHour(resetValue.hour);
        setMinute(resetValue.minute);
        setIndicator(resetValue.indicator);
      }
      setOpen(!!!open);
    },
  };

  const errorMessages = [
    errors[data.answerVariable]?.type === 'validate-result' &&
      (errors[data.answerVariable]?.message || `Please enter a valid value`),
    errors[data.answerVariable]?.type === 'required' && requireMsg,
    errors[data.answerVariable]?.type === 'validate' &&
      (errors[data.answerVariable]?.message || `Please enter a valid value`),
  ].filter((e) => !!e);

  return (
    <>
      <Field onClick={() => setOpen(!!!open)}>
        <Typography variant='h6' color='blue-gray'>
          {data.label}
          {mark && <span className='text-red-400'> *</span>}
        </Typography>
        <Input
          {...register(data.answerVariable, {
            required: data.isRequired,
          })}
          defaultValue={currentValue ? currentValue : formatTime(data.defaultValue, dateFormat, timeFormat, inputType)}
          className={`bg-transparent outline-none text-sm ${
            errors[data.answerVariable]
              ? 'focus:!border-t-red-500 !border-t-red-500'
              : '!border-t-blue-gray-200 focus:!border-t-gray-900'
          }`}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          placeholder={data.placeholder}
          error={!!errors[data.answerVariable]}
          readOnly
        />
        {errors[data.answerVariable] &&
          errorMessages &&
          errorMessages.map((e) => (
            <Typography variant='small' color='red' className='mt-2 flex items-center gap-1 font-normal'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='-mt-px h-4 w-4'>
                <path
                  fillRule='evenodd'
                  d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z'
                  clipRule='evenodd'
                />
              </svg>
              {e}
            </Typography>
          ))}
      </Field>
      <Popover placement='bottom' open={open} dismiss={dismiss} handler={setOpen}>
        <PopoverHandler>
          {/* div at middle */}
          <div className='fixed top-[80%] left-1/2'></div>
        </PopoverHandler>
        <PopoverContent className='z-[999] flex flex-col gap-2'>
          <DayPicker
            mode='single'
            selected={date}
            onSelect={handleDate}
            showOutsideDays
            captionLayout='dropdown'
            fromDate={new Date(1900, 1)}
            toDate={new Date(2099, 1)}
            defaultMonth={new Date(date)}
            className='border-0'
            classNames={{
              caption_label: 'hidden',
              dropdown: 'border-solid border-2 rounded-md py-2 px-1 mr-2',
              caption_dropdowns: 'flex justify-center py-2 mb-4 relative items-center text-sm font-medium text-gray-900',
              table: 'w-full border-collapse',
              head_row: 'flex font-medium text-gray-900',
              head_cell: 'm-0.5 w-9 font-normal text-sm',
              row: 'flex w-full mt-2',
              cell: 'text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
              day: 'h-9 w-9 p-0 font-normal',
              day_range_end: 'day-range-end',
              day_selected:
                'rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white',
              day_today: 'rounded-md bg-gray-200 text-gray-900',
              day_outside:
                'day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10',
              day_disabled: 'text-gray-500 opacity-50',
              day_hidden: 'invisible',
            }}
          />
          {inputType === 'datetime' && (
            <div className='flex flex-col gap-2'>
              <div className='w-full flex flex-row gap-2 justify-center items-center'>
                <div className='w-24'>
                  <Select
                    variant='static'
                    containerProps={{
                      className: 'zero_min_width',
                    }}
                    onChange={(e) => {
                      handleHour(e);
                    }}
                    value={hour}
                    className='pl-3'>
                    {Array.from(
                      +timeFormat === 24
                        ? Array(+timeFormat).keys()
                        : Array(+timeFormat)
                            .keys()
                            .map((time) => time + 1)
                    ).map((e) => {
                      let timeVal = e.toString().padStart(2, '0');
                      return (
                        <Option key={timeVal} value={timeVal}>
                          {timeVal}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <span className='mt-3'>:</span>
                <div className='w-24 flex justify-center items-center'>
                  <Select
                    variant='static'
                    containerProps={{
                      className: 'zero_min_width',
                    }}
                    onChange={(e) => {
                      handleMinute(e);
                    }}
                    value={minute}
                    className='pl-3'>
                    {[`00`, `05`, `10`, `15`, `20`, `25`, `30`, `35`, `40`, `45`, `50`, `55`].map((e) => {
                      return (
                        <Option key={e} value={e}>
                          {e}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                {timeFormat !== '24' && (
                  <div className='w-20'>
                    <Select
                      variant='static'
                      containerProps={{
                        className: 'zero_min_width',
                      }}
                      onChange={(e) => {
                        handleIndicator(e);
                      }}
                      value={indicator}
                      className='pl-3'>
                      <Option value='AM'>AM</Option>
                      <Option value='PM'>PM</Option>
                    </Select>
                  </div>
                )}
              </div>
              <div className='self-end'>
                <Button
                  size='sm'
                  onClick={() => {
                    setOpen(false);
                    setValue(data.answerVariable, getTime(date, hour, minute, indicator, inputType, dateFormat, timeFormat));
                  }}>
                  Ok
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default DatePickerField;
