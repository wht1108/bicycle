import * as constants from "../constants"
const initialValues={
    menuName:"首页"
}
const rootReducer=(state=initialValues,action)=>{
    console.log(action)
    switch(action.type){
        case constants.CHANGENAME:
            return {...state,menuName:action.menuName}
        default:
            return state;
    }
}
export {initialValues,rootReducer}