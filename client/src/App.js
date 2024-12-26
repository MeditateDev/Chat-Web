import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatWidget from './pages/ChatWidget';
import NotFoundPage from './pages/NotFoundPage';
import { WEB_CHAT_VIRTUAL_PATH } from './constant';
import ShortLinkPage from './pages/ShortLinkPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={WEB_CHAT_VIRTUAL_PATH + '/'} element={<ChatWidget />} />
        <Route path={WEB_CHAT_VIRTUAL_PATH + '/:shortLink'} element={<ShortLinkPage />} />
        <Route path='*' element={<NotFoundPage></NotFoundPage>} />
        {/* Define more routes for different components/pages */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
