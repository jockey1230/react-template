import React from "react";
import {observer} from 'mobx-react';
import {Menu, Icon} from 'antd';
import clients from "./service/clients"

const {SubMenu} = Menu;

@observer
class LogMenu extends React.Component {

    constructor(props) {
        super(props);
        this.uiState = props.uiState;
        clients.init();
    }

    handleClickMenuItem(client, project, store) {
        this.uiState.openLogStore(client, project, store)
    }

    render() {
        return (<Menu theme="dark" mode="inline">
            {
                clients.list.map(client =>
                    <SubMenu
                        key={client.name}
                        title={<span><Icon type="file-text"/><span>{client.name}</span></span>}>
                        {
                            client.projects.map(project =>
                                <SubMenu
                                    key={`${client.name}-${project.name}`}
                                    title={<span><Icon
                                        type="project"/><span>{project.name}</span></span>}>
                                    {
                                        project.logstore.map(store =>
                                            <Menu.Item onClick={() => this.handleClickMenuItem(client, project, store)}
                                                       key={`${client.name}/${project.name}/${store}`}><span><Icon
                                                type="database"/>{store}</span></Menu.Item>
                                        )
                                    }
                                </SubMenu>
                            )
                        }
                    </SubMenu>
                )
            }
        </Menu>)
    }
}

export default LogMenu