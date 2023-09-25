import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// ** Axios Imports
import axios from "../lib/ApiCall"
import Swal from 'sweetalert2'
import "../views/login.css"
const token = JSON.parse(localStorage.getItem("userData"))
const config = {
  headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
}
export const getPropertyHeader = createAsyncThunk("PropertyListing/getPropertyHeader",
  async () => {
    const response = await axios.get(`property/headers`, config)
    return {
      data: response.data.data
    }
  }
)

export const getPropertyData = createAsyncThunk("PropertyListing/getPropertydata",
  async (payload) => {
    const response = await axios.get(`/property?name=${payload.searchQuery}&sortColumnName=${payload.sortingName}&sortType=${payload.sortingValue}&propertyTypeId=${payload.propertyTypeId}&limit=${payload.limit}&page=${payload.page}`, config)
    return {
      data: response.data
    }
  }
)

export const getExportFile = createAsyncThunk("PropertyListing/getExportFile",
  async () => {
    const response = await axios.get(`property?export=true`, config)
    return {
      data: response.data.data
    }
  }
)

export const addPropertyDetails = createAsyncThunk("PropertyListing/addPropertyDetails",
  async (payload, { dispatch }) => {
    await axios.post(`property/add`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
          return new Swal({ title: "Data Added!!!", icon: "success" })

        default:
          dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
          return new Swal({ title: "Something want wrong!", icon: "warning" })
      }
    }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
      } else {
        new Swal({ icon: "warning", title: err.response.data.error["message"] })
      }
      dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
    }
    ).catch(() => {
      dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
    })
  }
)

export const EditPropertyDetails = createAsyncThunk("PropertyListing/EditPropertyDetails",
  async (payload, { dispatch }) => {
    const id = payload.get("id")
    await axios.put(`property/${id}`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
          return new Swal({ title: "Data Edited!!", icon: "success" })

        default:
          dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
          return new Swal({ title: "Something want wrong!", icon: "warning" })
      }
    }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
      } else {
        new Swal({ icon: "warning", title: err.response.data.error["message"] })
      }
      dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
    }
    ).catch(() => {
      dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
    })
  }
)

export const PropertyDelete = createAsyncThunk("PropertyListing/PropertyDelete",
  async (payload, { dispatch }) => {
    await axios.delete(`/property/${payload.id}`, config)
      .then((response) => {
        const fetchScuess = response.data.success
        switch (fetchScuess) {
          case true:
            dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
            return new Swal({ title: "Deleted Data!!!", icon: "success" })

          default:
            dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
            return new Swal({ title: "Something want wrong!", icon: "warning" })
        }

      }, (err) => {
        if (err.response.data.error[0]["message"] !== "") {
          new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
        } else {
          new Swal({ icon: "warning", title: err.response.data.error["message"] })
        }
        dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
      }).catch(err => {
        dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
        console.log(err)

      })
  }
)
// /property/bulk
export const bulkPropertiesUpload = createAsyncThunk("PropertyListing/bulkPropertiesUpload",
  async (payload, { dispatch }) => {
    const formData = new FormData()
    const dataFile = payload.fileData
    formData.append(
      "PropertyBulkUploadFile",
      dataFile,
      dataFile.name
    )
    await axios.post(`property/bulk`, formData, config).then((response) => {
      if (response) {
        const fetchedLoadsResponse = response.data.success
        if (fetchedLoadsResponse === true) {
          new Swal({
            title: "Data Imported",
            icon: "success",
            buttons: {
              confirm: 'Ok'
            }
          })
          dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
        }
      }
    }, (err) => {
      if (!!err && err.response.data.error.length === 1) {
        if (err.response.data.error[0].value === "") {
          new Swal({
            title: err.response.data.error[0].errmessage,
            icon: "error",
            buttons: {
              confirm: 'Ok'
            }
          })
        } else {
          new Swal({ icon: "error", title: err.response.data.error[0]["message"] })
        }
        dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
      } else {
        const errors = !!err.response.data.error ? err.response.data.error.length : ''
        let list = ''
        const myhtml = document.createElement("div")
        myhtml.className = 'textNode-content'
        for (let i = 0; i < errors; i++) {
          list += ` '*' + ${err.response.data.error[i].errmessage} + '  ' + '.' + '\n'`

        }
        myhtml.innerHTML = list
        new Swal({ icon: "error", content: myhtml })
        dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
      }

    })
      .catch(error => {
        dispatch(getPropertyData({ query: '', limit: 10, page: 1, sortingName: '', sortingValue: '', searchQuery: "", propertyTypeId: "" }))
        new Swal({ icon: "error", title: error.response.data.error[0]["message"] })
      })
  }
)

// /property/7111/load?limit=10&page=1
//load/headers?ulbId=7111
export const getPropertyLoadsHeader = createAsyncThunk("PropertyListing/getPropertyLoadsHeader",
  async (payload) => {
    const response = await axios.get(`load/headers?ulbId=${payload.propertyId}`, config)
    return {
      data: response.data.data
    }
  }
)

export const getPropertyLoadsData = createAsyncThunk("PropertyListing/getPropertyLoadsData",
  async (payload) => {
    const response = await axios.get(`/property/${payload.propertyId}/load?limit=${payload.limit}&page=${payload.page}`, config)
    return {
      data: response.data
    }
  }
)

// property/addCitizenProperty
export const PropertyAddCitizen = createAsyncThunk("PropertyListing/PropertyAddCitizen",
  async (payload) => {
    const formdata = new FormData()
    formdata.append("Name", payload.Name)
    formdata.append("OwnerName", payload.ownerName)
    formdata.append("Zone", payload.Zone)
    formdata.append("Number", payload.Number)
    formdata.append("PhoneNumber", payload.PhoneNumber)
    formdata.append("ULBId", payload.ULBId)
    formdata.append("PinCode", payload.pinCode)//sending data to api
    formdata.append("UsageId", payload.UsageId)//sending data to api
    formdata.append("ASSESSMENT_NO", payload.ASSESSMENT_NO)//sending data to api
    formdata.append("OWNER_DOORNO", payload.OWNER_DOORNO)//sending data to api
    formdata.append("Latitude", payload.Latitude)//sending data to api
    formdata.append("Longitude", payload.Longitude)//sending data to api
    formdata.append("Locality", payload.locality)//sending data to api
    formdata.append("OtherTypeData", payload.OtherTypeData)//sending data to api
    formdata.append("UpcomingColletionDate", payload.UpcomingColletionDate)
    formdata.append("UpcomingColletionStartTime", payload.UpcomingColletionStartTime)
    formdata.append("UpcomingColletionEndTime", payload.UpcomingColletionEndTime)
    formdata.append("PropertyTypeId", payload.PropertyTypeId)
    formdata.append("ContainmentTypeId", payload.ContainmentTypeId)
    await axios.post(`property/addCitizenProperty`, formdata, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          return new Swal({
            icon: "success",
            title: "Request submitted successfully",
            text: `Request Id:- ${!!response && response.data && response.data.data[0]["request_Id_prefix"]}`
          }).then((will) => {
            if (will.isConfirmed) {
              window.location.href = "/property-management"
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
export const PropertySlice = createSlice({
  name: 'PropertyListing',
  initialState: {
    propertyHeaderData: [],
    propertyData: [],
    export: '',
    propertyLength: 0,
    propertyLoadListing : [],
    propertyLoadHeader : []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPropertyHeader.fulfilled, (state, action) => {
        state.propertyHeaderData = action.payload.data.headers.concat({ accessor: "actionButton", filter: "false", header: "Action", sortable: "false" })
      })
      .addCase(getPropertyData.fulfilled, (state, action) => {
        state.propertyData = action.payload.data
        state.propertyLength = action.payload.data.totalCount
      })
      .addCase(getExportFile.fulfilled, (state, action) => {
        const link1 = action.payload.data[0].file_path

        window.downloadFile = function (link) {
          window.open(link, '_blank')
        }
        window.downloadFile(link1)
      })
      .addCase(getPropertyLoadsHeader.fulfilled, (state, action) => {
        state.propertyLoadHeader = action.payload.data.headers
      })
      .addCase(getPropertyLoadsData.fulfilled, (state, action) => {
        state.propertyLoadListing = action.payload.data
      })

  }
})

export default PropertySlice.reducer