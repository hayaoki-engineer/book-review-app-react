import { Button, HStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { nextPage, prevPage } from "../src/redux/store";
import { RootState } from "../src/redux/store";

const Pagination = () => {
  const { currentPage } = useSelector((state: RootState) => state.pagination);
  const dispatch = useDispatch();

  return (
    <HStack mt={6} justify="center">
      <Button
        onClick={() => dispatch(prevPage())}
        isDisabled={currentPage === 1}
      >
        前へ
      </Button>
      <Button onClick={() => dispatch(nextPage())}>次へ</Button>
    </HStack>
  );
};

export default Pagination;
