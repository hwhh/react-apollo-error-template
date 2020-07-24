import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const peopleData = [
  { _id: 1, name: 'John Smith' },
  { _id: 2, name: 'Sara Smith' },
  { _id: 3, name: 'Budd Deey' },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
  },
});



export const schema = new GraphQLSchema({ query: QueryType });
