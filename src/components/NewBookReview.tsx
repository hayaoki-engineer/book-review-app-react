import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config";

// フォームデータの型定義
type NewBookReviewFormValues = {
  title: string;
  url: string;
  detail: string;
  review: string;
};

const NewBookReview = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewBookReviewFormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // 書籍レビュー投稿APIを呼び出す関数
  const onSubmit = async (data: NewBookReviewFormValues) => {
    try {
      const requestBody = {
        title: data.title,
        url: data.url,
        detail: data.detail,
        review: data.review,
      };
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${apiUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("書籍レビューの投稿に失敗しました");
      }

      // 成功したら書籍一覧画面にリダイレクト
      navigate("/");
    } catch {
      setErrorMessage("書籍レビューの投稿に失敗しました。");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading as="h1" mb={6} textAlign="center">
        新しい書籍レビューを投稿
      </Heading>
      {errorMessage && (
        <Text color="red.500" mb={4} textAlign="center">
          {errorMessage}
        </Text>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.title}>
            <FormLabel>タイトル</FormLabel>
            <Input
              type="text"
              {...register("title", { required: "タイトルは必須です" })}
            />
            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.url}>
            <FormLabel>URL</FormLabel>
            <Input
              type="url"
              {...register("url", { required: "URLは必須です" })}
            />
            <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.detail}>
            <FormLabel>詳細</FormLabel>
            <Textarea {...register("detail", { required: "詳細は必須です" })} />
            <FormErrorMessage>{errors.detail?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.review}>
            <FormLabel>レビュー</FormLabel>
            <Textarea
              {...register("review", { required: "レビューは必須です" })}
            />
            <FormErrorMessage>{errors.review?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            投稿
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default NewBookReview;
