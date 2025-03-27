const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">🐝 BeeStore</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Kích hoạt tài khoản thành công!
        </h2>
        <p className="text-gray-600 mb-6">
          Chúc mừng bạn đã kích hoạt tài khoản thành công. Bạn có thể quay lại
          để đăng nhập và trải nghiệm BeeStore!
        </p>
        <a
          href="/signin"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-xl transition-all duration-200"
        >
          Quay về đăng nhập
        </a>
      </div>
    </div>
  );
};

export default Success;
