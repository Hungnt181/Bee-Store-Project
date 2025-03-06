import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
    requiredRole: string;
    children?: ReactNode; // Khai báo kiểu dữ liệu cho children
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, children }) => {
    const userRole = localStorage.getItem('userRole');

    // Kiểm tra xem người dùng có role phù hợp không
    if (userRole === requiredRole) {
        return children ? children : <Outlet />; // Trả về children nếu có, ngược lại trả về Outlet
    } else {
        // Nếu không có quyền, chuyển hướng về trang chủ
        return <Navigate to="/" />;
    }
};

export default PrivateRoute;