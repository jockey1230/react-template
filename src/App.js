import React from 'react';
import {observer} from 'mobx-react';
import users from "./service/users"
import './App.less';

@observer
class App extends React.Component {

    constructor(props) {
        super(props);
        users.reload();
        users.initTaskStatus();
    }

    render() {
        return (
            <div className="App">
            </div>
        );
    }
}

export default App