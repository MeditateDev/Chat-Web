import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Loading from './components/Loading';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <Suspense
    fallback={
      <div className='h-[calc(100dvh)] flex items-center justify-center'>
        <Loading />;
      </div>
    }>
    <App />
  </Suspense>
);
