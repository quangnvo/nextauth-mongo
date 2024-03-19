import { Schema, model, models } from "mongoose"

// If go back to the CreateWork, we have the same fields as the Work model
// We have creator, category, title, description, price, and workPhotoPaths
const WorkSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    workPhotoPaths: [{ type: String }]
})

const Work = models.Work || model("Work", WorkSchema)
export default Work