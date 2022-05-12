import mongoose, { Schema , Types } from 'mongoose';
import config from 'config';
import moment from 'moment';
const url = config.get('url');

// group types
export const groupTypes = {
    PUBLIC : "PUBLIC",
    PRIVATE : "PRIVATE"
}
// generates group id
var generateGroupId = function () {
    var length = 6;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i <= length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.group_id = result;
    return result;
}

//set group url
var setGroupLink = function(group_id) {
    if(!group_id || group_id == " ") {
        return {
            "status": "404",
            "message" : 'please provide the event code'
        }
    }
    const event_url = url+group_id;
    this.url = event_url;
}

var addMember = function (member) {
    try {
        const {_id, username} = member;
        if(this.members.length > this.capacity) throw new Error(`Group: ${ this.group_id } is full`);
        if(this.members.includes(_id)) throw new Error(`Group:`)
        this.members.push(_id);
        this.savings[username] = 0;
        const memberAdded = this.members.includes(_id);
        return memberAdded;
    } catch (error) {
        return error
    }
}


const groupModel = {
    group_id: {type: String, trim: true, index:true },
    // group url link
    url: { type: String, trim: true },
    startDate: {
        type: String,
        trim: true,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')
    },
    name: {type: String, required: true, index: true}, // group name
    capacity: {type: Number, required: true}, // maximum capacity for group
    description: {type: String},
    type: {type: String, default: groupTypes.PRIVATE}, // sets group visibility
    owner: {type: Types.ObjectId, ref: 'users'}, // group admin
    members: [{type: Types.ObjectId, ref: 'users'}], // contains a list of all members
    // maps users to the amount they have saved
    savings: {type: Object, default: {}},
    targetAmount: { 
        type: Types.Decimal128, 
        default: 0.00, 
        get: amount => { return +parseFloat(+amount).toFixed(2) }
      }
}

const groupSchema = new Schema(groupModel, {timestamps: true, toJSON: { getters: true } });
groupSchema.methods.addMember = addMember
groupSchema.methods.setGroupLink = setGroupLink
groupSchema.methods.generateGroupId = generateGroupId
const Group = mongoose.model('Group', groupSchema); 

export default Group;


