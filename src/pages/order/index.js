import { Form, Select, Button, Card, Table, DatePicker, Modal, message } from "antd";
import { forwardRef, useEffect, useRef, useState } from "react";
import Axios from "../../axios";
import Utils from "../../utils/utils";
const Option = Select.Option;
const params = { page: 1 };

const Order = () => {
    const form = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState(false);
    const [flag, setFlag] = useState(true);
    const [rowKey, setRowKey] = useState([]);
    const [rowItem, setRowItem] = useState({});
    //用车订单信息
    const [bikeInfo, setBikeInfo] = useState([]);
    const [showInfo, setShowInfo] = useState(false);
    useEffect(() => {
        Axios.ajax({
            url: "/order/list",
            data: { params }
        }).then(res => {
            console.log("res", res);
            res.result.item_list.map((item, index) => {
                item.key = index;
            })
            setDataSource(res.result.item_list);
            setPagination(Utils.pagination(res, (current) => {//实现分页
                params.page = current;
                setFlag(!flag);
            }))
        })
    }, [flag]);
    // 查询
    const onHaddleSearch = () => {
        const search = form.current.getFieldsValue();
        // console.log(form);
        Axios.ajax({
            url: "/order/list",
            data: { params: search }
        }).then(res => {
            if (res.code === 0) {
                setFlag(!flag);
            }
        })
    }
    // 点击行事件
    const onhaddleClickRow = (record, index) => {
        let key = [index];
        setRowKey(key);
        setRowItem(record);
    }
    const onhandleFinish = () => {
        if (!rowItem.id) {
            Modal.info({
                title: "提示",
                content: "请选择要结束的订单"
            })
            return;
        }
        Axios.ajax({
            url: "/order/ebike_info",
            data: { params: { itemId: rowItem.id } }
        }).then(res => {
            if (res.code === 0) {
                setBikeInfo(res.result);
                setShowInfo(true);

            }
        })
    }
    //确认结束用车订单
    const onOk = () => {
        Axios.ajax({
            url: "/finish_order",
            data: { params: { itemId: showInfo.bike_sn } }
        }).then(res => {
            message.success("订单结束成功")
            setShowInfo(false);
            setRowKey([]);
            setFlag(!flag);

        })
    }
    const columns = [
        { title: "订单编号", dataIndex: "order_sn", align: "center" },
        { title: "车辆编号", dataIndex: "bike_sn", align: "center" },
        { title: "用户名", dataIndex: "user_name", align: "center", width: 100 },
        { title: "手机号", dataIndex: "mobile", align: "center" },
        {
            title: "里程", dataIndex: "distance", align: "center",
            render(text) { return text / 1000 + "Km"; }
        },
        {
            title: "行驶时长", dataIndex: "total_time", align: "center",
            render(total_time) { return (total_time / 3600).toFixed(2) + "h" }
        },
        { title: "状态", dataIndex: "status", align: "center", width: 100 },
        { title: "开始时间", dataIndex: "start_time", align: "center" },
        { title: "结束时间", dataIndex: "end_time", align: "center" },
        { title: "订单金额", dataIndex: "total_fee", align: "center", width: 100 },
        { title: "实付金额", dataIndex: "user_pay", align: "center", width: 100 },
    ];
    //订单详情
    const onhandleDetail=()=>{
        if (!rowItem.id) {
            Modal.info({
                title: "提示",
                content: "请选择订单"
            })
            return;
        }
        window.open(`/#/common/order/detail/${rowItem.id}`,"_blank");
    }
    //单选按钮配置
    const rowSelection = {
        type: "radio",
        selectedRowKeys: rowKey
    }
   const formItemLayout={
       labelCol:{span:5},
       wrapperCol:{span:19},
   }
    return (
        <div style={{ width: "100%" }}>
            <Card>
                <FormList ref={form} onHaddleSearch={onHaddleSearch} />
            </Card>
            <Card style={{ marginTop: 10 }}>
                <Button type="primary" style={{ margin: "0 20px" }} onClick={onhandleDetail}>订单详情</Button>
                <Button type="primary" onClick={onhandleFinish}>结束订单</Button>
            </Card>
            <div className="content-wrap">
                <Table
                    bordered
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    onRow={(record, index) => ({
                        onClick: e => { onhaddleClickRow(record, index) },
                    })}
                />
            </div>
            <Modal
                title="结束订单"
                visible={showInfo}
                onCancel={() => { setShowInfo(false) }}
                onOk={onOk}
            >
                <Form.Item label="车辆编号" {...formItemLayout}>{bikeInfo.bike_sn}</Form.Item>
                <Form.Item label="剩余电量" {...formItemLayout}>{bikeInfo.battery}%</Form.Item>
                <Form.Item label="行程开始时间" {...formItemLayout}>{bikeInfo.start_time}</Form.Item>
                <Form.Item label="当前位置" {...formItemLayout}>{bikeInfo.location}</Form.Item>

            </Modal>
        </div>
    );
}
const FormList = forwardRef((props, ref) => {
    const { onHaddleSearch } = props
    return (
        <Form layout="inline" ref={ref}>
            <Form.Item label="城市" name="city" >
                <Select style={{ width: 100 }} placeholder="全部">
                    <Option value="1">全部</Option>
                    <Option value="2">北京</Option>
                    <Option value="3">天津</Option>
                    <Option value="4">上海</Option>
                </Select>
            </Form.Item>
            <Form.Item label="订单时间" name="mode" >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>
            <Form.Item label="~" name="mode" colon={false}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>
            <Form.Item label="订单状态" name="op_mode"  >
                <Select style={{ width: 100 }} placeholder="全部">
                    <Option value="">全部</Option>
                    <Option value="1">进行中</Option>
                    <Option value="2">行程结束</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button style={{ margin: "0 20px" }} type="primary" onClick={onHaddleSearch}>查询</Button>
                <Button onClick={() => ref.current.resetFields()}>重置</Button>
            </Form.Item>
        </Form>
    )

});

export default Order;