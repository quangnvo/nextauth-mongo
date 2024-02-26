import { connectToDatabase } from "@mongodb/database";
import User from "@models/User";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { writeFile } from "fs/promises";


/*#################
# The follwing code is only for USER REGISTER
#################*/
export async function POST(req) {
    try {
        // First step is to connect to the database, always remember to connect to the database before performing any operation on the database
        await connectToDatabase();

        // The req object contains the data that was sent from the user from frontend
        const data = await req.formData();

        console.log("data ne: ", data.get("username"))

        // Take information from the form
        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");
        const file = data.get("profileImage");

        if (!file) {
            // Use "NextResponse" to send a response to the frontend
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        console.log("da vao /api/register/ route.js")
        console.log("file ne: ", file)

        // Convert the file to a buffer
        // The buffer is a temporary storage for the file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // But here we still save the file to the local storage, so we need to specify the path to save the file
        const profileImagePath = `E:/Quang__CODE__SourceCode/1__SourceCode__Quang/29__Quang__Alatags__IMPORTANT/alatags__3/frontend/public/uploads/${file.name}`

        // Save the file to the local storage
        await writeFile(profileImagePath, buffer);

        console.log(`open file: ${profileImagePath} to see the uploaded files`)

        // ***Note***: if want to save the file to the cloud, we need to use the cloud storage service like AWS S3, Google Cloud Storage, or Firebase Storage
        // The process of saving the file to the cloud is similar to saving the file to the local storage, but the difference is the path to save the file
        // For example, if we use AWS S3, the path to save the file will be something like "https://s3.amazonaws.com/bucketName/uploads/${file.name}"
        // And the process of saving the file to the cloud is asynchronous, so we need to use the "await" keyword to wait for the file to be saved to the cloud
        // Like this:
        // const profileImagePath = await saveFileToCloudStorage(file);

        // Then, before creating a new user, we need to check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        // If the user does not exist, then we hash the password, after hashing the password, we create a new user
        // The "saltRounds" is any number, the higher the number, the more secure the password is, but it will take longer to hash the password   
        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds);

        // Then create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            // This is the path to the file, if we save the file to the local storage, the path will be something like "/uploads/${file.name}"
            // If we save the file to the cloud, the path will be something like "https://s3.amazonaws.com/bucketName/uploads/${file.name}"
            profileImagePath: `/uploads/${file.name}`
        });

        // After creating a new user, we save the user to the database
        await newUser.save();

        // Then we send a sucessful response to the frontend
        return NextResponse.json({
            message: "User registered successfully",
            user: newUser
        }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Fail to create new user!" }, { status: 500 });
    }
}
