import User from '../models/userModel.js';

/**
 * * adds new user to the database
 * @param {object} data 
 */
const create = async (data) => {
    try {
        if(Object.values(data).includes('') || Object.values(data).includes(' ') || !Object.keys(data).length) {
            return { status: 400, message: "Please fill up all fields" }
        }
        const {username} = data;
        const existingUser = await User.findOne({username});
        if(existingUser) return { status: 400, message: "User already exists"}
        const newUser = new User(data);
        newUser.save();
        return { 
            status:newUser ? 201: 400, 
            message: newUser ? `User created successfully`: "could not create user", 
            data: newUser
        };
    } catch (error) {
        console.log(error);
        return { status: 500, message: `error creating user: ${error.message}` };
    }
}

/**
 * * find a user
 * @param {object} query 
 */
const getUser = async (query) => {
    try {
        const foundUser = await User.findOne(query);
        return { 
            status: foundUser ? 200 : 404, 
            message: foundUser ? "Successfully retrieved user" : "Unable to retrieve user",
            data: foundUser 
        }
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'error creating user' }
    }
}


export { create, getUser }