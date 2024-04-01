import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './MainPage';
import PrivateChats from './PrivateChats';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/:username/mainpage" render={(props) => <MainPage username={props.match.params.username} />} />
                <Route path="/:username/private-chats/:contactId" render={(props) => <PrivateChats username={props.match.params.username} contactId={props.match.params.contactId} />} />
            </Switch>
        </Router>
    );
};

export default App;