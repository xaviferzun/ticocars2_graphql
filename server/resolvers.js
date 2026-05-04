const Vehicle = require("./models/Vehicle");
const User = require("./models/User");

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

    //Get the authenticated user from context
    me: async (_, __, {user}) => {
      if (!user) throw new Error("No autenticado.");
      return user;
    },
  },
};


module.exports = resolvers;