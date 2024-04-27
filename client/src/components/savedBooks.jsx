import { useQuery } from "@apollo/client"
import { SAVED_BOOKS } from "../../utils/queries"

import { useEffect } from "react";


const SavedBooks = () => {

    const { loading, data, refetch } = useQuery(SAVED_BOOKS);

    useEffect(() => {
        refetch()
    }, []);

    const user = data || [];

    if(loading){
        return <div>Loading...</div>
    };

    if(!user?.savedBooks.savedBooks){
        return (
            <h1>You need to be logged in to see this</h1>
        )
    };

    // const userSavedBooks = user.savedBooks.savedBooks;

    return (
        <>
            <h1>book</h1>
        </>
    )

}

export default SavedBooks;