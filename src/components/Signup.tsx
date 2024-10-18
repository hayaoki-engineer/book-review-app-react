import React, { useState, useEffect } from "react";
import Compressor from "compressorjs";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// フォームに対応する型を定義
type SignupFormValues = {
  email: string;
  password: string;
  name: string; // 追加
  avatar: File | null;
};

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // ログイン済みの場合はリダイレクト
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("authToken");
    if (isLoggedIn) {
      navigate("/book-reviews"); // ログイン済みなら書籍レビュー画面にリダイレクト
    }
  }, [navigate]);

  // 画像圧縮処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6,
        success(compressedResult) {
          setImage(compressedResult as File);
        },
        error(err) {
          console.error(err.message);
          setErrorMessage("画像の圧縮に失敗しました。");
        },
      });
    }
  };

  // フォームのデータに型を適用
  const onSubmit = async (data: SignupFormValues) => {
    try {
      const requestBody = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
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
        console.error("Error:", errorData); // 詳細エラーメッセージをコンソールに表示
        setErrorMessage(errorData.ErrorMessageJP || "登録に失敗しました。");
        return;
      }

      // レスポンスからトークンとユーザー名を取得して保存
      const { token, userName } = await response.json();
      localStorage.setItem("authToken", token); // トークンを保存
      localStorage.setItem("userName", userName); // ユーザー名を保存

      // 新規登録成功後に書籍レビュー画面にリダイレクト
      navigate("/book-reviews");
    } catch {
      setErrorMessage("登録に失敗しました。");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name:</label> {/* ユーザー名の入力フィールド */}
          <input
            type="text"
            {...register("name", { required: "ユーザー名は必須です" })}
          />
          {errors.name?.message && (
            <p style={{ color: "red" }}>{String(errors.name.message)}</p>
          )}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register("email", { required: "メールアドレスは必須です" })}
          />
          {errors.email?.message && (
            <p style={{ color: "red" }}>{String(errors.email.message)}</p>
          )}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: "パスワードは必須です" })}
          />
          {errors.password?.message && (
            <p style={{ color: "red" }}>{String(errors.password.message)}</p>
          )}
        </div>
        <div>
          <label>Avatar:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        既にアカウントをお持ちですか？ <a href="/login">ログイン</a>
      </p>
    </div>
  );
};

export default Signup;
