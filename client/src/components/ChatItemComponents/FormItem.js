import React, { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import arrowdown from '../../assets/arrowdown.png';
import checkmark from '../../assets/check-mark.webp';
import skipIcon from '../../assets/skip-icon.jpg';
import { useForm } from 'react-hook-form';
import { socket } from '../../socket';
import { v4 as uuidv4 } from 'uuid';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import InputField from './FormComponents/InputField';
import TextAreaField from './FormComponents/TextAreaField';
import MultipleChoiceField from './FormComponents/MultipleChoiceField';
import MultipleSelectField from './FormComponents/MultipleSelectField';
import SelectField from './FormComponents/SelectField';
import DatePickerField from './FormComponents/DatePickerField';
import { session } from '../../utils/session';
import { BOT_ID } from '../../constant';
import { formatFormMessage, formatForm } from '../../utils';

const Prompt = tw.div`flex flex-col gap-2 p-3 border w-[30%] mobile:w-[60%] rounded-sm transition-all`;
const PromptButton = tw.button`bg-primary disabled:bg-gray-300 text-white rounded-md p-1 active:scale-95 transition-all text-sm`;
const Form = tw.form`flex flex-col justify-between h-full gap-1 items-center relative pb-2 px-2 pt-10`;
const CloseFormButton = tw.img`absolute top-[15px] cursor-pointer w-[20px] active:scale-95 transition-all`;
const Title = tw.span`text-sm`;
const Descriptions = tw.span`text-xs text-gray-500`;
const SubmitButton = tw.button`mobile:w-full w-[60%] h-[40px] flex items-center justify-center rounded-xl cursor-pointer text-white bg-primary active:scale-95 transition-all`;

const chatColor = session.chatColor;

const FormItem = ({ openPop, result, data, formErrors, isFirstInGroup, isLastInGroup, isOther }) => {
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formSkipped, setFormSkipped] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
    watch,
    setFocus,
    trigger,
  } = useForm();

  const onSubmit = (form) => {
    if (!socket) return;
    socket.emit(
      'message',
      JSON.stringify({
        botId: session.botId || BOT_ID,
        type: 'form',
        user: session.Id,
        data: formatForm(data, form),
        message: formatFormMessage(data, form),
      })
    );
    setLoading(true);
  };

  const toggleDrawer = (e) => {
    if (!!result || !openPop || formSkipped) return;
    e.stopPropagation();
    setOpenForm((prev) => !prev);
  };

  useEffect(() => {
    let InputField =
      data.Questions && (data.Questions[0].type === 'short' || data.Questions[0].type === 'long') && data.Questions[0];
    if (InputField && openForm) {
      setTimeout(() => {
        setFocus(InputField.answerVariable);
      }, 300);
    }
  }, [data, setFocus, openForm]);

  useEffect(() => {
    setOpenForm(openPop && !formSkipped);
  }, [openPop, formSkipped]);

  useEffect(() => {
    if (!formErrors || !formErrors.length) return;
    formErrors.forEach((e) => {
      if (!e.answerVariable) return;
      setError(e.answerVariable, {
        type: 'validate-result',
        shouldFocus: true,
        message: e.validationErrorMessage,
      });
    });
    setLoading(false);
  }, [formErrors, setError]);
  return (
    <>
      <Prompt
        onClick={toggleDrawer}
        className={`
          ${isOther && `rounded-r-lg`}
          ${(isFirstInGroup && `rounded-t-lg`) || ``}
          ${(isLastInGroup && `rounded-b-lg ml-0`) || `ml-14`}`}>
        <Title>{data?.Title}</Title>
        <Descriptions>{data?.Description}</Descriptions>
        {(!!result && !formSkipped && (
          <div className='flex flex-col items-center justify-center'>
            <img src={checkmark} alt='' className='w-[24px] h-[24px]' />
            <span className='text-xs'>Form submitted</span>
          </div>
        )) ||
          (openPop && !formSkipped ? (
            <>
              <PromptButton
                style={{ backgroundColor: openPop && chatColor }}
                disabled={!openPop && formSkipped}
                onClick={toggleDrawer}>
                {data?.ButtonLabel || `Open form`}
              </PromptButton>
              {data && data.Skip === 'true' && (
                <button
                  className='border-primary text-primary border border-solid rounded-md p-1 active:scale-95 transition-all text-sm overflow-hidden'
                  style={{
                    textWrap: 'wrap',
                    lineBreak: 'anywhere',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormSkipped(true);
                    setLoading(false);
                    onSubmit({});
                  }}>
                  {loading ? (
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-full'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='black' strokeWidth='4'></circle>
                      <path
                        className='opacity-75'
                        fill='black'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                  ) : (
                    `${data?.SkipButtonLabel || `Skip `}`
                  )}
                </button>
              )}
            </>
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <img src={skipIcon} alt='' className='w-[24px] h-[24px]' />
              <span className='text-xs'>Form skipped</span>
            </div>
          ))}
      </Prompt>
      <Drawer open={openForm} size={'90vh'} onClose={toggleDrawer} className='rounded-t-xl z-[5px]' direction='bottom'>
        <Form onClick={(e) => e.stopPropagation()}>
          <CloseFormButton onClick={toggleDrawer} src={arrowdown} alt='' />
          <div className='overflow-auto flex flex-col items-center w-full h-[95%] gap-1'>
            <span className='text-xl font-bold '>{data?.Title}</span>
            <span className='text-sm text-gray-700'>{data?.Description}</span>
            <div className='w-[70%] min-h-[.5px] bg-gray-400 my-2 rounded'></div>
            {/* input fields */}
            <div className='h-fit flex flex-col gap-2 items-center pr-2 py-1 w-full'>
              {data?.Questions?.length > 0 &&
                data.Questions.map((e, i) => {
                  e.label = e?.label?.trim();
                  if (!e.label) e.label = 'No label';
                  if (!e.answerVariable) e.answerVariable = uuidv4();
                  return (
                    (e.type === 'short' && (e.inputType === 'datetime' || e.inputType === 'date') && (
                      <DatePickerField
                        key={i}
                        data={{
                          ...e,
                          timeFormat: e.timeFormat || '12',
                          dateFormat: e.dateFormat || 'dd/mm/yyyy',
                        }}
                        errors={errors}
                        register={register}
                        requireMsg={data.ErrorMessage}
                        mark={data?.MarkRequiredFields === 'true' && e.isRequired === true}
                        setValue={setValue}
                        currentValue={watch(e.answerVariable) || ''}
                      />
                    )) ||
                    (e.type === 'short' && (
                      <InputField
                        key={i}
                        data={e}
                        errors={errors}
                        register={register}
                        trigger={trigger}
                        requireMsg={data.ErrorMessage}
                        setValue={setValue}
                        mark={data?.MarkRequiredFields === 'true' && e.isRequired === true}
                      />
                    )) ||
                    (e.type === 'long' && (
                      <TextAreaField
                        key={i}
                        data={e}
                        errors={errors}
                        trigger={trigger}
                        register={register}
                        requireMsg={data.ErrorMessage}
                        mark={data?.MarkRequiredFields === 'true' && e.isRequired === true}
                      />
                    )) ||
                    (e.type === 'radio' && (
                      <MultipleChoiceField
                        key={i}
                        data={e}
                        errors={errors}
                        register={register}
                        requireMsg={data.ErrorMessage}
                        mark={data?.MarkRequiredFields === 'true' && e.isRequired === true}
                        chatColor={chatColor}
                      />
                    )) ||
                    (e.type === 'checkbox' && (
                      <MultipleSelectField
                        key={i}
                        data={e}
                        errors={errors}
                        register={register}
                        requireMsg={data.ErrorMessage}
                        mark={data?.MarkRequiredFields === 'true' && e.isRequired === true}
                        chatColor={chatColor}
                      />
                    )) ||
                    (e.type === 'select' && (
                      <SelectField
                        key={i}
                        data={e}
                        errors={errors}
                        setValue={setValue}
                        register={register}
                        requireMsg={data.ErrorMessage}
                        mark={data?.MarkRequiredFields === 'true' && e.isRequired === true}
                        chatColor={chatColor}
                      />
                    ))
                  );
                })}
            </div>
          </div>
          <SubmitButton style={{ backgroundColor: chatColor }} disabled={loading} onClick={handleSubmit(onSubmit)}>
            {loading ? (
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
              </svg>
            ) : (
              `Submit`
            )}
          </SubmitButton>
        </Form>
      </Drawer>
    </>
  );
};
export default FormItem;
