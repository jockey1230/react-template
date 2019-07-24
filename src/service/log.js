import {observable, action, runInAction} from 'mobx';
import axios from "axios"
import moment from "moment"

class Log {

    @observable list = [];
    @observable loading = false;

    maxLineNum = 50;
    queryExp = "";
    reverse = true;
    offset = 0;

    constructor(logStore) {
        this.logStore = logStore;
        this.end = moment();
        this.start = moment().subtract(1, 'days');
    }

    afterLoading(func) {
        this.afterLoadingListener = func
    }

    @action
    async reload(append) {
        let logStore = this.logStore
        this.loading = true
        if (!append) {
            this.offset = 0
        }

        axios.get("/clients/" + logStore.client.name + "/projects/" + logStore.project.name + "/" + logStore.logStore, {
            params: {
                maxLineNum: this.maxLineNum,
                offset: this.offset,
                queryExp: this.queryExp,
                reverse: this.reverse,
                start: this.start.unix(),
                end: this.end.unix()
            }
        }).then(resp => {
            runInAction(() => {
                resp.data.logs.map((log, idx) => log.key = this.offset + "-" + idx);
                if (append) {
                    this.list = this.list.concat(resp.data.logs)
                } else {
                    this.list = resp.data.logs
                }
            })
            if (this.afterLoadingListener) {
                this.afterLoadingListener(append)
            }
        }).finally(() => {
            runInAction(() => {
                this.loading = false
            })
        })
    }

    setMaxLineNum(maxLineNum) {
        this.maxLineNum = maxLineNum;
        return this
    }

    nextPage() {
        this.offset += this.maxLineNum;
        this.reload(true)
    }

    @action
    setQueryExp(queryExp) {
        this.queryExp = queryExp;
        return this
    }

    @action
    setReverse(reverse) {
        this.reverse = reverse;
        return this
    }

    @action
    setStart(start) {
        this.start = start;
        return this
    }

    @action
    setEnd(end) {
        this.end = end;
        return this
    }


}

export default Log;