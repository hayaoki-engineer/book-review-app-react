import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup';
import BookReviewList from './BookReviewList';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {

  return (
    <Provider store={store}>
      <ChakraProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<BookReviewList />} />
        </Routes>
      </ChakraProvider>
    </Provider>
  );
}

export default App
