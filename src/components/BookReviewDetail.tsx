import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Heading, Spinner, Text, VStack, Link } from "@chakra-ui/react";

type BookReview = {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
};

const BookReviewDetail = () => {
  const { id } = useParams<{ id: string }>(); // URLパラメータからidを取得
  const [bookReview, setBookReview] = useState<BookReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookReviewDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken"); // ローカルストレージからJWTトークンを取得

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/books/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("認証エラー。ログインしてください。");
          } else {
            throw new Error("書籍情報の取得に失敗しました");
          }
        }

        const data = await response.json();
        setBookReview(data);
      } catch (error: any) {
        setError(error.message || "書籍情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchBookReviewDetail();
  }, [id]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!bookReview) {
    return <Text color="red.500">書籍が見つかりませんでした。</Text>;
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={5}>
      <Heading as="h1" mb={6}>
        {bookReview.title}
      </Heading>
      <VStack spacing={4} align="stretch">
        <Link href={bookReview.url} color="blue.500" isExternal>
          詳細ページはこちら
        </Link>
        <Text>レビュアー: {bookReview.reviewer}</Text>
        <Text>詳細: {bookReview.detail}</Text>
        <Text>レビュー: {bookReview.review}</Text>
      </VStack>
    </Box>
  );
};

export default BookReviewDetail;
