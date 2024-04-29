import CurrentBooks from '../components/CurrentBooks';
import SavedBooks from '../components/SavedBooks';
import FinishedBooks from '../components/FinishedBooks';

const Library = () => {
    return (
        <>
            <h1>Library</h1>
            <div className="library-container">
                <SavedBooks />
                <CurrentBooks />
                <FinishedBooks />
            </div>
        </>
    );
}

export default Library;
