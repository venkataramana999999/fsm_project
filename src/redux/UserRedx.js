import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
import "../views/login.css"
// ** Axios Imports
import axios from "../lib/ApiCall"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
    headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}
export const getUserHeader = createAsyncThunk("Usermanagement/getUserHeader",
  async () => {
    const response = await axios.get(`user/headers`, config)
    return {
      data: response.data.data
    }
  }
)
export const getUserdata = createAsyncThunk("Usermanagement/getUserdata",
  async (payload) => {
    const response = await axios.get(payload.field === "all" || payload.field === "sorting" || payload.selectedField === "selected" ? `user?name=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&limit=${payload.limit}&page=${payload.page}` : payload.field === "search" ? payload.selectedField === "roleSelected" ? `user?roleName=${payload.query}` : payload.selectedField === "UserSelected" ? `user?userName=${payload.query}` : `user?name=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&limit=${payload.limit}&page=${payload.page}` : "user", config)
    return {
      data: response.data
    }
  }
)


export const getRoleList = createAsyncThunk("Usermanagement/getRoleList",
  async () => {
    const response = await axios.get(`role?sortColumnName=&sortColumnType=`, config)
    return {
      data: response.data
    }
  }
)
export const getRoleListAdmin = createAsyncThunk("Usermanagement/getRoleListAdmin",
  async () => {
    const response = await axios.get(`role/?admin=true`, config)
    return {
      data: response.data.data
    }
  }
)
export const addUserDetails = createAsyncThunk("Usermanagement/addUserDetails",
async (payload, { dispatch }) => {
     await axios.post(`user`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getUserdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
           return  new Swal({title:"User added !!", icon:"success"})
        
        default:
          dispatch(getUserdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getUserdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     }).catch(err => {
      dispatch(getUserdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
      console.log(err)
      return  new Swal({title:"Please send correct data", icon:"warning"})

     })
  }
)
export const EditUserDetails = createAsyncThunk("Usermanagement/addUserDetails",
async (payload, { dispatch }) => {
     await axios.put(`user`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getUserdata({query:'', limit: 10, page: payload.page, sortingName:'', sortingValue:'', field: "all"}))
           return  new Swal({title:"Data Edited!!!", icon:"success" })
        
        default:
          dispatch(getUserdata({query:'', limit: 10, page: payload.page, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getUserdata({query:'', limit: 10, page: payload.page, sortingName:'', sortingValue:'', field: "all"}))
    }).catch(err => {
      dispatch(getUserdata({query:'', limit: 10, page: payload.page, sortingName:'', sortingValue:'', field: "all"}))
      console.log(err)
      return  new Swal({title:"Please send correct data", icon:"warning"})

     })
  }
)
export const userDelete = createAsyncThunk("Usermanagement/userDelete",
async (payload, { dispatch }) => {
  await axios.delete('user', {data : payload, headers : { Authorization: `Bearer ${token !== null ? token.token : ""}`}})
  .then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getUserdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
           return  new Swal({title:"Deleted Data", icon:"success"})
        
        default:
          dispatch(getUserdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }

     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getUserdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     }).catch(err => {
      dispatch(getUserdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
      console.log(err)
      // return  new Swal({title: err.error.message, icon:"warning"})

     })
  }
)

export const getRoleDelete = createAsyncThunk("ULBmanagement/getRoleDelete",
async (payload, { dispatch }) => {
 await axios.delete('role', {data : payload, headers : { Authorization: `Bearer ${token !== null ? token.token : ""}`}})
     .then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getRoleList({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
           return  new Swal({title:"Deleted Data", icon:"success"})
        
        default:
          dispatch(getRoleList({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getRoleList({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
     }
     ).catch(() => {
      dispatch(getRoleList({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
     })
  }
)

export const UserSlice = createSlice({
    name: 'Usermanagement',
    initialState: {
      userHeaderData: [],
      userData:[],
      RoleList: [],
      RoleListAdmin:[],
      addUserData :[]
    },
    reducers: { },
  extraReducers: (builder) => {
      builder
      .addCase(getUserHeader.fulfilled, (state, action) => {
        state.userHeaderData = action.payload.data.headers.concat({accessor: "actionButton", filter: "false", header: "Action", sortable: "false"})
      })
      .addCase(getUserdata.fulfilled, (state, action) => {
        state.userData = action.payload
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        state.RoleList = action.payload
      })
      .addCase(getRoleListAdmin.fulfilled, (state, action) => {
        state.RoleListAdmin = action.payload
      })
  }
})

export default UserSlice.reducer