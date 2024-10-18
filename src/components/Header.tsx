import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const isLoggedIn = !!localStorage.getItem("authToken"); // ログイン状態をチェック
  const navigate = useNavigate();

  const handleLogout = () => {
    // ログアウト処理: トークンを削除
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    navigate("/login"); // ログインページにリダイレクト
  };

  return (
    <header>
      <h1>書籍レビューアプリ</h1>
      <nav>
        {isLoggedIn ? (
          <div>
            <button onClick={handleLogout}>ログアウト</button>{" "}
            {/* ログアウトボタン */}
          </div>
        ) : (
          <Link to="/login">ログイン</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
