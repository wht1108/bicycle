import React from "react";
import { Select } from "antd";
const { Option } = Select;
export default{
    formateDate(time){
        if(!time) return "";
        let date=new Date(time);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
    pagination(data,callback){
        //调用一个接口，返回一个数据，当前页数以及返回的总数据
        //当点击下一页时，去回调一个函数，获取页码
        return {
            onChange:current=>{
                callback(current)
            },
            current:data.result.page,
            pageSize:data.result.page_size,
            total:data.result.total_count,
            showTotal:()=>{
                return `共${data.result.total_count}条`
            },
            showQuickJumper:true//是否可以快速跳转到某页
        }
    },
    getOptionList(data) {
        if (!data) {
            return [];
        }
        let options = [];//[<Option value="0" key="all_key">全部</Option>]
        data.map(item => {
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    },
    updateSelectedItem(selectedRowKeys, selectedItem, selectedIds) {
        if (selectedIds) {
            console.log(selectedRowKeys);
            this.setState({
                selectedRowKeys,
                selectedItem,
                selectedIds
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem
            })
        }

    }
}