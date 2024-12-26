import axios from 'axios';
import React, { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import { CONNECTOR_URL, CONNECTOR_VIRTUAL_PATH } from '../constant';
import { extractUrl } from '../utils';

const Contents = tw.div`flex flex-col justify-between w-[75%] py-1 px-2 cursor-pointer`;

const specialCharacterParser = (str) => {
  let value = str;
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  value = txt.value;
  txt.remove();
  return value;
};

const SitePreview = ({ message, className = '' }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    if (!extractUrl(message)) return setPreviewData(null);

    const fetchData = async () => {
      try {
        const response = await axios(CONNECTOR_URL + CONNECTOR_VIRTUAL_PATH + '/metadata', {
          method: 'post',
          data: { url: extractUrl(message) },
        });
        const { title, image, description } = response.data;
        if (!title) {
          setLoading(false);
          return setPreviewData(null);
        }
        setPreviewData({
          title: specialCharacterParser(title),
          description: specialCharacterParser(description),
          image,
        });
      } catch (e) {}
      setLoading(false);
    };

    const timmerId = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => {
      clearTimeout(timmerId);
    };
  }, [message]);

  if (!extractUrl(message) || (!loading && !previewData)) return <></>;

  return loading ? (
    <div className={`mx-3 mt-2 ${className}`}>
      <div className='bg-white shadow rounded-md p-4 w-full mx-auto mt-2'>
        <div className='animate-pulse flex space-x-4'>
          <div className='rounded-md bg-gray-200 h-16 w-16'></div>
          <div className='flex-1 space-y-6 py-1'>
            <div className='h-2 bg-gray-300 rounded'></div>
            <div className='space-y-3'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='h-2 bg-gray-300 rounded col-span-2'></div>
                <div className='h-2 bg-gray-300 rounded col-span-1'></div>
              </div>
              <div className='h-2 bg-gray-300 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      onClick={() => window.open(extractUrl(message), '_blank')}
      title={previewData.title}
      className={`flex flex-row bg-white rounded-[4px] mx-5 mt-2 shadow overflow-hidden ${className}`}>
      <div className='max-w-[100px] h-auto'>
        <img src={previewData.image} alt='' className='w-full h-full object-cover object-center' />
      </div>
      <Contents>
        <div className='w-full'>
          <span className='text-sm font-semibold line-clamp-1 text-gray-800'>{previewData.title}</span>
          <span className='text-xs line-clamp-3 text-justify text-gray-600'>{previewData.description}</span>
        </div>
        <span className='text-xs text-gray-500 line-clamp-1'>{new URL(extractUrl(message)).hostname}</span>
      </Contents>
    </div>
  );
};

export default SitePreview;
