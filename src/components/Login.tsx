import { useState, useEffect } from "react";
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

// フォームに対応する型を定義
type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // ログイン済みの場合はリダイレクト
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("authToken");
    if (isLoggedIn) {
      navigate("/book-reviews"); // ログイン済みなら書籍レビュー画面にリダイレクト
    }
  }, [navigate]);

  // ログインフォームのデータをAPIに送信
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const requestBody = {
        email: data.email,
        password: data.password,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData); // エラーの詳細をコンソールに表示
        setErrorMessage(
          "ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。"
        );
        return;
      }

      // レスポンスからトークンを取得し、localStorageに保存
      const { token, userName } = await response.json();
      localStorage.setItem("authToken", token); // トークンを保存
      localStorage.setItem("userName", userName); // ユーザー名を保存

      // ログイン成功時にリダイレクト
      navigate("/book-reviews"); // 書籍レビュー一覧画面にリダイレクト
    } catch {
      setErrorMessage("ログインに失敗しました。");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading as="h1" mb={6} textAlign="center">
        Login
      </Heading>
      {errorMessage && (
        <Text color="red.500" mb={4} textAlign="center">
          {errorMessage}
        </Text>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              {...register("email", {
                required: "メールアドレスは必須です",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "正しいメールアドレスを入力してください",
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", { required: "パスワードは必須です" })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Login
          </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        アカウントをお持ちでない方はこちら{" "}
        <Button
          variant="link"
          colorScheme="blue"
          onClick={() => navigate("/signup")}
        >
          新規登録
        </Button>
      </Text>
    </Box>
  );
};

export default Login;
