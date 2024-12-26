import { Button, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';

const getTime = (date) => {
  if (!date) return '';
  let result = format(date, 'MM-dd-yyyy');
  return result;
};

const DatePickerItem = ({ actions, chatColor, getDateValue }) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(true);

  const handleDate = (value) => {
    setDate((prev) => value);
    if (value && actions.name !== 'date-time') {
      setOpen(false);
    }
  };

  const dismiss = {
    outsidePress: () => {
      setOpen(!!!open);
      getDateValue();
    },
  };

  return (
    <>
      <Popover placement='bottom' open={open} dismiss={dismiss} handler={setOpen}>
        <PopoverHandler>
          {/* div at middle */}
          <div className='fixed top-[85%] left-1/2'></div>
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
          {actions.name === 'date-time' && (
            <div className='self-center'>
              <Button
                size='sm'
                onClick={() => {
                  setOpen(false);
                  const dataTime = getTime(date);
                  getDateValue(dataTime);
                }}
                // style={{backgroundColor: chatColor}}
              >
                Ok
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default DatePickerItem;
