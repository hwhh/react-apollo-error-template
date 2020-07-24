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


    /**
     * HERE
     * objectID 1 should be mered i.e. the result should contain someOtherVal: 'hello'
     * all objects should be normalised
     */
    const result = {
        hits: [
            {objectID: 1, name: 'John Smith' , _highlightResult: {}, someOtherVal: 'hello'},
            {objectID: 4, name: 'Bilbo Baggins', _highlightResult: {}, someOtherVal: 'world'},
            {objectID: 9, name: 'John Doe', _highlightResult: {}, someOtherVal: 'foo'},
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
                return {...copy, _id: val.objectID.toString(), __typename: "Person"};
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
