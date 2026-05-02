require("dotenv").config();
const {ApolloServer} = require("@apollo/server");
const {startStandaloneServer} = require("@apollo/server/standalone");
const connectDB = require("./config/database");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

connectDB();

//KAN-66 Create Apollo server with schema and resolvers
const server = new ApolloServer({typeDefs, resolvers});

//KAN-66 Start the server and handle authentication context
startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },

  //KAN-66 Take and verify JWT token from request header, and add user info to context if valid
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];
    if (!token) return { user: null };

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      return { user };
    } catch (error) {
      return { user: null };
    }
  },
}).then(({ url }) => {
  console.log(`GraphQL API running at ${url}`);
});