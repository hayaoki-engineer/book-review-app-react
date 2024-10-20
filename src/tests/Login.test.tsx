import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom"; // 必要なRouterのインポート
import { ChakraProvider } from "@chakra-ui/react"; // Chakra UIのインポート
import Login from "../components/Login";

describe("Login Component", () => {
  it("renders the login form", () => {
    // MemoryRouterでラップしてコンポーネントをレンダリング
    render(
      <MemoryRouter>
        <ChakraProvider>
          <Login />
        </ChakraProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });
});
