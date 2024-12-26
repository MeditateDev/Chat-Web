import React from 'react';

// import { Card } from '@material-tailwind/react';
import tw from 'tailwind-styled-components';
import errorimage from '../../../assets/errorimage.png';
import { BOT_ID } from '../../../constant.js';
import { socket } from '../../../socket.js';
import { session } from '../../../utils/session.js';
import Button from '../../Button.js';
const CustomButton = tw.a`outline-none transition-all rounded-lg px-4 active:scale-95  cursor-pointer select-none hover:bg-opacity-90 text-center bg-gray-200 py-[0.5rem] text-xs font-semibold truncate text-blue-gray-700`;
const Title = tw.span`font-medium truncate`;
const Description = tw.span`font-normal opacity-75 text-xs line-clamp-3 mb-2`;
const Card = tw.div`flex flex-col w-full h-full rounded-xl border`;
const CardImageContainer = tw.div`overflow-hidden m-0 rounded-t-xl rounded-b-none`;

const sendValue = (value, title) => {
  socket.emit(
    'message',
    JSON.stringify({
      botId: session.getParamValue('botId') || BOT_ID,
      type: 'cardButtonClick',
      user: session.Id,
      text: title,
      data: { value: value, title: title },
    })
  );
};

const Cards = ({ data, ratio }) => {
  if (!data.image) return <></>;

  return (
    <Card>
      <CardImageContainer
        className={ratio === 'square' ? `w-full h-[340px] mobile:h-[240px]` : `w-full h-[240px] mobile:h-[140px]`}>
        <img
          src={data.image}
          alt='card'
          className='w-full h-full object-cover object-center'
          loading='lazy'
          onError={(event) => {
            event.target.src = errorimage;
            event.onerror = null;
          }}
        />
      </CardImageContainer>
      <div className='flex flex-col gap-2 p-2 grow'>
        <Title>{data.title || 'No title'}</Title>
        <Description>{data.description || ''}</Description>
        <div className='flex flex-col gap-2 justify-end grow'>
          {data.buttons &&
            data.buttons.length > 0 &&
            data.buttons
              .filter((e) => e.value && e.text)
              .slice(0, 3)
              .map((e, i) => {
                if (!e.value || !e.text) return <div key={i}></div>;
                if (e.type === 'make-call')
                  return (
                    <CustomButton key={i} href={`tel:${e.value}`}>
                      {e.text || ''}
                    </CustomButton>
                  );
                if (e.type === 'open-web')
                  return (
                    <CustomButton target='_blank' rel='noopener noreferrer' key={i} href={e.value}>
                      {e.text || ''}
                    </CustomButton>
                  );
                return (
                  <Button
                    onClick={() => sendValue(e.value, e.text)}
                    key={i}
                    className='bg-gray-200 font-semibold py-[0.5rem] text-xs truncate text-blue-gray-700'>
                    {e.text || ''}
                  </Button>
                );
              })}
        </div>
      </div>

      {/* <CardFooter className='pt-0 flex flex-col gap-3'></CardFooter> */}
    </Card>
  );
};

export default Cards;
