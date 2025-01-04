/* eslint-disable */
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} from "graphql";
import { books } from "../data/booksData.js";
import openConnection from "../config/dbConnection.js";

let conn = openConnection();

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    genre: { type: new GraphQLList(GraphQLString) },
    description: { type: GraphQLString },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    authorName: { type: GraphQLString },
    authorAdress: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id }) {
        try {
          const bookData = books.find((book) => book.id === id);

          if (!bookData) {
            throw new Error(`Book with ID ${id} not found.`);
          }

          return bookData;
        } catch (error) {
          console.error("Error in resolving 'book':", error.message);

          throw new Error(error.message || "An unexpected error occurred.");
        }
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id, address = "Banglore" }) {
        try {
          const authorDetails = books.find(
            (book) => book.id === id && book.authorAdress === address
          );
          if (!authorDetails) {
            throw new Error(
              `Author with id:${id} and address:${address} not found.`
            );
          }
          return authorDetails;
        } catch (error) {
          console.error("Error in resolving 'Author':", error.message);
          throw new Error(error.message || "An unexpected error occurred");
        }
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        return books;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        author_name: { type: GraphQLString },
        author_address: { type: GraphQLString },
      },
      resolve(_, { author_name, author_address }) {
        try {
          const query = `INSERT INTO authors (author_name, author_address) VALUES (?, ?)`;
          const [result] = conn.query(query, [author_name, author_address]);
          console.log(`inserted result`, result);

          if (result.affectedRows > 0) {
            const selectQuery = `SELECT * FROM authors WHERE id = ?`;
            const [rows] = conn.execute(selectQuery, [result.insertId]);
            return rows[0];
          }

          throw new Error(`[Error]: Failed to insert author`);
        } catch (error) {
          console.error(`[Error]:`, error.message || error.sqlMessage);
          throw new Error(error.message || "An unexpected error occurred");
        }
      },
    },
  },
});
const BookSchema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

export default BookSchema;
