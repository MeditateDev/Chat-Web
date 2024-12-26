import React, { useEffect, useRef } from 'react';

import errorimage from '../../assets/errorimage.png';

// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

//styles
import tw from 'tailwind-styled-components';
import CardButtonsContainer from './CardComponents/CardButtonsContainer';
const DetailsContainer = tw.div`w-full flex flex-col pb-3 px-3 items-center h-fit gap-3`;
const CardTitle = tw.div`text-lg font-semibold`;
const CardDescription = tw.p`text-gray-500 self-start text-xs text-justify`;
const ImageContainer = tw.div`h-[170px] overflow-hidden relative border-b p-2`;

const CardItem = ({ data, isOther }) => {
  const containerRef = useRef(null);

  // useEffect(() => {
  //   const container = containerRef.current;

  //   const handleTouchStart = (event) => {
  //     // Store the initial touch position
  //     const touch = event.touches[0] || event.changedTouches[0];
  //     container.dataset.touchStartX = touch.clientX;
  //     container.dataset.touchStartY = touch.clientY;
  //   };

  //   const handleTouchMove = (event) => {
  //     // Get the current touch position
  //     const touch = event.touches[0] || event.changedTouches[0];
  //     const touchX = touch.clientX;
  //     const touchY = touch.clientY;

  //     // Calculate the distance between the initial and current touch positions
  //     const deltaX = touchX - parseInt(container.dataset.touchStartX, 10);
  //     const deltaY = touchY - parseInt(container.dataset.touchStartY, 10);

  //     // Check if the horizontal swipe distance is greater than the vertical swipe distance
  //     if (Math.abs(deltaX) > Math.abs(deltaY)) {
  //       // Prevent vertical scrolling when swiping horizontally
  //       event.preventDefault();
  //     }
  //   };

  //   container.addEventListener('touchstart', handleTouchStart, { passive: true });
  //   container.addEventListener('touchmove', handleTouchMove, { passive: false });

  //   return () => {
  //     container.removeEventListener('touchstart', handleTouchStart);
  //     container.removeEventListener('touchmove', handleTouchMove);
  //   };
  // }, []);
  return (
    data &&
    data.length > 0 && (
      <div
        ref={containerRef}
        className={`flex ${isOther ? `` : `self-end flex-row-reverse`}  mobile:w-full tablet:w-[40%] h-fit w-[25%]`}>
        <Swiper
          modules={[Navigation, A11y, Pagination]}
          allowTouchMove='false'
          loop='true'
          className='relative overscroll-contain'>
          {data.map((card, i) => {
            return (
              <SwiperSlide key={i} className={`border flex flex-col rounded-lg overflow-hidden`}>
                {/* Image */}
                <ImageContainer>
                  <img
                    src={card.imageUrl}
                    alt=''
                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full'
                    onError={(event) => {
                      event.target.src = errorimage;
                      event.onerror = null;
                    }}
                  />
                </ImageContainer>
                <DetailsContainer>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                  {/* Buttons */}
                  <CardButtonsContainer card={card} />
                </DetailsContainer>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    )
  );
};

export default CardItem;
