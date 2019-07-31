import {observable, action, runInAction} from 'mobx';
import axios from "axios"
import moment from "moment"
import localStorage from "localStorage"

class Log {

    @observable list = [];
    @observable loading = false;
    @observable history = [];

    maxLineNum = 50;
    queryExp = "";
    reverse = true;
    offset = 0;
    topic = "";

    constructor(logStore) {
        let history = localStorage.getItem(logStore.key);
        if (!history) {
            history = '[]'
        }

        runInAction(() => {
            this.history = JSON.parse(history);
        });
        this.logStore = logStore;
        this.end = moment();
        this.start = moment().subtract(1, 'days');
    }

    afterLoading(func) {
        this.afterLoadingListener = func
    }

    @action
    addHistory(item) {
        let index = this.history.indexOf(item);
        if (index === -1) {
            this.history.push(item);
            localStorage.setItem(this.logStore.key, JSON.stringify(this.history))
        }
    }

    @action
    removeHistory(item) {
        let index = this.history.indexOf(item)
        if (index !== -1) {
            this.history.splice(index, 1)
            localStorage.setItem(this.logStore.key, JSON.stringify(this.history))
        }
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
                end: this.end.unix(),
                topic: this.topic
            }
        }).then(resp => {
            runInAction(() => {
                resp.data.logs.map((log, idx) => log.key = this.offset + "-" + idx);
                if (append) {
                    this.list = this.list.concat(resp.data.logs)
                } else {
                    this.list = resp.data.logs;
                    if (this.topic && this.topic.replace(/(^s*)|(s*$)/g, "").length > 0) {
                        this.addHistory(this.topic);
                    }
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

    setTopic(topic) {
        this.topic = topic;
        return this;
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