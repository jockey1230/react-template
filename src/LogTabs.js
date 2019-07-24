import React from "react";
import {observer} from 'mobx-react';
import {Tabs} from 'antd';
import LogContent from "./LogContent";

const {TabPane} = Tabs;

@observer
class LogTabs extends React.Component {

    uiState = null;

    constructor(props) {
        super(props);
        this.uiState = props.uiState
    }

    onChange = activeKey => {
        this.uiState.changeLogStore(activeKey)
    };

    onEdit = (targetKey, action) => {
        if (action === "remove") {
            this.uiState.removeLogStore(targetKey)
        }
    };

    render() {
        return (
            <Tabs style={{height: '100%'}}
                  onChange={this.onChange}
                  hideAdd={true}
                  activeKey={this.uiState.activeLogStore.key}
                  onEdit={this.onEdit}
                  type="editable-card"
            >
                {this.uiState.openedLogStores.map(logStore => (
                    <TabPane tab={logStore.logStore} key={logStore.key} closable={true}>
                        <LogContent logStore={logStore}/>
                    </TabPane>
                ))}
            </Tabs>
        );
    }
}

export default LogTabs