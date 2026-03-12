import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
    // Kiểm tra xem trong kho chứa của trình duyệt có token hay không
    const token = localStorage.getItem("access_token");

    // NẾU KHÔNG CÓ VÉ: Đuổi về thẳng trang Đăng nhập
    // (Dùng replace để người dùng không bấm nút Back trên trình duyệt quay lại được)
    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    // NẾU CÓ VÉ: Mở cửa cho phép hiển thị các trang con bên trong
    return <Outlet />;
}