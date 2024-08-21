import mongoose from 'mongoose';
import {Group} from '../models/group.model.js';
import {User} from '../models/user.model.js';

export const createGroup = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).json({ message: 'Admin user not found' });
        }

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return res.status(400).json({ message: 'Invalid members' });
        }

        const newGroup = await Group.create({ name, members, admin: userId });

        await newGroup.save();

        return res.status(201).json({ group: newGroup });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getGroups = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const groups = await Group.find({ 
            $or: [{admin: userId}, { members: userId }],
         }).sort({ updatedAt: -1 });

        return res.status(200).json({ groups });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}