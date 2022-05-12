import mongoose from 'mongoose';
import config from 'config';
const dbURI = config.get("dbURI");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(dbURI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log("successfully connected to MongoDB");
        return connection
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
export default connectDB;