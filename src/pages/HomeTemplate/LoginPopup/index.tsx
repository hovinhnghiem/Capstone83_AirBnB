import React, { useState } from "react";
import axios from "axios";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/signin", { taiKhoan, matKhau });
      alert("Đăng nhập thành công ✅: " + JSON.stringify(res.data));
      onClose();
    } catch (error) {
      alert("Đăng nhập thất bại ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl w-96">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>

        <input
          type="text"
          placeholder="Tài khoản"
          value={taiKhoan}
          onChange={(e) => setTaiKhoan(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={matKhau}
          onChange={(e) => setMatKhau(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
