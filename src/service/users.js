import {observable, action} from 'mobx';
import axios from "axios"

class Users {
    // @observable list = [];
    // @observable loading = false;
    // @observable taskStatus = 0;
    //
    // @action.bound
    // async updateStatus(user) {
    //     user.status = user.status === 0 ? 1 : 0;
    //     await axios.post("/users", user)
    //     this.reload()
    // }
}

const users = new Users();
export default users;