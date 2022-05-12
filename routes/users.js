import express from 'express';
import * as userService from '../services/userService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { status, message } = await userService.create(req.body);
        return res.status(status).json({status, message});        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `error at route: ${error.message}` })
    }
});

export default router;