// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import "../views/login.css"
import axios from "../lib/ApiCall"
import Swal from 'sweetalert2'
export const logout = () => {
  localStorage.removeItem('userData')
  localStorage.removeItem("role")
}
export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, expirationTime * 1000)
  }
}
export const authCheckState = createAsyncThunk("authentication/authCheckState",
  async ({ dispatch }) => {
    const token = localStorage.getItem('userData')
    if (!token) {
      // dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'))
      if (expirationDate <= new Date()) {
        dispatch(logout())
      } else {
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
      }
    }
  })

// /auth/add
export const AddCitizen = createAsyncThunk("authentication/AddCitizen",
  async (payload) => {
    const formdata = new FormData()
    formdata.append("Name", payload.Name)
    formdata.append("OwnerName", payload.ownerName)
    // formdata.append("PropertyTypeId", payload.PropertyTypeId)
    // formdata.append("ContainmentTypeId", payload.ContainmentTypeId)
    formdata.append("Zone", payload.Zone)
    formdata.append("Number", payload.Number)
    // formdata.append("Emergency", payload.emergency)
    // formdata.append("LastEmptiedDays", payload.LastEmptiedDays)
    // formdata.append("LastEmptiedMonths", payload.LastEmptiedMonths)
    // formdata.append("Comments", payload.Comments)
    // formdata.append("Photo", payload.Photo)
    formdata.append("PhoneNumber", payload.PhoneNumber)
    formdata.append("ULBId", payload.ULBId)
    formdata.append("PinCode", payload.pinCode)//sending data to api
    formdata.append("UsageId", payload.UsageId)//sending data to api
    formdata.append("ASSESSMENT_NO", payload.ASSESSMENT_NO)//sending data to api
    formdata.append("OWNER_DOORNO", payload.OWNER_DOORNO)//sending data to api
    formdata.append("Latitude", payload.Latitude)//sending data to api
    formdata.append("Longitude", payload.Longitude)//sending data to api
    formdata.append("Locality", payload.locality)//sending data to api
    // formdata.append("operatorId", payload.operatorId)
    formdata.append("OtherTypeData", payload.OtherTypeData)//sending data to api
    formdata.append("UpcomingColletionDate", payload.UpcomingColletionDate)
    formdata.append("UpcomingColletionStartTime", payload.UpcomingColletionStartTime)
    formdata.append("UpcomingColletionEndTime", payload.UpcomingColletionEndTime)
    await axios.post(`auth/add`, formdata).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          return new Swal({
            icon: "success",
            title: "Request submitted successfully",
            text: `Request Id:- ${!!response && response.data && response.data.data[0]["request_Id_prefix"]}`
          }).then((will) => {
            if (will.isConfirmed) {
              window.location.href = "/citizen"
            }
          })
        // return new Swal({ title: "Successfully added Data", icon: "success" })

        default:
          return new Swal({ title: "Something want wrong!", icon: "warning" })
      }
    }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
      } else {
        new Swal({ icon: "warning", title: err.response.data.error["message"] })
      }
    }
    ).catch(() => {
      new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
    })

  })
// auth/status?PhoneNumber=9878999892&allData=true&status=
export const getCitizenHistory = createAsyncThunk("authentication/getCitizenHistory",
  async (payload) => {
    const response = await axios.get(`auth/status?PhoneNumber=${payload.phoneNumber}&allData=true&status=&limit=${payload.limit}&page=${payload.page}`)
    return {
      data: response.data
    }
  }
)
const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser(),
    roleName: "",
    historyDetailList: []

  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      state.roleName = action.payload.roleName
      localStorage.setItem('userData', JSON.stringify(action.payload))
      const expirationDate = ((new Date(new Date().getTime() + 3600)) * 1000)
      localStorage.setItem('expirationDate', expirationDate)
      if (state.roleName === "Admin") {
        window.location.href = `/state-dashboard`
        setTimeout(1000)
      }
      if (state.roleName === "ULB Admin") {
        window.location.href = `/dasboard-ulb`
        setTimeout(1000)
      }
      if (state.roleName === "Scheduler") {
        window.location.href = `/scheduled-properties`
        setTimeout(1000)
      }

      switch (window.location.hostname) {
        case process.env.REACT_APP_STAGING_HOST:
        case process.env.REACT_APP_DEV_HOST_NAME:
          window.location = '/'
          break

        case process.env.REACT_APP_PROD_HOST:
        case process.env.REACT_APP_LOCAL_HOST_NAME:
          window.location = '/'
          break

        default:
          window.location = '/'
          break
      }

    },
    handleLogout: state => {
      state.userData = {}
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem("role")
      localStorage.removeItem("expirationDate")
      localStorage.removeItem("citizen")
      localStorage.removeItem("PhoneNumber")

      switch (window.location.hostname) {
        case process.env.REACT_APP_STAGING_HOST:
        case process.env.REACT_APP_DEV_HOST_NAME:
          window.location = '/'
          break

        case process.env.REACT_APP_PROD_HOST:
        case process.env.REACT_APP_LOCAL_HOST_NAME:
          window.location = '/'
          break

        default:
          window.location = '/'
          break
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCitizenHistory.fulfilled, (state, action) => {
        state.historyDetailList = action.payload.data
      })
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer