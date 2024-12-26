import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Loading from '../components/Loading';
import NotFoundPage from './NotFoundPage';
import ExpiredPage from './ExpiredPage';

import { WEB_CHAT_VIRTUAL_PATH } from '../constant';
import ChatWidget from './ChatWidget';
import { session } from '../utils/session';

const ShortLinkPage = () => {
  const { shortLink } = useParams();

  const [isNotFound, setNotFound] = useState(false);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLink = async (id) => {
      try {
        const { data } = await axios({
          url: WEB_CHAT_VIRTUAL_PATH + `/short-url/${id}`,
          method: 'GET',
          headers: { Authorization: 'Zm1QWXpGZGZDWHA6IyVpRGxrdU05UUBZ' },
        });
        if (!data || !data.data) {
          setNotFound(true);
          return;
        }

        if (new Date(data.expiredDate) < new Date()) {
          setExpired(true);
          return;
        }

        session.setDefaultVariables(data.data);
      } catch (e) {
        setNotFound(true);
      }
      setLoading(false);
    };

    if (shortLink) {
      getLink(shortLink);
    } else {
      setNotFound(true);
    }
  }, [shortLink]);

  if (isNotFound)
    return (
      <div className='h-[calc(100dvh)] flex items-center justify-center'>
        <NotFoundPage />;
      </div>
    );

  if (expired)
    return (
      <div className='h-[calc(100dvh)] flex items-center justify-center'>
        <ExpiredPage />;
      </div>
    );

  if (loading)
    return (
      <div className='h-[calc(100dvh)] flex items-center justify-center'>
        <Loading />;
      </div>
    );

  return <ChatWidget />;
};

export default ShortLinkPage;
