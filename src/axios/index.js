import axios from "axios";
import { Modal } from "antd";
import Utils from "../utils/utils";
export default class Axios {
    // 数据请求封装
    static requestList(_this, url, params, isMock) {
        let data = { params: params, isMock };
        this.ajax({
            url: url,
            data: data,
            isMock:isMock
        }).then(data => {
            if (data && data.result) {
                let list = data.result.item_list;
                list.map((items, index) => { items.key = index; return items });
                _this.setState({
                    list,
                    pagination: Utils.pagination(data, (current) => {
                        _this.params.page = current;
                        _this.requestList();
                    })
                });
            };
        })
    }
       // 数据请求封装
       static ajax(options) {
        let loading;
        if (options.data && options.data.isLoading !== false) {
            loading = document.getElementById("ajaxLoading");
            loading.style.display = "block";
        }
        let baseUrl;
        if (options.data.isMock) {
            baseUrl = "https://www.fastmock.site/mock/848eebc6348a60f19ecc6f2e1cdf8431/Mockapi";
        } else {
            baseUrl = "https://www.fastmock.site/mock/848eebc6348a60f19ecc6f2e1cdf8431/Mockapi";
        }
        return new Promise((resolve, reject) => {
            // let data={page:1,name:"tom"}
            // axios({
            //     method:"get",
            //     url:"http://www.baidu.com",
            //     params:data,
            //     timeout:5000,
            // }).then(res=>{})
            axios({
                url: options.url,
                method: "get",
                baseURL: baseUrl,
                timeout: 5000,
                params: (options.data && options.data.params) || ""
            }).then(response => {
                loading.style.display = "none";
                if (response.status === 200) {
                    let res = response.data;
                    if (res.code === 0) {
                        resolve(res);
                    } else {
                        Modal.error({
                            title: "数据错误提示",
                            content: "数据格式错误"
                        })
                    }
                } else {
                    reject(response.data);
                }
            });
        });
    }
}