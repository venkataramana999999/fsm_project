// /treatment_facility/headers
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
// ** Axios Imports
import axios from "../lib/ApiCall"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
    headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}
export const getDataReportHeader = createAsyncThunk("DataReport/getDataReportHeader",
  async () => {
    const response = await axios.get(`load/headers?loadHeaders=loadDataHeaders`, config)
    return {
      data: response.data.data
    }
  }
)

export const getDataReportsdata = createAsyncThunk("DataReport/getDataReportsdata",
  async (payload) => {
    // load/?sort=&filter=[{%22wardNumber%22:%22%22,%22operatorName%22:%22%22,%22truckRegistrationNumber%22:%22%22,%22propertyTypeName%22:%22%22}]&query=&fromDate=01-01-2020%2000:00&toDate=09-14-2022%2023:59
    const response = await axios.get(payload.searchByFields === "propertySelected" ? `load/?query=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}` : payload.searchByFields === "requestSelected" ? `load/?requestId=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}` :  payload.searchByFields === "operatorname" ? `/load/?operatorName=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}` : payload.searchByFields === "facilityname" ? `/load/?treatmentFacilityName=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}` : `load/?query=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`, config)
    return {
      data: response.data
    }
  }
)

export const getExportFile = createAsyncThunk("DataReport/getExportFile",
  async (payload) => {
    const response = await axios.get(payload.searchByFields === "propertySelected" ? `load/?query=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&selectedLoadId=${payload.selectedLoadId}&export=true` : payload.searchByFields === "requestSelected" ? `load/?requestId=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&selectedLoadId=${payload.selectedLoadId}&export=true` : `load/?query=${payload.query}&filter=${payload.filter}&sort=${payload.sort}&limit=${payload.limit}&page=${payload.page}&fromDate=${payload.fromDate}&toDate=${payload.toDate}&selectedLoadId=${payload.selectedLoadId}&export=true`, config)
    return {
      data: response.data.data
    }
  }
)
export const DataReportsSlice = createSlice({
    name: 'DataReport',
    initialState: {
      dataReportHeaderData: [],
      dataRepotsData:[]
    },
    reducers: { },
  extraReducers: (builder) => {
      builder
      .addCase(getDataReportHeader.fulfilled, (state, action) => {
        state.dataReportHeaderData = action.payload.data.headers
      })
      .addCase(getDataReportsdata.fulfilled, (state, action) => {
        state.dataRepotsData = action.payload
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

export default DataReportsSlice.reducer