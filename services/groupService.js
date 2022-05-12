import Group, { groupTypes } from '../models/groupModel';
import * as userService from '../services/userService';
/**
 * * creates group
 * @param {object} groupData 
 */
const createGroup = async (groupData) => {
    try {
        const { owner } = groupData;
        const {status, message, data:ownerData} = await userService.getUser({username: owner});
        if(!ownerData || status !== 200) return { status, message };
        const { _id } = ownerData;
        const newGroup = new Group(groupData);
        newGroup.owner = _id;
        const group_id = newGroup.generateGroupId();
        newGroup.setGroupLink(group_id);
        newGroup.save();

        return {
            status: newGroup ? 200 : 400, 
            message: newGroup ? "group created successfully": "error creating group"
        }
    } catch (error) {
        console.log(error);
        return {status: 500, message: `server error: ${error.message}`}; 
    }
}

/**
 * * adds user to a group
 * @param {string} group_id 
 * @param {string} username
 */
const addUserToGroup = async (group_id, username) => {
    try {
        const {status, message, data: newMemberData} = await userService.getUser({username});
        if(!newMemberData || status !== 200) return { status, message }
        const foundGroup = await Group.findOne({group_id});
        const memberAdded = foundGroup.addMember(newMemberData);
        if(!memberAdded) return { status: 400, message: 'Error adding member' }
        foundGroup.save();
        return { status: 200, message:`${newMemberData.username} added to a group: ${foundGroup.group_id}` }
    } catch (error) {
        console.log(error);
        return { status: 500, message: `server error: ${error.message}` }; 
    }
}

/**
 * * find a group by id
 * @param {string} group_id 
 */
const getGroupById = async (group_id) => {
    try {
        const foundGroup = await Group.findOne({group_id})
            .populate({path: 'owner', select: 'username fullname ', model: 'User'})
            .populate({path: 'members', select: 'username  fullname', model: 'User'})
            .select('-_id -__v -createdAt -updatedAt -members')
  
        return { 
            status: foundGroup ? 200 : 404, 
            message: foundGroup ?  `Successfully retrieved group: ${group_id}` : `Group: ${group_id} not found`
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: `server error: ${error.message}` }; 
    }
}

/**
 * * get all groups
 * @param {object} filter 
 */
const getGroups = async () => {
    try {   
        // filter = filter || {type: groupTypes.PUBLIC}
        const allGroups = await Group.find({type: groupTypes.PUBLIC})
            .sort({createdAt: -1})
            .populate({path: 'owner', select: 'username fullname ', model: 'User'})
            .populate({path: 'members', select: 'username  fullname', model: 'User'})
            .select('-_id -__v -createdAt -updatedAt -members')

        const length = allGroups.length > 0;
        return { 
            status: length ? 200 : 404, 
            message: length ?  `Successfully retrieved groups` : `Unable to retrieve groups`
        };
    
    } catch (error) {
        console.log(error);
        return { status: 500, message: `server error: ${error.message}` }; 
    }
}

/**
 * * gets savings data for a group
 * @param {string} group_id 
 * @param {string} owner 
 */
const getSavingsData = async (owner, group_id) => {
    try { 
        const foundGroup = await Group.findOne({group_id, owner});
        return {
            status: foundGroup ? 200 : 404,
            message: foundGroup ? "Successfully retrieved group saving info" : "Couldn't retrieve group savings info",
            data: foundGroup?.savings
        }
        
    } catch (error) {
        console.log(error);
        return { status: 500, message: `server error: ${error.message}` }; 
    }
}

export { createGroup, addUserToGroup, getGroupById, getGroups, getSavingsData }

