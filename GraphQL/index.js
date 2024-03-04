import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./db.js";

const resolvers = {
  Query: {
    reviews() {
      return db.reviews;
    },
    review(parent, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    games() {
      return db.games;
    },
    game(parent, args) {
      return db.games.find((game) => game.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(parent, args) {
      return db.authors.find((author) => author.id === args.id);
    },
  },
  //for nested relations and mappings
  Game: {
    reviews(parent) {
      return db.reviews.filter((review) => review.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.authors.filter((review) => review.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((author) => author.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((game) => game.id === parent.game_id);
    },
  },
  // Mutation works for  adding deleting or updating exisitng data
  Mutation: {
    deleteGame(parent, args) {
      db.games = db.games.filter((game) => game.id !== args.id);
      return db.games;
    },
    addGame(parent, args) {
      const { title, platform } = args.game;
      const game = {
        id: (db.games.length + 1).toString(),
        title,
        platform,
      };
      db.games.push(game);
      return game;
    },
    updateGame(parent, args) {
      const { id } = args;
      db.games = db.games.map((game) => {
        if (game.id === id) {
          return { ...game, ...args.game };
        } else {
          return game;
        }
      });
      return db.games.find((game) => game.id === args.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT },
});

console.log(`🚀  Server ready at ${url}`);
