import express from 'express';
import * as groupService from '../services/groupService';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const {status, message} = await groupService.getGroups();
        return res.status(status).json({status, message});        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `error at route: ${error.message}` })
    }
});

router.get('/savings', (req, res) => {
    try {
        const {owner, group_id} = req.query;
        const {status, message, data} = await groupService.getSavingsData(owner, group_id);
        return res.status(status).json({status, message, data});        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `error at route: ${error.message}` })
    }
});

router.post('/create', (req, res) => {
    try {
        console.log(req.query); 
        const { body } = req;
        const {status, message, data} = await groupService.createGroup(body);
        return res.status(status).json({status, message, data});        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `error at route: ${error.message}` })
    }
});

router.put('/join', (req, res) => {
    try {
        console.log(req.query); 
        const {group_id, username} = req.query
        const {status, message, data} = await groupService.addUserToGroup(group_id, username);
        return res.status(status).json({status, message, data});        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `error at route: ${error.message}` })
    }
});

export default router;