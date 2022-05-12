import Group, { groupTypes } from '../models/groupModel.js';
import * as userService from '../services/userService.js';
/**
 * * creates group
 * @param {object} groupData 
 */
const createGroup = async (groupData) => {
    try {
        if(Object.values(groupData).includes('') || Object.values(groupData).includes(' ') || !Object.keys(groupData).length) {
            return { status: 400, message: "Please fill up all fields" }
        }
        // extracting username of owner from request body
        const { owner } = groupData;
        // retrieving group owner info and handling any errors
        const {status, message, data:ownerData} = await userService.getUser({username: owner});
        if(!ownerData || status !== 200) return { status, message };
        // extracting group owner _id and username
        const { _id, username } = ownerData;
        const newGroup = new Group(groupData);
        // setting group owner
        newGroup.owner = _id;
        // mapping owner to savings
        newGroup.savings[username] = 0;
        // generating group id
        const group_id = newGroup.generateGroupId();
        // set group join link
        newGroup.setGroupLink(group_id);
        // add owner as a member
        newGroup.addMember(ownerData);
        newGroup.save();

        return {
            status: newGroup ? 200 : 400, 
            message: newGroup ? "group created successfully": "error creating group",
            data: newGroup.group_id
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
        // get user data
        const {status, message, data: newMemberData} = await userService.getUser({username});
        if(!newMemberData || status !== 200) return { status, message }
        // find group
        const foundGroup = await Group.findOne({group_id});
        if(!foundGroup)  return { status:404, message: `Group: ${group_id} doesn't exists`}
        // handling addMember method
        const isMemberStatus = foundGroup.addMember(newMemberData);
        if(!isMemberStatus.success) return { status: 400, message: `Error adding member: ${isMemberStatus.message}` };
        foundGroup.savings[username] = 0;
        // updating savings object
        await Group.updateOne({group_id}, { $set: { savings: foundGroup.savings } });
        foundGroup.save();

        return { 
            status: isMemberStatus.success ? 200 : 400, 
            message: isMemberStatus.success ? `${newMemberData.username} added to a group: ${foundGroup.group_id}` : `could not add ${newMemberData.username} to ${foundGroup.group_id}` 
        }

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
const getGroups = async (type) => {
    try {   
        type = type?.toUpperCase();
        if(!type) return{ status: 400, message: `group type not provided`}
        // filter = filter || {type: groupTypes.PUBLIC}
        if (!Object.keys(groupTypes).includes(type)) return {status: 400, message:`invalid group type requested: ${type}`}
        const query = {type} || {type: groupTypes.PUBLIC}
        const allGroups = await Group.find(query)
            .sort({createdAt: -1})
            .populate({path: 'owner', select: 'username fullname ', model: 'User'})
            .populate({path: 'members', select: 'username  fullname', model: 'User'})
            .select('-_id -__v -createdAt -updatedAt')

        const length = allGroups.length > 0;
        return { 
            status: length ? 200 : 404, 
            message: length ?  `Successfully retrieved groups` : `Unable to retrieve groups`,
            data: allGroups
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
        if(!owner || !group_id) return {status: 400, message: 'owner and group_id not provided'}
        const {status, message, data:ownerData} = await userService.getUser({username: owner});
        if (!ownerData || status !== 200) return { status, message }
        const { _id } = ownerData;
        const foundGroup = await Group.findOne({group_id, owner:_id})
            .populate({path: 'owner', select: 'username fullname ', model: 'User'})
            .populate({path: 'members', select: 'username  fullname', model: 'User'})

        return {
            status: foundGroup ? 200 : 404,
            message: foundGroup ? `Successfully retrieved group: ${group_id} saving info` : `Couldn't retrieve group: ${group_id} savings info`,
            data: {members: foundGroup?.members, savings: foundGroup?.savings}
        }
        
    } catch (error) {
        console.log(error);
        return { status: 500, message: `server error: ${error.message}` }; 
    }
}

export { createGroup, addUserToGroup, getGroupById, getGroups, getSavingsData }

