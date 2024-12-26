import { Typography, Select, Option } from '@material-tailwind/react';
import React, { useEffect } from 'react';

const SelectField = ({ data, errors, register, requireMsg, mark, setValue }) => {
  useEffect(() => {
    setValue(`${data.answerVariable}`, data.defaultValue);
  }, []);
  if (!data.answerVariable) return;
  return (
    <div className='mobile:w-full w-[70%] flex flex-col gap-1 transition-all px-5'>
      <Typography variant='h6' color='blue-gray'>
        {data.label}
        {mark && <span className='text-red-400'> *</span>}
      </Typography>
      <Select
        className={` text-sm w-full 
              ${
                errors[data.answerVariable]
                  ? 'focus:!border-red-500 !border-red-500'
                  : '!border-blue-gray-200 focus:!border-gray-900'
              }
            `}
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
        {...register(data.answerVariable, {
          required: data.isRequired,
        })}
        value={`${data.defaultValue}` ? `${data.defaultValue}` : undefined}
        onChange={(val) => {
          setValue(data.answerVariable, val);
        }}>
        {data?.answerOption?.length &&
          data.answerOption.map((e, i) => {
            if (!e.value || !e.name) return <></>;
            return (
              <Option key={i} value={e.value}>
                {e.name}
              </Option>
            );
          })}
      </Select>
      {errors[data.answerVariable]?.type === 'required' && (
        <Typography variant='small' color='red' className='flex items-center gap-1 font-normal'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='-mt-px h-4 w-4'>
            <path
              fillRule='evenodd'
              d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z'
              clipRule='evenodd'
            />
          </svg>
          {requireMsg || `*This field is required`}
        </Typography>
      )}
    </div>
  );
};

export default SelectField;
