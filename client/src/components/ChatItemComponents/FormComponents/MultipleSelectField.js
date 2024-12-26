import React from 'react';
import tw from 'tailwind-styled-components';
import { Typography } from '@material-tailwind/react';

const Container = tw.div`mobile:w-full w-[70%] pl-2 flex flex-col gap-1 transition-all  px-5`;
const Label = tw.span`font-bold flex flex-row items-center gap-1 w-[90%]`;
const SelectContainer = tw.div`flex flex-col gap-2 h-fit`;
const Description = tw.div`text-xs text-gray-400`;
const Warning = tw.span`text-red-400 font-bold text-xs text-right`;

const MultipleSelectField = ({ data, errors, register, requireMsg, mark, chatColor }) => {
  const validateSelects = (data) => {
    return true;
  };
  if (!data.answerVariable) return;
  return (
    <Container>
      <Typography variant='h6' color='blue-gray'>
        {data.label}
        {mark && <span className='text-red-400'> *</span>}
      </Typography>
      <SelectContainer>
        {data.answerOption &&
          data.answerOption.map((e, i) => {
            return (
              <label key={i} className='flex flex-row gap-2 items-center text-sm'>
                <input
                  type='checkbox'
                  id={`multiple_select_${i}_${e.value}`}
                  key={i}
                  value={e.value}
                  defaultChecked={
                    data.defaultValue &&
                    Array.isArray(data.defaultValue) &&
                    data.defaultValue.find((target) => target === e.value)
                  }
                  {...register(data.answerVariable, { required: data.isRequired, validate: validateSelects })}
                  style={{ '--active': chatColor, '--border-hover': chatColor }}
                />
                <span>{e.name}</span>
              </label>
            );
          })}
      </SelectContainer>
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
    </Container>
  );
};

export default MultipleSelectField;
