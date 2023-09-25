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
export const getDisposalHeader = createAsyncThunk("DisposalFacility/getDisposalHeader",
  async () => {
    const response = await axios.get(`treatment_facility/headers`, config)
    return {
      data: response.data.data
    }
  }
)

export const getDisposaldata = createAsyncThunk("DisposalFacility/getDisposaldata",
  async (payload) => {
    const response = await axios.get(payload.field === "all" || payload.field === "sorting" ? `treatment_facility/?sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&limit=${payload.limit}&page=${payload.page}` : "treatment_facility", config)
    return {
      data: response.data
    }
  }
)

//treatment_facility
export const addtreatment_facility = createAsyncThunk("DisposalFacility/addtreatment_facility",
async (payload, { dispatch }) => {
     await axios.post(`treatment_facility`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Data Added!!", icon:"success"})
        
        default:
          dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     }
     ).catch(() => {
      dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     })
  }
)

export const UpdateTreatment_facility = createAsyncThunk("DisposalFacility/UpdateTreatment_facility",
async (payload, { dispatch }) => {
     await axios.put(`treatment_facility`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Data Edited!!", icon:"success"})
        
        default:
          dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     }
     ).catch(() => {
      dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     })
  }
)

export const treatmentFacilityDelete = createAsyncThunk("DisposalFacility/treatmentFacilityDelete",
async (payload, { dispatch }) => {
  await axios.delete('treatment_facility', {data : payload, headers : { Authorization: `Bearer ${token !== null ? token.token : ""}`}})
  .then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
           return  new Swal({title:"Data Deleted", icon:"success"})
        
        default:
          dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }

     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
     }).catch(err => {
      dispatch(getDisposaldata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', field: "all"}))
      console.log(err)
      // return  new Swal({title: err.error.message, icon:"warning"})

     })
  }
)

export const DisposalSlice = createSlice({
  name: 'DisposalFacility',
  initialState: {
    disposalHeaderData: [],
    disposalData: [],
    totalCounts : 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDisposalHeader.fulfilled, (state, action) => {
        state.disposalHeaderData = action.payload.data.headers
      })
      .addCase(getDisposaldata.fulfilled, (state, action) => {
        state.disposalData = action.payload.data.data
        state.totalCounts = action.payload.data.totalCount
      })

  }
})

export default DisposalSlice.reducer