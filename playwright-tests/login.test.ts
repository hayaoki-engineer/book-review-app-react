import { test, expect } from "@playwright/test";

test("ログインフォームのエラーメッセージを確認", async ({ page }) => {
  // ログインページに移動
  await page.goto("http://localhost:5173/login");

  // サブミットボタンをクリック（メールアドレスもパスワードも入力しない）
  await page.click('button[type="submit"]');

  // フォームバリデーションエラーメッセージを確認
  const emailError = page.locator("text=メールアドレスは必須です");
  await expect(emailError).toBeVisible();

  const passwordError = page.locator("text=パスワードは必須です");
  await expect(passwordError).toBeVisible();

  // 正しいメールアドレスと間違ったパスワードを入力して再度送信
  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "wrongpassword");
  await page.click('button[type="submit"]');

  // APIエラーメッセージを確認
  const apiErrorMessage = page.locator(
    "text=ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。"
  );
  await expect(apiErrorMessage).toBeVisible();
});
