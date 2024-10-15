import React from "react"; // Reactのインポートを追加
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../src/Login"; // 正しいパスに変更

test("ログインフォームが正しくレンダリングされているか", () => {
  render(<Login />);

  // メールアドレスとパスワード入力フォーム、ログインボタンの存在確認
  expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /ログイン/i })).toBeInTheDocument();
});
