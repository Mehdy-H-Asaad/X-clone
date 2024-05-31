import mongoose from "mongoose";

const connectToMongo = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URL as string);
		console.log(`Connection to MongoDB : ${connection.connection.host}`);
	} catch (err: any) {
		console.log(`Failed to connect to MongoDB ${err.message}`);
	}
};

export default connectToMongo;
