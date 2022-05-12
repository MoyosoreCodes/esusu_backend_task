import User from '../models/userModel';

/**
 * * adds new user to the database
 * @param {object} data 
 */
const create = async (data) => {
    try {
        if(Object.values(data).includes('') || Object.values(data).includes(' ') || !Object.keys(data).length) {
            return { status: 400, message: "Please fill up all fields" }
        }
        const newUser = new User(data);
        newUser.save();
        return { status:201, message: `User created successfully` };
    } catch (error) {
        console.log(error);
        return { status: 500, message: 'error creating user' }
    }
}

/**
 * * find a user
 * @param {object} query 
 */
const getUser = async (query) => {
    try {
        const foundUser = await User.findOne({query});
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