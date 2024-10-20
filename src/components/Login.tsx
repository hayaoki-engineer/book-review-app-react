import { useState } from "react";
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
  VStack,
  Text,
} from "@chakra-ui/react";
import { apiUrl } from "../config";

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

  // ログインフォームのデータをAPIに送信
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const requestBody = {
        email: data.email,
        password: data.password,
      };

      const response = await fetch(`${apiUrl}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        setErrorMessage(
          "ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。"
        );
        return;
      }

      const { token } = await response.json();
      localStorage.setItem("authToken", token); // トークンを保存

      navigate("/"); // ログイン成功時にリダイレクト
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("ログインに失敗しました。");
    }
  };


  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box w="400px" p={6} boxShadow="lg" borderRadius="md">
        <Heading mb={6}>Login</Heading>
        {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "メールアドレスは必須です",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "正しいメールアドレスを入力してください",
                  },
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "パスワードは必須です" })}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">
              Login
            </Button>
          </VStack>
        </form>
        <Text mt={4}>
          アカウントをお持ちでない方はこちら{" "}
          <Button
            variant="link"
            colorScheme="teal"
            onClick={() => navigate("/signup")}
          >
            新規登録
          </Button>
        </Text>
      </Box>
    </Box>
  );
};

export default Login;
