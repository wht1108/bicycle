import { createStore } from "redux";//创建全局store用的
import { rootReducer } from "../reducer";
import { composeWithDevTools } from "@redux-devtools/extension";//监听工具
export const store=createStore(rootReducer,composeWithDevTools());
