import { Textarea, Typography } from '@material-tailwind/react';
import React from 'react';
import tw from 'tailwind-styled-components';

const Field = tw.div`mobile:w-full w-[70%] rounded-lg px-5 flex flex-col transition-all gap-2`;

// const validateRegex = {
//   phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
//   email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/im,
// };

const TextAreaField = ({ data, errors, register, requireMsg, mark, trigger }) => {
  if (!data.answerVariable) return;

  const errorMessages = [
    errors[data.answerVariable]?.type === 'validate-result' &&
      (errors[data.answerVariable]?.message || `Please enter a valid value`),
    errors[data.answerVariable]?.type === 'required' && requireMsg,
    errors[data.answerVariable]?.type === 'pattern' && data.validationErrorMessage,
    (errors[data.answerVariable]?.type === 'minLength' || errors[data.answerVariable]?.type === 'maxLength') && (
      <span>
        Please input {data.minLength != 0 && ` min ${data.minLength} character${data.minLength > 1 && `s`} `}
        {data.minLength != 0 && data.maxLength != 0 && 'and'}
        {data.maxLength && ` max ${data.maxLength} characters`}
      </span>
    ),
  ].filter((e) => !!e);

  return (
    <Field>
      <Typography variant='h6' color='blue-gray'>
        {data.label}
        {mark && <span className='text-red-400'> *</span>}
      </Typography>
      <Textarea
        {...register(data.answerVariable, {
          required: data.isRequired,
          minLength: data.minLength,
          maxLength: data.maxLength,
        })}
        defaultValue={data.defaultValue ? data.defaultValue : ''}
        className={`bg-transparent outline-none text-sm resize-none h-20 ${
          errors[data.answerVariable]
            ? 'focus:!border-t-red-500 !border-t-red-500'
            : '!border-t-blue-gray-200 focus:!border-t-gray-900'
        }`}
        placeholder={data.placeholder}
        error={!!errors[data.answerVariable]}
        type={data.type}
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
        onBlur={() => trigger(data.inputType)}
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
  );
};

export default TextAreaField;
