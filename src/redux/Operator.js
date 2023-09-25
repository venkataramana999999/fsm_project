// /treatment_facility/headers
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
import "../views/login.css"
// ** Axios Imports
import axios from "../lib/ApiCall"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
    headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}
export const getOperaterHeader = createAsyncThunk("OperaterManagement/getOperaterHeader",
  async () => {
    const response = await axios.get(`operator/headers`, config)
    return {
      data: response.data.data
    }
  }
)

export const getOperaterData = createAsyncThunk("OperaterManagement/getOperaterData",
  async (payload) => {
    // operator/?statistics=true&sortColumnName=&sortColumnType=
    const response = await axios.get(`operator/?statistics=true&name=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&limit=${payload.limit}&page=${payload.page}`, config)
    return {
      data: response.data
    }
  }
)
export const getExportFile = createAsyncThunk("OperaterManagement/getExportFile",
  async (payload) => {
    const response = await axios.get(`operator/?statistics=true&name=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&limit=${payload.limit}&page=${payload.page}&export=true`, config)
    return {
      data: response.data.data
    }
  }
)

// operator/?statistics=true delete
export const OperatorDelete = createAsyncThunk("OperaterManagement/OperatorDelete",
async (payload, { dispatch }) => {
  await axios.delete('operator/?statistics=true', {data : payload, headers : { Authorization: `Bearer ${token !== null ? token.token : ""}`}})
  .then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
           return  new Swal({title:"Data Deleted", icon:"success"})
        
        default:
          dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }

     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     }).catch(err => {
      dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
      console.log(err)
      // return  new Swal({title: err.error.message, icon:"warning"})

     })
  }
)

// operator
export const addOperatorDetails = createAsyncThunk("OperaterManagement/addOperatorDetails",
async (payload, { dispatch }) => {
     await axios.post(`operator`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Data Added!!", icon:"success"})
        
        default:
          dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     }
     ).catch(() => {
      dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     })
  }
)
export const UpdateOperatorDetails = createAsyncThunk("OperaterManagement/UpdateOperatorDetails",
async (payload, { dispatch }) => {
     await axios.put(`operator`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Data Edited!!", icon:"success"})
        
        default:
          dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     }
     ).catch(() => {
      dispatch(getOperaterData({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     })
  }
)
export const OPeraterSlice = createSlice({
    name: 'OperaterManagement',
    initialState: {
      operatorHeaderData: [],
      operatorData:[]
    },
    reducers: { },
  extraReducers: (builder) => {
      builder
      .addCase(getOperaterHeader.fulfilled, (state, action) => {
        state.operatorHeaderData = action.payload.data.headers.concat({accessor: "actionButton", filter: "false", header: "Action", sortable: "false"})
      })
      .addCase(getOperaterData.fulfilled, (state, action) => {
        state.operatorData = action.payload
      })
      .addCase(getExportFile.fulfilled, (state, action) => {
        const link1 = action.payload.data[0].file_path
 
        window.downloadFile = function (link) {
            window.open(link, '_blank')
        }
        window.downloadFile(link1)
      })
     
  }
})

export default OPeraterSlice.reducer