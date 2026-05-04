const Vehicle = require("./models/Vehicle");
const User = require("./models/User");
const Question = require("./models/Question");
const Answer = require("./models/Answer");

//KAN-67 Resolvers fetch data from mongo for each graphql query
const resolvers = {
  Query: {
    //Get all vehicles with optional filters
    vehicles: async (_, {brand, model, status}) => {
      const filters = {};
      if (brand) filters.brand = {$regex: brand, $options: "i"};
      if (model) filters.model = {$regex: model, $options: "i"};
      if (status) filters.status = status;
      return await Vehicle.find(filters).populate("owner");
    },

    //Get a vehicle by ID
    vehicle: async (_, { id }) => {return await Vehicle.findById(id).populate("owner");},

    //KAN-74 Get vehicles of the authenticated user
    myVehicles: async (_, __, {user}) => {
      if (!user) throw new Error("No autenticado.");
      return await Vehicle.find({owner: user._id}).sort({createdAt: -1});
    },

    //bKAN-74 Get inbox conversations for the authenticated user
    inbox: async (_, __, { user }) => {
      if (!user) throw new Error("No autenticado.");

      //Find all questions where user is the asker or the vehicle owner
      const questions = await Question.find({
        $or: [
          {user: user._id},
          {vehicle: {$in: await Vehicle.find({owner: user._id}).distinct("_id")}}
        ]
      })
        .populate("user")
        .populate({path: "vehicle", populate: {path: "owner"}})
        .sort({createdAt: -1});

      //Attach answer to eaach question
      const result = await Promise.all(
        questions.map(async (q) => {
          const answer = await Answer.findOne({question: q._id}).populate("user");
          return {...q.toObject(), id: q._id, answer};
        })
      );
      return result;
    },

    //Get the authenticated user from context
    me: async (_, __, {user}) => {
      if (!user) throw new Error("No autenticado.");
      return user;
    },
  },

  //KAN-74 Resolvers to convert Mongo _id to string id for graph
  Vehicle: {
    id: (parent) => parent._id?.toString() || parent.id,
  },
  User: {
    id: (parent) => parent._id?.toString() || parent.id,
  },
  Answer: {
    id: (parent) => parent._id?.toString() || parent.id,
  },
};



module.exports = resolvers;