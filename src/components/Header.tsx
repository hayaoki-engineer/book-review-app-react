import { Box, Flex, Button, Text, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const isLoggedIn = !!localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    navigate("/login");
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
              <Link
                onClick={() => navigate("/profile")}
                mr={4}
                color="teal.200"
              >
                プロフィール編集
              </Link>
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
