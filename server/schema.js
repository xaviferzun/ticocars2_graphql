const {gql} = require("graphql-tag");

//KAN-67 GraphQL schema. Here I define queries for vehicles and users
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String
    lastName: String
    status: String!
  }

  type Vehicle {
    id: ID!
    brand: String!
    model: String!
    year: Int!
    price: Float!
    description: String
    status: String!
    images: [String]
    owner: User
  }

  type Answer {
    id: ID!
    text: String!
    user: User
    createdAt: String
  }

  type Question {
    id: ID!
    text: String!
    user: User
    vehicle: Vehicle
    answer: Answer
    createdAt: String
  }

  type Query {
    vehicles(brand: String, model: String, status: String): [Vehicle]
    vehicle(id: ID!): Vehicle
    myVehicles: [Vehicle]
    inbox: [Question]
    me: User
  }
`;

module.exports = typeDefs;