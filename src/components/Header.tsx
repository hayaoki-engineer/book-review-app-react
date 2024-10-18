import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const isLoggedIn = !!localStorage.getItem("authToken"); // ログイン状態をチェック
  const userName = localStorage.getItem("userName") || "ゲスト"; // ログインユーザー名を取得。なければ'ゲスト'と表示
  console.log(userName)
  const navigate = useNavigate();

  const handleLogout = () => {
    // ログアウト処理: トークンを削除
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    navigate("/login"); // ログインページにリダイレクト
  };

  return (
    <Box bg="blue.500" color="white" px={4} py={2}>
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Text fontSize="xl" fontWeight="bold">
          書籍レビューアプリ
        </Text>
        <Flex align="center">
          {isLoggedIn ? (
            <Flex align="center">
              {/* <Text mr={4}>こんにちは、{userName}さん</Text>{" "} */}
              {/* userNameが無ければ'ゲスト'と表示 */}
              <Button
                colorScheme="red"
                variant="outline"
                onClick={handleLogout}
              >
                ログアウト
              </Button>
            </Flex>
          ) : (
            <Button colorScheme="teal" onClick={() => navigate("/login")}>
              ログイン
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
