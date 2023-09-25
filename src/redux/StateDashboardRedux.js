import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import Swal from 'sweetalert2'
// ** Axios Imports
import axios from "../lib/ApiCall"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
    headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}
export const getStateDashTable = createAsyncThunk("StateDashboard/getStateDashTable",
  async (payload) => {
    const response = await axios.get(`state_dashboard?startDate=${payload.startDate}&endDate=${payload.endDate}&startutilizationRateIn=${payload.startutilizationRateIn}&endutilizationRateIn=${payload.endutilizationRateIn}&treatmentFacilityType=${payload.category}&sortColumnName=${payload.sortColumnName}&sortType=${payload.sortType}`, config)
    return {
      data: response.data
    }
  }
)

export const getStateDashGraph = createAsyncThunk("StateDashboard/getStateDashGraph",
  async (payload) => {
    const response = await axios.get(`state_dashboard?startDate=${payload.startDate}&endDate=${payload.endDate}&startutilizationRateIn=${payload.startutilizationRateIn}&endutilizationRateIn=${payload.endutilizationRateIn}&treatmentFacilityType=${payload.category}`, config)
    return {
      data: response.data
    }
  }
)

export const getExportFile = createAsyncThunk("StateDashboard/getExportFile",
  async (payload) => {
    const response = await axios.get(`state_dashboard?startDate=${payload.startDate}&endDate=${payload.endDate}&startutilizationRateIn=${payload.startutilizationRateIn}&endutilizationRateIn=${payload.endutilizationRateIn}&treatmentFacilityType=${payload.category}&export=true&sortColumnName=${payload.sortColumnName}&sortType=${payload.sortType}`, config)
    return {
      data: response.data.data
    }
  }
)

export const getStateViewHistorGraph = createAsyncThunk("StateDashboard/getStateViewHistorGraph",
  async (payload) => {
    const response = await axios.get(`dashboard/?interval=${payload.interval}&ulbId=${payload.ulbId} `, config)
    return {
      data: response.data.data
    }
  }
)
export const StateDashboardSlice = createSlice({
    name: 'StateDashboard',
    initialState: {
      StateDashTable: [],
      StateDashGraph:[],
      StateViewHistorGraph:[]
    },
    reducers: { },
  extraReducers: (builder) => {
      builder
      .addCase(getStateDashTable.fulfilled, (state, action) => {
        state.StateDashTable = action.payload.data.data
      })
      .addCase(getStateDashGraph.fulfilled, (state, action) => {
        state.StateDashGraph = action.payload.data.data
      })
     
      .addCase(getExportFile.fulfilled, (state, action) => {
        const link1 = action.payload.data[0].file_path
 
        window.downloadFile = function (link) {
            window.open(link, '_blank')
        }
        window.downloadFile(link1)
      })
      .addCase(getStateViewHistorGraph.fulfilled, (state, action) => {
        state.StateViewHistorGraph = action.payload.data
      })
  }
})

export default StateDashboardSlice.reducer