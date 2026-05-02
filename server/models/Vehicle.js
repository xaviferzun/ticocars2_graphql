const mongoose = require("mongoose");

//KAN-66 Vehicle schema, same as in the REST API
const vehicleSchema = new mongoose.Schema(
{
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: [
        {
        type: String
        }
    ],
    status: {
        type: String,
        enum: ["available", "sold"],
        default: "available"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Export the model
module.exports = mongoose.model("Vehicle", vehicleSchema);