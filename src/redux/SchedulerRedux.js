import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// ** Axios Imports
import Swal from 'sweetalert2'
import "../views/login.css"
import moment from 'moment'
import axios from "../lib/ApiCall"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
  headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}

export const getSchedulerPropeties = createAsyncThunk("SchedulerProperties/getSchedulerPropeties",
  async (payload) => {
    const response = await axios.get(payload.selectedField === "requestSelected" ? `property?forScheduleProperty=true&requestId=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&propertyTypeId=&status=&page=${payload.page}&limit=${payload.limit}` : payload.selectedField === "propertyTypeSelected" ? `property?forScheduleProperty=true&propertyType=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&propertyTypeId=&status=&page=${payload.page}&limit=${payload.limit}` : payload.selectedField === "propertySelected" ? `property?forScheduleProperty=true&name=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&propertyTypeId=&status=&page=${payload.page}&limit=${payload.limit}` : payload.selectedField === "selected" ? `property?forScheduleProperty=true&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&propertyTypeId=&status=&page=${payload.page}&limit=${payload.limit}` : `property?forScheduleProperty=true&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&propertyTypeId=&status=&page=${payload.page}&limit=${payload.limit}`, config)
    return {
      data: response.data
    }
  }
)
// /schedule post
export const AddScheduleDetail = createAsyncThunk("SchedulerProperties/AddScheduleDetail",
  async (payload, { dispatch }) => {
    const payloadSchedule = {
      dateTime: payload.dateTime,
      emergency: payload.emergency,
      date: payload.date,
      propertyId: payload.propertyId
    }
    await axios.post(`schedule`, payloadSchedule, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getSchedulerPropeties(payload))
          return new Swal({
            title: `Property Scheduled`,
            text: `Upcoming Schedule Date is : ${moment(payload.date).format('DD-MM-YYYY')}`,
            icon: "success",
            buttons: {
                confirm: 'Ok'
            }
          })

        default:
          dispatch(getSchedulerPropeties(payload))
          return new Swal({ title: "Something want wrong!", icon: "warning" })
      }
    }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
        dispatch(getSchedulerPropeties(payload))
      } else {
        new Swal({ icon: "warning", title: err.response.data.error["message"] })
        dispatch(getSchedulerPropeties(payload))
      }
    }
    ).catch(() => {
      dispatch(getSchedulerPropeties(payload))
    })
  }
)
// unhandled
export const getunhandledPropeties = createAsyncThunk("SchedulerProperties/getunhandledPropeties",
  async (payload) => {
    const  response = await axios.get(`property/listProperties?scheduled_type=unhandled&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&page=${payload.page}&limit=${payload.limit}`, config)
    return {
      data: response.data
    }
  }
)
// /schedule put
export const UpdateScheduleDetail = createAsyncThunk("SchedulerProperties/UpdateScheduleDetail",
  async (payload, { dispatch }) => {
    const payloadSchedule = {
      dateTime: payload.dateTime,
      emergency: payload.emergency,
      scheduleId: payload.scheduleId,
      date: payload.date,
      propertyId: payload.propertyId
    }
    await axios.put(`schedule`, payloadSchedule, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getSchedulerPropeties(payload))
          return new Swal({
            title: `Property Scheduled Updated `,
            text: `Upcoming Schedule Date is : ${moment(payload.date).format('DD-MM-YYYY')}`,
            icon: "success",
            buttons: {
                confirm: 'Ok'
            }
          })

        default:
          payload.UnhandledOption ? dispatch(getunhandledPropeties(payload)) : dispatch(getSchedulerPropeties(payload))
          return new Swal({ title: "Something want wrong!", icon: "warning" })
      }
    }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
        payload.UnhandledOption ? dispatch(getunhandledPropeties(payload)) : dispatch(getSchedulerPropeties(payload))
      } else {
        new Swal({ icon: "warning", title: err.response.data.error["message"] })
        payload.UnhandledOption ? dispatch(getunhandledPropeties(payload)) : dispatch(getSchedulerPropeties(payload))
      }
    }
    ).catch(() => {
      payload.UnhandledOption ? dispatch(getunhandledPropeties(payload)) : dispatch(getSchedulerPropeties(payload))
    })
  }
)

// /setfrequency put
export const addFreqSchedule = createAsyncThunk("SchedulerProperties/addFreqSchedule",
  async (payload, { dispatch }) => {
    const payloadFeq = {
      propUpdateFreqdays: payload.propUpdateFreqdays
    }
    await axios.put(`property/edit_auto_schedule_day/${payload.propertyId}`, payloadFeq, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getSchedulerPropeties(payload))
          if (payload.selectedFreq === "custom" || payload.selectedFreq === '') {
          return new Swal({
              title: "Scheduled Frequency Updated",
              icon: "success",
              text: `Upcoming Schedule Frequency ${moment(new Date()).add(payload.propUpdateFreqdays, 'days').format('DD-MM-YYYY')}.`,
              buttons: {
                confirm: 'Ok'
              }
            })
          }

          if (payload.selectedFreq === "alternate") {
          return   new Swal({
              title: "Scheduled Frequency Updated",
              text: `Upcoming Schedule Frequency ${moment(new Date()).add(payload.propUpdateFreqdays, 'days').format('DD-MM-YYYY')}.`,
              icon: "success",
              buttons: {
                confirm: 'Ok'
              }
            })
          }
          if (payload.selectedFreq === "daily") {
          return new Swal({
              title: "Scheduled Frequency Updated",
              text: `Upcoming Schedule Frequency ${moment(new Date()).add(payload.propUpdateFreqdays, 'days').format('DD-MM-YYYY')}.`,
              icon: "success",
              buttons: {
                confirm: 'Ok'
              }

            })

          }
        break
        default:
          return new Swal({ title: "Something want wrong!", icon: "warning" })
      }
    }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
        dispatch(getSchedulerPropeties(payload))
      } else {
        new Swal({ icon: "warning", title: err.response.data.error["message"] })
        dispatch(getSchedulerPropeties(payload))
      }
    }
    ).catch(() => {
      dispatch(getSchedulerPropeties(payload))
    })
  }
)

// /load_status?propertyId=7111&allData=true&status=  view history
export const getScheduleHistory = createAsyncThunk("SchedulerProperties/getScheduleHistory",
  async (payload) => {
    const response = await axios.get(`load_status?propertyId=${payload.propertyId}&allData=true&status=&limit=${payload.limit}&page=${payload.page}`, config)
    return {
      data: response.data
    }
  }
)

//Bulk schedule
export const AddBulkScheduleDetail = createAsyncThunk("SchedulerProperties/AddBulkScheduleDetail",
  async (payload, { dispatch }) => {
    const formdata = new FormData()
    formdata.append("dateTime", payload.dateTime)
    formdata.append("emergency", payload.emergency)
    formdata.append("date", payload.date)
    formdata.append("propertyId", JSON.stringify(payload.propertyId))
    await axios.post(`schedule/bulk_schedule`, formdata, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getSchedulerPropeties(payload))
          return new Swal({
            title: `Property Scheduled`,
            text: `Upcoming Schedule Date is : ${moment(payload.date).format('DD-MM-YYYY')}`,
            icon: "success",
            buttons: {
                confirm: 'Ok'
            }
          })

        default:
          dispatch(getSchedulerPropeties(payload))
          return new Swal({ title: "Something went wrong!", icon: "warning" })
      }
    }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
        dispatch(getSchedulerPropeties(payload))
      } else {
        new Swal({ icon: "warning", title: err.response.data.error["message"] })
        dispatch(getSchedulerPropeties(payload))
      }
    }
    ).catch(() => {
      dispatch(getSchedulerPropeties(payload))
    })
  }
)

export const SchedulerPropertiesSlice = createSlice({
  name: 'SchedulerProperties',
  initialState: {
    SchedulerPropertiesData: [],
    historyListing : []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSchedulerPropeties.fulfilled, (state, action) => {
        state.SchedulerPropertiesData = action.payload
      })
      .addCase(getScheduleHistory.fulfilled, (state, action) => {
        state.historyListing = action.payload
      })
      .addCase(getunhandledPropeties.fulfilled, (state, action) => {
        state.SchedulerPropertiesData = action.payload
      })

  }
})

export default SchedulerPropertiesSlice.reducer