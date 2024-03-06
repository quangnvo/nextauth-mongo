import mongoose from "mongoose";

let isConnected = false;

// This function is used to connect to the MongoDB database
export const connectToDatabase = async () => {

    // The line mongoose.set("strictQuery", true); is a configuration setting for Mongoose
    // Setting "strictQuery" to true means that Mongoose will filter out any fields in a query that are not in the schema. This can be useful to prevent unexpected behavior when querying your database.
    // For example, if you have a schema with a field "name" and "email" 
    // And you try to query the database with a field "name" and "age", Mongoose will filter out the "age" field and only query the "name" field.
    mongoose.set("strictQuery", true);

    if (isConnected) {
        console.log("MongoDB is successfully connected 🚀");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            // The "dbName" here is the name of the app, like "alatags"
            dbName: "artify",
            // The "useNewUrlParser" and "useUnifiedTopology" are configuration settings for Mongoose
            // Setting "useNewUrlParser" to true means that Mongoose will use the MongoDB driver's new connection management engine.This option tells Mongoose to use the new MongoDB Node.js driver’s new URL string parser instead of the deprecated one. The new parser is more secure and provides better performance.
            // useUnifiedTopology: true is a configuration setting for Mongoose, this option is related to how Mongoose handles MongoDB server topology. Setting this to true opts in to using the MongoDB driver’s new connection management engine. It’s designed to correctly handle all aspects of server discovery and monitoring, helping to prevent issues related to topology changes.
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        isConnected = true;
        console.log("MongoDB is successfully connected 🚀🚀🚀");
    } catch (err) {
        console.log(err)
    }
}