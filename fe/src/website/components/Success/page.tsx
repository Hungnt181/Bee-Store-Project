import React from 'react'

const Success = () => {
    return (
        <div className='text-center'>
            <h1 className='text-2xl'>-----  BeeStore  -----</h1>
            <h1 className='text-xl'>Chúc mừng bạn đã kích hoạt tài khoản thành công</h1>
            <h3>
                <a className='text-red-700 text-xl hover:text-blue-500' href="/signin">Quay trở về trang đăng nhập</a>
            </h3>
        </div>
    )
}

export default Success
