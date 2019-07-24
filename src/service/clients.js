import {observable, action,runInAction} from 'mobx';
import axios from "axios"

class Clients {
    @observable list = [];
    @observable loading = false;

    @action.bound
    async init() {
        let clients = await axios.get("/clients")
        clients.data && clients.data.forEach(client => {
            axios.get("/clients/" + client.name + "/projects").then(projects => {
                runInAction(()=>{
                    this.list.push({
                        name: client.name,
                        projects: projects.data
                    })
                })
            })
        })
    }
}

const clients = new Clients();
export default clients;