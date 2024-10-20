import React, { useState, useEffect } from "react";
import Compressor from "compressorjs";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { apiUrl } from "../config";

// フォームに対応する型を定義
type SignupFormValues = {
  email: string;
  password: string;
  name: string; // 追加
  avatar: File | null;
};

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // ログイン済みの場合はリダイレクト
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("authToken");
    if (isLoggedIn) {
      navigate("/"); // ログイン済みなら書籍レビュー画面にリダイレクト
    }
  }, [navigate]);

  // 画像圧縮処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6,
        success(compressedResult) {
          setImage(compressedResult as File);
        },
        error(err) {
          console.error(err.message);
          setErrorMessage("画像の圧縮に失敗しました。");
        },
      });
    }
  };

  // フォームのデータに型を適用
  const onSubmit = async (data: SignupFormValues) => {
    try {
      const requestBody = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData); // 詳細エラーメッセージをコンソールに表示
        setErrorMessage(errorData.ErrorMessageJP || "登録に失敗しました。");
        return;
      }

      // レスポンスからトークンとユーザー名を取得して保存
      const { token, userName } = await response.json();
      localStorage.setItem("authToken", token); // トークンを保存
      localStorage.setItem("userName", userName); // ユーザー名を保存

      // 新規登録成功後に書籍レビュー画面にリダイレクト
      navigate("/");
    } catch {
      setErrorMessage("登録に失敗しました。");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading as="h1" mb={6} textAlign="center">
        Sign Up
      </Heading>
      {errorMessage && (
        <Text color="red.500" mb={4} textAlign="center">
          {errorMessage}
        </Text>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              {...register("name", { required: "ユーザー名は必須です" })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              {...register("email", { required: "メールアドレスは必須です" })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", { required: "パスワードは必須です" })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Avatar</FormLabel>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Sign Up
          </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        既にアカウントをお持ちですか？{" "}
        <Button
          variant="link"
          colorScheme="blue"
          onClick={() => navigate("/login")}
        >
          ログイン
        </Button>
      </Text>
    </Box>
  );
};

export default Signup;
