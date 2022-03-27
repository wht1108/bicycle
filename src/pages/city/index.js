import { Form, Select, Button, Card, Table, Radio, Modal, message } from "antd";
import { forwardRef, useEffect, useRef, useState } from "react";
import Axios from "../../axios";
import Utils from "../../utils/utils";
const Option = Select.Option;
const params = { page: 1 };
const City = () => {
    const form = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [flag, setFlag] = useState(true);
    // 获取表单数据
    useEffect(() => {
        Axios.ajax({
            url: "/open_city",
            data: { params: params }
        }).then(res => {
            console.log("得到的数据", res);
            res.result.item_list.map((item, index) => item.key = index);
            setDataSource(res.result.item_list);//数据源
            setPagination(Utils.pagination(res, (current) => {//实现分页
                params.page = current;
                setFlag(!flag);
            }))
        })
    }, [flag]);
    //“重置"按钮点击事件
    const onResetFields = () => {
        form.current.resetFields();
    }
    //确认开通城市
    const onSumbitCity = () => {
        const cityData = form.current.getFieldsValue();
        Axios.ajax({
            url: "/cityOpen",
            data: { params: cityData }
        }).then(res => {
            message.success(`恭喜你，${res.result}`);
            setOpenShow(false);
            setFlag(!flag);
        })
        setOpenShow(false)
    }
    const columns = [// 表格header数据
        { title: "城市id", dataIndex: "id", align: "center" },
        { title: "城市名称", dataIndex: "name", align: "center" },
        {
            title: "用车模式", dataIndex: "mode", align: "center",
            render(text) { return text === 1 ? "指定停车点模式" : "禁停区模式" }
        },
        {
            title: "营业模式", dataIndex: "op_mode", align: "center",
            render(text) { return text === 1 ? "自营" : "加盟" }
        },
        { title: "授权加盟商", dataIndex: "franchisee_name", align: "center" },
        {
            title: "城市管理员", dataIndex: "city_admins", align: "center",
            render(arr) {// 因为传过来的是数组组成的名字，需要进行遍历显示
                return arr.map(item => {
                    return item.user_name;
                }).join(",");
            }
        },
        { title: "城市开通时间", dataIndex: "open_time", align: "center" },
        {
            title: "操作时间", dataIndex: "update_time", align: "center",
            render(time) { return Utils.formateDate(time) }
        },
        { title: "操作人", dataIndex: "sys_user_name", align: "center" },
    ];


    return (
        <div style={{ width: "100%" }}>
            <Card>
                <FormList onResetFields={onResetFields} ref={form} />
            </Card>
            <Card style={{ marginTop: 10 }}>
                <Button type="primary" onClick={() => setOpenShow(true)}>开通城市</Button>
            </Card>
            <div className="content-wrap">
                <Table
                    bordered
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                />
            </div>
            <Modal
                title="开通城市"
                visible={openShow}
                onOk={onSumbitCity}
                onCancel={() => { setOpenShow(false) }}
            >
                <OpenCityForm ref={form} />
            </Modal>
        </div>
    );
}
const FormList = forwardRef((props, ref) => {
    const { onResetFields } = props;
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
            <Form.Item label="用车模式" name="mode" >
                <Select style={{ width: 100 }} placeholder="全部">
                    <Option value="0">全部</Option>
                    <Option value="1">指定停车模式</Option>
                    <Option value="2">禁停区模式</Option>
                </Select>
            </Form.Item>
            <Form.Item label="营业模式" name="op_mode"  >
                <Select style={{ width: 100 }} placeholder="全部">
                    <Option value="">全部</Option>
                    <Option value="1">自营</Option>
                    <Option value="2">加盟</Option>
                </Select>
            </Form.Item>
            <Form.Item label="加盟授权状态" name="auth_status"  >
                <Select style={{ width: 100 }} placeholder="全部">
                    <Option value="">全部</Option>
                    <Option value="1">已授权</Option>
                    <Option value="2">未授权</Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button style={{ margin: "0 20px" }} type="primary">查询</Button>
                <Button onClick={onResetFields}>重置</Button>
            </Form.Item>
        </Form>
    )

});
//开通城市
const OpenCityForm = forwardRef((props, ref) => {
    return (
        <Form ref={ref}>
            <Form.Item label="选择城市" name="city_id" initialValue={"2"}>
                <Select style={{ width: 100 }} placeholder="全部">
                    <Option value="0">全部</Option>
                    <Option value="1">天津市</Option>
                    <Option value="2">北京市</Option>
                </Select>
            </Form.Item>
            <Form.Item label="运营模式" name="op_mode" initialValue={"2"}>
                <Radio.Group>
                    <Radio value="1">自营</Radio>
                    <Radio value="2">加盟</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="用车模式" name="use_mode" initialValue={"1"}>
                <Radio.Group>
                    <Radio value="1">指定停车模式</Radio>
                    <Radio value="2">禁停区模式</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    )
})
export default City;