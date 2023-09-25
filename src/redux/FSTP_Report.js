// /treatment_facility/headers
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
// ** Axios Imports
import axios from "../lib/ApiCall"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
    headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}
export const getFstpReportHeader = createAsyncThunk("FstpReport/getFstpReportHeader",
  async () => {
    const response = await axios.get(`load/fstpheaders`, config)
    return {
      data: response.data.data
    }
  }
)
export const getFstpReportsdata = createAsyncThunk("FstpReport/getFstpReportsdata",
  async (payload) => {
    // load/?sort=&filter=[{%22wardNumber%22:%22%22,%22operatorName%22:%22%22,%22truckRegistrationNumber%22:%22%22,%22propertyTypeName%22:%22%22}]&query=&fromDate=01-01-2020%2000:00&toDate=09-14-2022%2023:59
    const response = await axios.get(payload.searchByFields === "operatorname" ? `/load/getfstp/?operatorName=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}` : payload.searchByFields === "facilityname" ? `/load/getfstp/?treatmentFacilityName=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}` : `load/getfstp/?query=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`, config)
    return {
      data: response.data
    }
  }
)

export const getExportFile = createAsyncThunk("FstpReport/getExportFile",
  async (payload) => {
    const response = await axios.get(`load/getfstp/?query=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&export=true&fstp=true&selectedLoadId=${payload.selectedLoadId}`, config)
    return {
      data: response.data.data
    }
  }
)
export const FstpReportsSlice = createSlice({
    name: 'FstpReport',
    initialState: {
      fstpReportHeaderData: [],
      fstpReportsData: []
    },
    reducers: { },
  extraReducers: (builder) => {
      builder
      .addCase(getFstpReportHeader.fulfilled, (state, action) => {
        state.fstpReportHeaderData = action.payload.data.headers
      })
      .addCase(getFstpReportsdata.fulfilled, (state, action) => {
        state.fstpReportsData = action.payload
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

export default FstpReportsSlice.reducer