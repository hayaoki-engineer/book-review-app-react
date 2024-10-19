import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BookReviewList from "./components/BookReviewList";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Header from "./components/Header";
import Profile from "./components/Profile";

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Header />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book-reviews" element={<BookReviewList />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
