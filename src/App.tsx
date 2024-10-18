import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Signup from './Signup';
import BookReviewList from './BookReviewList';
import { ChakraProvider } from '@chakra-ui/react';

function App() {

  return (
    <ChakraProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<BookReviewList />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App
