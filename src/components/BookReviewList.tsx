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
import { jwtDecode } from "jwt-decode"; // 名前付きインポートに変更
import { apiUrl } from "../config";

// 書籍レビューの型定義
type BookReview = {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
  isMine: boolean;
};

const BookReviewList = () => {
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null); // ログイン中のユーザーIDを保持
  const navigate = useNavigate();

  const { offset } = useSelector((state: RootState) => state.pagination);

  useEffect(() => {
    // JWT トークンからログイン中のユーザーIDを取得
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode<{ user_id: string }>(token);
      setLoggedInUserId(decodedToken.user_id);
      console.log("LoggedIn UserId:", decodedToken.user_id);
    }

    const currentPage = offset / 10 + 1;
    console.log(`現在のページ: ${currentPage}`);

    // APIからデータを取得する関数
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken"); // トークンを取得
        const response = await fetch(`${apiUrl}/books?offset=${offset}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Authorizationヘッダーを追加
          },
        });
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
              書籍のURL
            </Link>
            <Text mt={2} fontSize="sm" color="gray.600">
              レビュアー: {review.reviewer}
            </Text>
            <Text mt={2}>{review.detail}</Text>
            <Text mt={4}>{review.review}</Text>

            {/* ログイン中のユーザーが作成したレビューの場合にのみ編集ボタンを表示 */}
            {review.isMine && (
              <Button
                colorScheme="blue"
                onClick={() => navigate(`/edit/${review.id}`)}
              >
                編集
              </Button>
            )}
            {/* 詳細ページへのリンクを追加 */}
            <Button
              colorScheme="teal"
              variant="link"
              onClick={() => navigate(`/detail/${review.id}`)} // 各レビューの詳細ページに遷移
            >
              詳細ページを見る
            </Button>
          </Flex>
        ))}
      </VStack>
      <Pagination /> {/* ページネーションコンポーネント */}
    </Box>
  );
};

export default BookReviewList;
