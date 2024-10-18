import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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

      // ログイン成功時にリダイレクト
      navigate("/dashboard"); // ダッシュボードなどの次のページにリダイレクト
    } catch (error) {
      setErrorMessage("ログインに失敗しました。");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email", {
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "正しいメールアドレスを入力してください",
              },
            })}
          />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: "パスワードは必須です" })}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        アカウントをお持ちでない方はこちら <a href="/signup">新規登録</a>
      </p>
    </div>
  );
};

export default Login;
