import { Button, Card, Form, Input, message, Modal, Select, Table, Tree, Transfer } from "antd";
import { useState, useEffect, useRef, forwardRef } from "react";
import Axios from "../../axios";
import Utils from "../../utils/utils";
import menuConfig from "../../config/menuConfig";
const Option = Select.Option;
const params = { page: 1 };
const Permission = () => {
    const form = useRef();
    const userForm=useRef();
    const perEdit = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [pagination, setPagination] = useState(false);
    const [flag, setFlag] = useState(true);
    //单选
    const [rowKey, setRowKey] = useState([]);
    const [rowItem, setRowItem] = useState({});
    const [isShow, setIsShow] = useState(false);
    //设置权限：模态框
    const [showPerm, setShowPerm] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState([]);//节点树选中的Key,默认为数组形式
    //用户授权
    const [userShow, setUserShow] = useState(false);
    //用户授权
    const [mockData, setMockData] = useState([]);
    const [targetKeys, setTargetKeys] = useState([]);
    useEffect(() => {
        Axios.ajax({
            url: "/role/list",
            data: { params }
        }).then(res => {
            if (res.code === 0) {
                res.result.item_list.map((item, index) => {
                    item.key = index;
                })
                setDataSource(res.result.item_list);
                setPagination(Utils.pagination(res, (current) => {//实现分页
                    params.page = current;
                    setFlag(!flag);
                }))
            }
        })
    }, [flag])
    //单选
    const onhandleClick = (record, index) => {
        let key = [index];
        setRowKey(key);
        setRowItem(record);
    }
    //创建角色
    const onOk = () => {
        let list = form.current.getFieldsValue();
        Axios.ajax({
            url: "/role/create",
            data: { params: { list } },
        }).then(res => {
            if (res.code === 0) {
                setIsShow(false);
                message.success("用户创建成功");
                setFlag(!flag);
            }
        })
    }
    //权限设置
    const onhandlePrem = () => {
        if (!rowItem.id) {
            Modal.info({
                title: "提示",
                content: "请选择用户"
            })
            return;
        }
        setShowPerm(true);
        setCheckedKeys(rowItem.menuType);
    }
    //权限设置确认
    const onhandlePerEdit = () => {
        let data = perEdit.current.getFieldsValue();
        data.id = rowItem.id;
        data.menus = checkedKeys;
        Axios.ajax({
            url: "/permission/edit",
            data: { params: data }
        }).then(res => {
            if (res.code === 0) {
                message.success("权限修改成功");
                setShowPerm(false);
                setRowItem({});
                setRowKey([]);
                setFlag(!flag);
            }
        })
    }
    //用户设置
    const handleUserSubmit = () => {
        if (!rowItem.id) {
            Modal.info({
                title: "提示",
                content: "请选择用户"
            })
            return;
        }
        Axios.ajax({
            url: "/role/user_list",
            data: { params: { id: rowItem.id } }
        }).then(res => {
            if (res.code === 0) {
                setUserShow(true);
                getRoleUserList(res.result);
            }
        })

    }
    //用户权限确认
    const onhandleUserSubmit=()=>{
      let data=userForm.current.getFieldsValue();
      data.role_id=rowItem.id;
      data.user_ids=targetKeys;
      Axios.ajax({
          url:"/role/user_role_edit",
          data:{params:data},
      }).then(res=>{
          if(res.code===0){
              message.success("用户权限设置成功");
              setUserShow(false);
              setRowItem({});
              setRowKey([]);
          }
      })
    }
    //筛选获取到的用户
    const getRoleUserList = (dataSource) => {
        const mockData = [];
        const targetKey = [];
        if (dataSource && dataSource.length > 0) {
            dataSource.map(item => {
                const data = {
                    key: item.user_id,
                    title: item.user_name,
                    status: item.status,
                }
                if (data.status === 1) {
                    targetKey.push(data.key);
                }
                mockData.push(data);
            })
        }
        setMockData(mockData);
        setTargetKeys(targetKey);
    }
    const columns = [
        { title: "角色ID", dataIndex: "id", align: "center" },
        { title: "角色名称", dataIndex: "role_name", align: "center" },
        { title: "使用状态", dataIndex: "status", align: "center", render(text) { return text === 1 ? "启用" : "停用" } },
        { title: "授权人", dataIndex: "authorize_user_name", align: "center" },
        {
            title: "授权时间", dataIndex: "authorize_time", align: "center",
            render(text) { return Utils.formateDate(text) }
        },
        {
            title: "创建时间", dataIndex: "create_time", align: "center",
            render(text) { return Utils.formateDate(text) }
        }
    ]
    const rowSelection = {
        type: "radio",
        selectedRowKeys: rowKey
    }
    const formItenList = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 }
    }
    return (
        <div style={{ width: "100%" }}>
            <Card title="权限设置" className="operate-wrap">
                <Button type="primary" onClick={() => setIsShow(true)}>创建角色</Button>
                <Button type="primary" onClick={onhandlePrem}>权限设置</Button>
                <Button type="primary" onClick={handleUserSubmit}>用户授权</Button>
            </Card>
            <Card>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    onRow={(record, index) => ({
                        onClick: () => {
                            onhandleClick(record, index)
                        }
                    })}
                />
            </Card>
            <Modal
                title="创建角色"
                visible={isShow}
                onCancel={() => setIsShow(false)}
                onOk={onOk}
            >
                <Form ref={form}>
                    <Form.Item label="用户名" name="userName" {...formItenList}>
                        <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item label="状态" name="status" {...formItenList}>
                        <Select>
                            <Option value="1">开启</Option>
                            <Option value="2">关闭</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="设置权限"
                visible={showPerm}
                onCancel={() => setShowPerm(false)}
                onOk={onhandlePerEdit}
            >
                <PerEditForm
                    userInfo={rowItem}
                    checkedKeys={checkedKeys}
                    patchMenuInfo={(checkedKeys) => setCheckedKeys(checkedKeys)}
                    ref={perEdit}
                />
            </Modal>
            <Modal
                title="用户授权"
                visible={userShow}
                onCancel={() => setUserShow(false)}
                onOk={onhandleUserSubmit}
            >
                <RoleAuthForm
                    userInfo={rowItem}
                    mockData={mockData}
                    targetKeys={targetKeys}
                    changeUserInfo={(targetKeys) => setTargetKeys(targetKeys)}
                    ref={userForm}
                />
            </Modal>
        </div>
    );
}
// 权限设置
const PerEditForm = forwardRef((props, ref) => {
    const formItenList = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 }
    }
    const { userInfo, checkedKeys } = props;
    const onCheck = (checkedKeys) => {
        props.patchMenuInfo(checkedKeys)
    }
    return (
        <Form ref={ref}>
            <Form.Item label="角色名称" name="userName" {...formItenList} initialValue={userInfo.role_name}>
                <Input disabled />
            </Form.Item>
            <Form.Item label="状态" name="status" {...formItenList} initialValue={userInfo.status}>
                <Select>
                    <Option value={0}>开启</Option>
                    <Option value={1}>关闭</Option>
                </Select>
            </Form.Item>
            <Tree
                checkable
                treeData={menuConfig}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
            />
        </Form>
    )

});
//用户授权
const RoleAuthForm = forwardRef((props, ref)=> {
    //实现搜索框功能
    const filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    }
    //实现用户左右调用
    const handleChange = (targetKey) => {
        // console.log(targetKey)
        props.changeUserInfo(targetKey);
    }
    const formItenList = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 }
    }
    const { userInfo, mockData, targetKeys } = props;
    return (
        <Form ref={ref}>
            <Form.Item label="角色名称" name="role_id" {...formItenList} initialValue={userInfo.role_name}>
                <Input disabled />
            </Form.Item>
            <Form.Item label="选择用户">
                <Transfer
                    showSearch
                    titles={['待选用户', '已选用户']}
                    dataSource={mockData}
                    targetKeys={targetKeys}
                    render={(record) => record.title}
                    filterOption={filterOption}
                    onChange={handleChange}
                />
            </Form.Item>
        </Form>
    )
})
export default Permission;
