import React from "react";
import {observer} from 'mobx-react';
import {observable, action, runInAction} from 'mobx';
import Log from "./service/log"
import {
    Table,
    Input,
    Tooltip,
    AutoComplete,
    Button,
    Dropdown,
    Menu,
    Icon,
    Drawer,
    DatePicker,
    Select
} from 'antd';
import moment from "moment"

import "./LogContent.less"

const {Search} = Input;
const InputGroup = Input.Group;
const {Column} = Table;
const {RangePicker} = DatePicker;
const {Option} = Select;

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

    @observable rowInfoDrawerVisible = false;
    @observable selectedRow = [];

    @action
    openRowInfoDrawer(visible, row) {
        this.rowInfoDrawerVisible = visible;
        let dataSource = []
        if (row) {
            for (let key in row) {
                if (key === "key") {
                    continue
                }
                dataSource.push({
                    key: key,
                    value: row[key]
                })
            }
        }
        this.selectedRow = dataSource
    }

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
                    <div className={"query_input"}>
                        <InputGroup compact>
                            <AutoComplete
                                className="certain-category-search"
                                dropdownClassName="certain-category-search-dropdown"
                                dropdownMatchSelectWidth={false}
                                dropdownStyle={{
                                    width: 200, overflow: 'hidden',
                                    textVerflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                                dataSource={this.log.history.map((opt, idx) => (
                                    <Option key={idx} value={opt}>
                                        <span className="certain-search-item-count">{opt}</span>
                                        <div style={{float: "right", fontSize: 12, color: '#1890ff'}}
                                             onClick={e => {
                                                 console.info(e)
                                                 e.stopPropagation();
                                                 e.nativeEvent.stopImmediatePropagation();
                                                 this.log.removeHistory(opt)
                                             }}>删除
                                        </div>
                                    </Option>
                                ))}
                                onChange={value => this.log.topic = value}
                                placeholder="服务名"
                                optionLabelProp="value">
                            </AutoComplete>
                            <Search allowClear placeholder="查询表达式" onSearch={this.handleSearch} enterButton suffix={
                                <Tooltip title={
                                    <a className={"search_tooltip_a"}
                                       href={'https://www.alibabacloud.com/help/zh/doc-detail/29060.htm'}
                                       target="_blank" rel="noopener noreferrer">点击查看查询语法</a>}>
                                    <Icon type="question-circle" style={{color: 'rgba(0,0,0,.45)'}}/>
                                </Tooltip>
                            }/>
                        </InputGroup>
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
                        <Column dataIndex="key" key={"key"}/>
                        <Column onClick={(record) => {
                            this.openRowInfoDrawer(true, record)
                        }} width={180} title="时间" dataIndex="__time__"
                                defaultSortOrder={'descend'}
                                sorter={true}
                                render={(text, record) => (
                                    <div>
                                        <span>{moment(parseInt(record.__time__) * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
                                    </div>
                                )}/>
                        <Column title="级别" dataIndex="level"/>}
                        <Column title="内容" dataIndex="message"
                                render={(text, record) => <div className={"message"}>{text}</div>}
                        />
                        <Column render={(record) => <Icon onClick={() => this.openRowInfoDrawer(true, record)}
                                                          style={{cursor: 'pointer'}} type="profile"/>}/>}
                    </Table>
                </div>
                <Drawer
                    title="详情"
                    placement="right"
                    width={'70%'}
                    closable={true}
                    onClose={() => this.openRowInfoDrawer(false)}
                    visible={this.rowInfoDrawerVisible}>
                    <Table dataSource={this.selectedRow}
                           size={"small"}
                           className={"table_row_info"}
                           pagination={false}
                           columns={[
                               {
                                   title: 'Key',
                                   dataIndex: 'key',
                               }, {
                                   title: 'Value',
                                   dataIndex: 'value'
                               }
                           ]}/>
                </Drawer>
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