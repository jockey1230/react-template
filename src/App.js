import React from 'react';
import {observer} from 'mobx-react';
import {Layout} from 'antd';
import {observable, action, runInAction} from 'mobx';
import LogMenu from "./LogMenu"
import './App.less';
import LogTabs from "./LogTabs";

const {Content, Sider} = Layout;

@observer
class App extends React.Component {

    render() {
        return (
            <div className="App">
                <Layout style={{minHeight: '100vh'}}>
                    <Sider>
                        <div className="logo"/>
                        <LogMenu uiState={uiState}/>
                    </Sider>
                    <Layout>
                        <Content style={{margin: '0 16px'}}>
                            <LogTabs uiState={uiState}/>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default App

class UIState {

    @observable openedLogStores = [];
    @observable activeLogStore = {};



    @action
    openLogStore(client, project, logStore) {
        runInAction(() => {
            let key = client.name + "/" + project.name + "/" + logStore;

            if (this.openedLogStores.filter(logStore => logStore.key === key && (this.activeLogStore = logStore)).length === 0) {
                let activeLogStore = {
                    key: key,
                    client: client,
                    project: project,
                    logStore: logStore
                };
                this.openedLogStores.push(activeLogStore);
                this.activeLogStore = activeLogStore
            }
        })
    }

    @action
    removeLogStore(key) {
        let target = -1;
        this.openedLogStores.forEach((logStore, idx) => logStore.key === key && (target = idx))
        if (target !== -1) {
            this.openedLogStores.splice(target, 1);
            this.activeLogStore = this.openedLogStores.length > 0 ? this.openedLogStores[0] : {}
        }
    }

    @action
    changeLogStore(key) {
        this.openedLogStores.forEach(logStore => logStore.key === key && (this.activeLogStore = logStore))
    }

}

const uiState = new UIState()