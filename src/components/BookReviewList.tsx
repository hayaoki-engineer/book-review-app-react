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
  Button,
} from "@chakra-ui/react";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  // 非同期でログを送信する関数
  const sendLog = async (reviewId: string) => {
    const token = localStorage.getItem("authToken"); // ローカルストレージからトークンを取得
    if (!token) {
      console.error("認証トークンが存在しません。ログインが必要です。");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/logs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectBookId: reviewId, // 期待されるフィールド名に修正
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("ログ送信エラー:", errorData); // サーバーからのエラーメッセージを表示
        throw new Error("ログ送信に失敗しました");
      }

      console.log("ログ送信成功");
    } catch (error) {
      console.error("ログ送信に失敗しました", error);
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt={10} p={5}>
      <Heading as="h1" mb={6}>
        書籍レビュー一覧
      </Heading>
      <Button colorScheme="teal" mb={6} onClick={() => navigate("/new")}>
        新しい書籍レビューを投稿する
      </Button>
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
            <Button
              colorScheme="blue"
              mt={4}
              onClick={() => {
                console.log(`書籍ID: ${review.id} が選択されました。`);
                sendLog(review.id); // ログを非同期に送信
                navigate(`/detail/${review.id}`); // ページ遷移
              }}
            >
              詳細を見る
            </Button>
          </Flex>
        ))}
      </VStack>
      <Pagination /> {/* ページネーションコンポーネント */}
    </Box>
  );
};

export default BookReviewList;
