import React from "react";
import {gql, useApolloClient, useQuery} from "@apollo/client";
import {delay} from "./graphql/link";

const ALL_PEOPLE = gql`
    query AllPeople {
        people {
            _id
            name
        }
    }
`;

const SEARCH_RESULT_CACHED = gql`
    query searchResultsCached {
        searchResultsCached
    }
`;


export default function App() {
    const {
        loading,
        data
    } = useQuery(ALL_PEOPLE);


    const client = useApolloClient();

    const result = {
        hits: [
            {objectID: 1, name: 'John Smith', _highlightResult: {}},
            {objectID: 4, name: 'Sara Smith', _highlightResult: {}},
            {objectID: 9, name: 'Budd Deey', _highlightResult: {}},
        ]
    }

    client.writeQuery({
        query: SEARCH_RESULT_CACHED,
        data: {
            // Maybe searchResultsCached just needs to be an array?
            searchResultsCached: result.hits.map((val) => {
                const copy = JSON.parse(JSON.stringify(val));
                delete copy._highlightResult;
                delete copy.objectID;
                return {...copy, _id: val.objectID, __typename: "User"};
            }),
        },
    });

    delay(300).then(() => {
        client
            .query({
                query: SEARCH_RESULT_CACHED,
            })
            .then((value) => {
                console.log(client.cache.extract());
            });
    })

    return (
        <main>
            <h1>Apollo Client Issue Reproduction</h1>
            <p>
                This application can be used to demonstrate an error in Apollo Client.
            </p>
            <h2>Names</h2>
            {loading ? (
                <p>Loading…</p>
            ) : (
                <ul>
                    {data.people.map(person => (
                        <li key={person._id}>{person.name}</li>
                    ))}
                </ul>
            )}
        </main>
    );
}
