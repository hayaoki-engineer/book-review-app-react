import { test, expect } from "@playwright/test";

test("ログインフォームのエラーメッセージを確認", async ({ page }) => {
  await page.goto("http://localhost:5173"); // ローカルホストのURL

  // メールアドレスもパスワードも入力しないで送信
  await page.click('button[type="submit"]');

  // エラーメッセージの確認
  const errorMessage = page.locator(
    "text=メールアドレスとパスワードを入力してください。"
  );
  await expect(errorMessage).toBeVisible();

  // 正しい入力をした場合にエラーメッセージが非表示になることを確認
  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(errorMessage).not.toBeVisible();
});
