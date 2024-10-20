// Vite環境かJest環境かを判断して、適切にAPI URLを取得
export const apiUrl =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_BASE_URL // Vite開発環境用
    : process.env.VITE_API_BASE_URL || "http://localhost:3000"; // Jestテスト環境用
