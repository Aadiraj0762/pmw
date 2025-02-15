// const mongoose = require("mongoose");
// require("dotenv").config();
// const {MONGO_USERNAME,MONGO_PASSWORD,MONGO_DATABASE_NAME} =require("./variables")

// const dbConnect = () => {
//   console.log("Welcome to database")
//   mongoose.connect(
//     // `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.jczad.mongodb.net/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`,
    // `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.ecwpr.mongodb.net/${MONGO_DATABASE_NAME}?retryWrites=true&w=majority`,

//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         serverSelectionTimeoutMS: 30000, 
//         socketTimeoutMS: 45000, 
//     }
// )
// };
 
// module.exports = dbConnect;




const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    console.log("Connecting to MongoDB...");
    mongoose.connect(
        `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ecwpr.mongodb.net/${process.env.MONGO_DATABASE_NAME}`,
        {
            serverSelectionTimeoutMS: 30000, 
            socketTimeoutMS: 45000, 
        }
    )
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("Error in connecting the database", err));
};

module.exports = dbConnect;
