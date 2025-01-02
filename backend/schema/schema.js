import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
} from 'graphql';
import { books } from '../data/booksData.js';

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    genre: { type: new GraphQLList(GraphQLString) },
    description: { type: GraphQLString },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    authorName: { type: GraphQLString },
    authorAdress: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        try {
          const bookData = books.find((book) => book.id === args.id);

          if (!bookData) {
            throw new Error(`Book with ID ${args.id} not found.`);
          }

          return bookData;
        } catch (error) {
          console.error('Error in resolving \'book\':', error.message);

          throw new Error(error.message || 'An unexpected error occurred.');
        }
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id, address = 'Banglore' }) {
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
          console.error('Error in resolving \'book\':', error.message);
          throw new Error(error.message || 'An unexpected error occurred');
        }
      },
    },
  },
});

const BookSchema = new GraphQLSchema({ query: RootQuery });

export default BookSchema;
