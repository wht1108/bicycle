import { Card, Form, Button, Input, DatePicker, Table, Modal, Radio, Select, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useRef, forwardRef, useEffect } from "react";
import moment from "moment";
import Axios from "../../axios";
import Utils from "../../utils/utils";
const Option = Select.Option;
const params = { page: 1 };
const User = () => {
    const form = useRef();
    const user = useRef();
    const [flag, setFlag] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState(false);
    const [rowKey, setRowKey] = useState([]);
    const [rowItem, setRowItem] = useState([]);
    const [isShow, setIsShow] = useState(false);//是否显示模态框
    const [types, setTypes] = useState("");//存储模态框类型
    const [title, setTitle] = useState("");//模态框标题
    useEffect(() => {
        Axios.ajax({
            url: "/user/list1",
            data: { params }
        }).then(res => {
            res.result.item_list.map((item, index) => {
                item.key = index;
            })
            setDataSource(res.result.item_list);
            setPagination(Utils.pagination(res, (current) => {//实现分页
                params.page = current;
                setFlag(!flag);
            }))
        })
    }, [])
    const onUserSearch = (() => {
        // console.log("form", form);
        const list = form.current.getFilesValue();
        Axios.ajax({
            url: "/user/list1",
            data: { params: { list } }
        }).then(res => {
            setFlag(!flag);
        })
    }, [flag])
    // 点击单选
    const onhandleClick = (record, index) => {
        let key = [index];
        setRowKey(key);
        setRowItem(record);

    }
    // 四个按钮
    const onhandleSubmit = (type) => {
        if (type !== "create") {
            if (!rowItem.id) {
                Modal.info({
                    title: "提示",
                    content: "请选择一条数据",
                });
                return;//终止函数进行
            }
        }
        switch (type) {
            case "create":
                setIsShow(true);
                setTypes(type);
                setTitle("创建员工");
                break;
            case "edit":
                setIsShow(true);
                setTypes(type);
                setTitle("编辑员工");
                break;
            case "detail":
                setIsShow(true);
                setTypes(type);
                setTitle("员工详情");
                break;
            case "delete":
                Modal.confirm({
                    title:"确认删除",
                    content:"是否删除当前员工",
                    onOk(){
                        Axios.ajax({
                            url:"/user/delete",
                            data:{params:{rowId:rowItem.id}}
                        }).then(res=>{
                            if(res.code===0){
                                message.success("用户删除成功");
                                setRowItem({});
                                setRowKey([]);
                                setFlag(!flag);
                            }
                        })
                    }
                })
                break;
                
        }
    }
    const onSubmit = () => {
        console.log(user.current)
        const list = user.current.getFieldsValue();
        Axios.ajax({
            url: types==="create"?"/user/add":"user/edit",
            data: { params: list }
        }).then(res => {
            if (res.code === 0) {
                message.success("操作成功");
                setIsShow(false);
                user.current.resetFields();
                setRowKey([]);
                setRowItem({});
                setFlag(flag);
            }
        })
    }
    //表头
    const columns = [
        { title: "id", dataIndex: "id", align: "center" },
        { title: "用户名", dataIndex: "userName", align: "center" },
        {
            title: "性别", dataIndex: "sex", align: "center",
            render(text) {
                return text === 1 ? "男" : "女";
            }
        },
        { title: "状态", dataIndex: "state", align: "center" },
        { title: "爱好", dataIndex: "interest", align: "center" },
        {
            title: "婚姻状态", dataIndex: "isMarried", align: "center",
            render(text) {
                return text === 1 ? "已婚" : "未婚";
            }
        },
        { title: "生日", dataIndex: "birthday", align: "center" },
        { title: "地址", dataIndex: "address", align: "center" },
        { title: "早起时间", dataIndex: "time", align: "center" },
    ];
    const rowSelection = {
        type: "radio",
        selectedRowKeys: rowKey
    }
    let footer={};
    if(types==="detail"){
        footer={footer:null};
    }
    return (
        <div style={{ width: "100%" }}>
            <Card>
                <FormList ref={form} onUserSearch={onUserSearch} />
            </Card>
            <Card style={{ marginTop: 10 }} className="operate-wrap">
                <Button type="primary" icon={<PlusOutlined />} onClick={() => onhandleSubmit("create")}>创建员工</Button>
                <Button type="primary" icon={<EditOutlined />} onClick={() => onhandleSubmit("edit")}>编辑员工</Button>
                <Button type="primary" onClick={() => onhandleSubmit("detail")}>员工详情</Button>
                <Button type="primary" icon={<DeleteOutlined />} onClick={() => onhandleSubmit("delete")}>删除员工</Button>
            </Card>
            <div className="content-wrap">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    onRow={(record, index) => ({
                        onClick: e => {
                            onhandleClick(record, index)
                        }
                    })}
                />
            </div>
            <Modal
                title={title}
                visible={isShow}
                onCancel={() => setIsShow(false)}
                onOk={onSubmit}
                {...footer}
            >
                <UserForm ref={user} userInfo={rowItem} types={types} />
            </Modal>
        </div>
    );
}
const FormList = forwardRef((props, ref) => {
    const { onUserSearch } = props;
    return (
        <Form layout="inline" ref={ref}>
            <Form.Item label="用户" name="username">
                <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="密码" name="password">
                <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item label="入职时间" name="time">
                <DatePicker placeholder="请选择入职时间" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={onUserSearch}>查询</Button>
                <Button style={{ margin: "0 20px" }} onClick={() => ref.current.resetFields()}>重置</Button>
            </Form.Item>
        </Form>
    )
});
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
}
const UserForm = forwardRef((props, ref) => {
    const { userInfo, types } = props;
    console.log("userInfo", userInfo);
    return (
        <Form ref={ref}>
            <Form.Item label="用户名" name="name" {...formItemLayout} initialValue={userInfo.userName}>
                {types === "detail" ? userInfo.userName :
                    <Input placeholder="请输入用户名" />
                }

            </Form.Item>
            <Form.Item label="性别" name="sex" {...formItemLayout} initialValue={userInfo.sex}>
                {types === "detail" ? userInfo.sex :
                    <Radio.Group>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                    </Radio.Group>
                }

            </Form.Item>
            <Form.Item label="状态" name="status" {...formItemLayout} initialValue={userInfo.state}>
                {types === "detail" ? userInfo.state :
                    <Select>
                        <Option value={1}>咸鱼一条</Option>
                        <Option value={2}>风华浪子</Option>
                        <Option value={3}>北大才子一枚</Option>
                        <Option value={4}>百度FE</Option>
                        <Option value={5}>创业者</Option>
                    </Select>
                }

            </Form.Item>
            <Form.Item label="生日" name="birthday" {...formItemLayout} initialValue={moment(userInfo.birthday)}>
                {types === "detail" ? userInfo.birthday :
                    <DatePicker />
                }
            </Form.Item>
            <Form.Item label="联系地址" name="address" {...formItemLayout} initialValue={userInfo.address}>
                {
                    types === "detail" ? userInfo.address :
                        <Input.TextArea />
                }

            </Form.Item>
        </Form>
    )
})
export default User;