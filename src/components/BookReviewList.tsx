import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Spinner,
  Link,
} from "@chakra-ui/react";
import Pagination from "./Pagination";

// 書籍レビューの型定義
type BookReview = {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
};

const BookReviewList = () => {
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { offset } = useSelector((state: RootState) => state.pagination);

  useEffect(() => {
    const currentPage = offset / 10 + 1;
    console.log(`現在のページ: ${currentPage}`);

    // APIからデータを取得する関数
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/public/books?offset=${offset}`
        );
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data: BookReview[] = await response.json();
        setReviews(data);
      } catch {
        setError("書籍レビューの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [offset]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={5}>
      <Heading as="h1" mb={6}>
        書籍レビュー一覧
      </Heading>
      <VStack spacing={4} align="stretch">
        {reviews.map((review) => (
          <Flex
            key={review.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            alignItems="start"
            direction="column"
          >
            <Heading fontSize="xl">{review.title}</Heading>
            <Link href={review.url} color="blue.500" isExternal>
              詳細ページはこちら
            </Link>
            <Text mt={2} fontSize="sm" color="gray.600">
              レビュアー: {review.reviewer}
            </Text>
            <Text mt={2}>{review.detail}</Text>
            <Text mt={4}>{review.review}</Text>
          </Flex>
        ))}
      </VStack>
      <Pagination /> {/* ページネーションコンポーネント */}
    </Box>
  );
};

export default BookReviewList;
