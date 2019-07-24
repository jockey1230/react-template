import React from "react";
import {observer} from 'mobx-react';
import {observable, action, runInAction} from 'mobx';
import Log from "./service/log"
import {Table, Input, Tooltip, Button, Dropdown, Menu, Icon, Drawer, DatePicker} from 'antd';
import moment from "moment"

import "./LogContent.less"

const {Search} = Input;
const {Column} = Table;
const {RangePicker} = DatePicker;

@observer
class LogContent extends React.Component {

    times = [{
        name: '今天',
        value: 0
    }, {
        name: '1分钟',
        value: 1
    }, {
        name: '15分钟',
        value: 15
    }, {
        name: '30分钟',
        value: 30
    }, {
        name: '1小时',
        value: 60
    }, {
        name: '6小时',
        value: 6 * 60
    }, {
        name: '12小时',
        value: 12 * 60
    }, {
        name: '1天',
        value: 24 * 60
    }, {
        name: '1周',
        value: 24 * 60 * 7
    }, {
        name: '自定',
        value: -1
    }];

    @observable
    selectRangeDates = []

    @observable drawerVisible = false;

    @action
    openDrawer(visible) {
        this.drawerVisible = visible
    }

    componentWillMount() {
        this.log = new Log(this.props.logStore)
        this.log.afterLoading(append => {
            if (!append && this.container) {
                this.container.scrollTo(0, 0)
            }
        })
        this.log.reload()
    }

    handleOnChange = (pagination, filters, sorter) => {
        this.log.setReverse(!(sorter.order && sorter.order === "ascend")).reload()
    };

    handleSearch = (value) => {
        this.log.setQueryExp(value).reload()
    };

    handleTimeMenuClick = (e) => {
        let time = this.times[parseInt(e.key)].value
        if (time > 0) {
            this.log.setStart(moment().subtract(time, "minute")).setEnd(moment()).reload()
        } else if (time === 0) {
            this.log.setStart(moment().hour(0).minute(0)).setEnd(moment()).reload()
        } else if (time === -1) {
            this.openDrawer(true)
        }
    };

    @action
    handleTimeDrawerSubmit() {
        this.drawerVisible = false;
        if (this.selectRangeDates.length > 0) {
            this.log.setStart(this.selectRangeDates[0]).setEnd(this.selectRangeDates[1]).reload()
        }
    }

    onScrollEvent() {
        if (this.log.list.length > 0 &&
            this.container.scrollTop + this.container.clientHeight === this.container.scrollHeight) {
            this.log.nextPage()
        }
    }

    render() {
        return (
            <div className={"log_content"}>
                <div className={"search_box"}>
                    <div className={"query_exp_input"}>
                        <Search allowClear placeholder="查询表达式" onSearch={this.handleSearch} enterButton suffix={
                            <Tooltip title={
                                <a className={"search_tooltip_a"}
                                   href={'https://www.alibabacloud.com/help/zh/doc-detail/29060.htm'}
                                   target="_blank" rel="noopener noreferrer">点击查看查询语法</a>}>
                                <Icon type="question-circle" style={{color: 'rgba(0,0,0,.45)'}}/>
                            </Tooltip>
                        }/>
                    </div>
                    <Dropdown className={"query_time_btn"} overlay={
                        <Menu onClick={this.handleTimeMenuClick}>
                            {
                                this.times.map((time, idx) =>
                                    <Menu.Item key={idx}>{time.name}</Menu.Item>
                                )
                            }
                        </Menu>}>
                        <Button>
                            {this.log.start.format("YYYY-MM-DD HH:mm:ss") + "~" + this.log.end.format("YYYY-MM-DD HH:mm:ss")}
                            <Icon type="down"/>
                        </Button>
                    </Dropdown>
                </div>
                <div className={"log_container"}
                     onScrollCapture={() => this.onScrollEvent()}
                     ref={c => (this.container = c)}>
                    <Table
                        dataSource={this.log.list} loading={this.log.loading}
                        pagination={false}
                        onChange={this.handleOnChange}>
                        <Column width={180} title="时间" dataIndex="__time__"
                                defaultSortOrder={'descend'}
                                key={"key"}
                                sorter={true}
                                render={(text, record) => (
                                    <span>{moment(parseInt(record.__time__) * 1000).format("YYYY-MM-DD hh:mm:ss")}</span>
                                )}/>
                        <Column title="内容" dataIndex="content"/>
                    </Table>
                </div>
                <Drawer
                    title="自定义时间"
                    placement="right"
                    width={400}
                    closable={true}
                    onClose={() => this.openDrawer(false)}
                    visible={this.drawerVisible}>
                    <RangePicker
                        showTime
                        format="YYYY/MM/DD HH:mm:ss"
                        onChange={dates => {
                            runInAction(() => {
                                this.selectRangeDates = dates
                            })
                        }}/>
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                        }}>
                        <Button disabled={this.selectRangeDates.length === 0}
                                onClick={() => this.handleTimeDrawerSubmit()}
                                type="primary">
                            确定
                        </Button>
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default LogContent