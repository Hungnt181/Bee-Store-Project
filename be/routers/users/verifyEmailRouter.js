import { Router } from 'express';
import User from '../../models/users/user';


const router = Router();

router.get('/', async (req, res) => {

    const { token } = req.query;
    const user = await User.findById(token);

    if (!user) {
        return res.status(400).json({
            'message': 'Token không hợp lệ'
        });
    }

    user.isVerified = true;
    await user.save();

    res.redirect('http://localhost:5173/success');
});

export default router;