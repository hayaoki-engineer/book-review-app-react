import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Input,
  Textarea,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { apiUrl } from "../config";

// 書籍レビューの型定義
type BookReview = {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
};

const EditBookReview = () => {
  const { id } = useParams<{ id: string }>(); // URLからレビューのIDを取得
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<BookReview>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // レビューのデータを取得してフォームにセット
    const fetchReview = async () => {
      try {
        const token = localStorage.getItem("authToken"); // トークンを取得
        const response = await fetch(`${apiUrl}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("書籍レビューの取得に失敗しました");
        }
        const data: BookReview = await response.json();
        reset(data); // フォームに取得したデータをセット
      } catch {
        setError("書籍レビューの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, reset]);

  const onSubmit = async (data: BookReview) => {
    try {
      const token = localStorage.getItem("authToken"); // トークンを取得
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 認証ヘッダーを追加
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("書籍レビューの更新に失敗しました");
      }

      // 更新成功後にリダイレクト
      navigate("/");
    } catch {
      setError("書籍レビューの更新に失敗しました。");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("書籍レビューの削除に失敗しました");
      }

      // 削除成功後にリダイレクト
      navigate("/");
    } catch {
      setError("書籍レビューの削除に失敗しました。");
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={5}>
      <Heading as="h1" mb={6}>
        書籍レビュー編集
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={4}>
          <label>タイトル</label>
          <Input type="text" {...register("title", { required: true })} />
        </Box>
        <Box mb={4}>
          <label>URL</label>
          <Input type="text" {...register("url", { required: true })} />
        </Box>
        <Box mb={4}>
          <label>詳細</label>
          <Textarea {...register("detail", { required: true })} />
        </Box>
        <Box mb={4}>
          <label>レビュー</label>
          <Textarea {...register("review", { required: true })} />
        </Box>
        <Button type="submit" colorScheme="blue" mr={4}>
          更新
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          削除
        </Button>
      </form>
    </Box>
  );
};

export default EditBookReview;
