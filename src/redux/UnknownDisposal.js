// /treatment_facility/headers
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'
// ** Axios Imports
import axios from "../lib/ApiCall"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
    headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}

export const getUnknownDisposaldata = createAsyncThunk("UnknownDisposal/UnknownDisposaldata",
  async (payload) => {
    const response = await axios.get(payload.searchByFields === "operatorname" ? `load/load/getunknown?operatorName=${payload.query}` : payload.searchByFields === "truckNo" ? `load/load/getunknown?truckNo=${payload.query}` : `load/load/getunknown/?fromDate=${payload.fromDate}&toDate=${payload.toDate}`, config)
    return {
      data: response.data
    }
  }
)

export const getExportFile = createAsyncThunk("UnknownDisposal/getExportFile",
  async (payload) => {
    const response = await axios.get(payload.selectedLoadId !== "" ? `load/load/getunknown/?selectedUnkonwPropertyId=${payload.selectedLoadId}&export=true` : `load/load/getunknown?export=true`, config)
    return {
      data: response.data.data
    }
  }
)
export const UnknownDisposalSlice = createSlice({
    name: 'FstpReport',
    initialState: {
      UnknownDisposalData: []
    },
    reducers: { },
  extraReducers: (builder) => {
      builder
      .addCase(getUnknownDisposaldata.fulfilled, (state, action) => {
        state.UnknownDisposalData = action.payload
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

export default UnknownDisposalSlice.reducer