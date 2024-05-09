import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// ** Axios Imports
import Swal from 'sweetalert2'
import "../views/login.css"
import axios from "../lib/ApiCall"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
    headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}
export const getUlbHeader = createAsyncThunk("ULBmanagement/getUlbHeader",
  async () => {
    const response = await axios.get(`ulb/headers`, config)

    return {
      data: response.data.data
    }
  }
)
export const getULBdata = createAsyncThunk("ULBmanagement/getULBdata",
  async (payload) => {

    const response = await axios.get(payload.field === "all" || payload.field === "sorting" ? `ulb?name=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&limit=${payload.limit}&page=${payload.page}` : payload.field === "search" ? `ulb?name=${payload.query}&limit=${payload.limit}&page=${payload.page}` : "ulb", config)

    return {
      data: response.data
    }
  }
)

export const addULBDetails = createAsyncThunk("ULBmanagement/addULBDetails",
async (payload, { dispatch }) => {
     await axios.post(`ulb`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
           return  new Swal({title:"Successfully added Data", icon:"success"})
        
        default:
          dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
     }
     ).catch(() => {
      dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
     })
  }
)


export const EditULBDetails = createAsyncThunk("ULBmanagement/EditULBDetails",
async (payload, { dispatch }) => {
     await axios.put(`ulb`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
           return  new Swal({title:"Successfully edited Data", icon:"success"})
        
        default:
          dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
     }
     ).catch(() => {
      dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
     })
  }
)

export const deleteULBDetails = createAsyncThunk("ULBmanagement/deleteULBDetails",
async (payload, { dispatch }) => {
 await axios.delete('ulb', {data : payload, headers : { Authorization: `Bearer ${token !== null ? token.token : ""}`}})
     .then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
           return  new Swal({title:"Deleted Data", icon:"success"})
        
        default:
          dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
     }
     ).catch(() => {
      dispatch(getULBdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:''}))
     })
  }
)
export const ULBSlice = createSlice({
    name: 'ULBmanagement',
    initialState: {
      ulbHeaderData: [],
      ulbData:[]
    },
    reducers: { },
  extraReducers: (builder) => {
      builder
      .addCase(getUlbHeader.fulfilled, (state, action) => {
        state.ulbHeaderData = action.payload.data.headers.concat({accessor: "actionButton", filter: "false", header: "Action", sortable: "false"})
      })
      .addCase(getULBdata.fulfilled, (state, action) => {
        state.ulbData = action.payload
      })
     
  }
})

export default ULBSlice.reducer