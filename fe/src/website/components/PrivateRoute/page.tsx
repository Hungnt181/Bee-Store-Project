import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Định nghĩa type cho props của PublicRoute
interface PublicRouteProps {
    children: ReactNode;
}

// Định nghĩa type cho props của PrivateRoute
interface PrivateRouteProps {
    requiredRole: string;
    children?: ReactNode;
    adminForbidden?: boolean;
}

// Component PublicRoute dành cho các trang mà người dùng đã đăng nhập không được phép truy cập
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const user = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    // Nếu đã đăng nhập, chuyển hướng tới trang chính dựa theo role
    if (user) {
        return <Navigate to={userRole === "admin" ? "/admin" : "/"} />;
    }

    // Nếu chưa đăng nhập, hiển thị component con
    return <>{children}</>;
};

// Component AdminForbiddenRoute dành cho các trang cấm admin truy cập
export const AdminForbiddenRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const userRole = localStorage.getItem('userRole');

    // Nếu là admin, chuyển hướng về trang admin
    if (userRole === "admin") {
        return <Navigate to="/admin" />;
    }

    // Nếu không phải admin, cho phép truy cập
    return <>{children}</>;
};

// Component PrivateRoute dành cho các trang yêu cầu quyền truy cập cụ thể
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, children, adminForbidden }) => {
    const userRole = localStorage.getItem('userRole');

    // Nếu không có userRole (chưa đăng nhập), chuyển hướng đến trang đăng nhập
    if (!userRole) {
        return <Navigate to="/signin" />;
    }

    // Nếu trang cấm admin và user là admin, chuyển hướng đến trang admin
    if (adminForbidden && userRole === "admin") {
        return <Navigate to="/admin" />;
    }

    // Nếu là admin nhưng cố gắng truy cập trang user
    if (userRole === "admin" && requiredRole === "user") {
        return <Navigate to="/admin" />;
    }

    // Nếu là user nhưng cố gắng truy cập trang admin
    if (userRole === "user" && requiredRole === "admin") {
        return <Navigate to="/" />;
    }

    // Nếu role phù hợp với trang yêu cầu
    if (userRole === requiredRole) {
        return children ? children : <Outlet />;
    }

    // Trường hợp mặc định khác, chuyển về trang chủ
    return <Navigate to="/" />;
};

// Xuất mặc định PrivateRoute để tương thích với code cũ
export default PrivateRoute;