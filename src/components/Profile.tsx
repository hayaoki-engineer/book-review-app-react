import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { useNavigate } from "react-router-dom";

// ユーザー情報の型定義
type UserProfileFormValues = {
  name: string;
};

const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfileFormValues>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // 初期値として登録済みユーザー情報を取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("ユーザー情報の取得に失敗しました");
        }

        const data = await response.json();
        setValue("name", data.name); // 名前のフィールドを設定
      } catch {
        setErrorMessage("ユーザー情報の取得に失敗しました。");
      }
    };

    fetchUserProfile();
  }, [setValue]);

  // フォームのデータを送信してユーザー情報を更新
  const onSubmit = async (data: UserProfileFormValues) => {
    try {
      const token = localStorage.getItem("authToken");
      const requestBody = { name: data.name }; // 更新するデータ（ユーザー名）

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // JWTトークンを設定
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("ユーザー情報の更新に失敗しました");
      }

      // 成功したら書籍レビュー画面にリダイレクト
      navigate("/");
    } catch {
      setErrorMessage("ユーザー情報の更新に失敗しました。");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading as="h1" mb={6} textAlign="center">
        プロフィール編集
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

          <Button type="submit" colorScheme="blue" width="full">
            更新
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Profile;
