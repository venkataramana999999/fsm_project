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
export const getClusterHeader = createAsyncThunk("ClusterManagement/getClusterHeader",
  async () => {
    const response = await axios.get(`ulb/cluster-ulb/headers`, config)
    return {
      data: response.data.data
    }
  }
)

export const getClusterdata = createAsyncThunk("ClusterManagement/getClusterdata",
  async (payload) => {
    const response = await axios.get(`ulb/cluster-ulb?ulbName=${payload.query}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&limit=${payload.limit}&page=${payload.page}`, config)
    return {
      data: response.data
    }
  }
)
// /ulb/cluster
export const addClusterDetails = createAsyncThunk("ClusterManagement/addClusterDetails",
async (payload, { dispatch }) => {
     await axios.post(`ulb/cluster`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
           return  new Swal({title:"Data Added!!", icon:"success"})
        
        default:
          dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
     }
     ).catch(() => {
      dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
     })
  }
)
// /ulb/cluster
export const EditClusterDetails = createAsyncThunk("ClusterManagement/EditClusterDetails",
async (payload, { dispatch }) => {
     await axios.put(`ulb/cluster`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
           return  new Swal({title:"Data Edited!!", icon:"success"})
        
        default:
          dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
     }
     ).catch(() => {
      dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
     })
  }
)
// ulb/cluster
export const ClusterDelete = createAsyncThunk("ClusterManagement/ClusterDelete",
async (payload, { dispatch }) => {
  await axios.delete(`ulb/cluster`, {data : payload, headers : { Authorization: `Bearer ${token !== null ? token.token : ""}`}})
  .then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
          return  new Swal({title:"Data Deleted!!", icon:"success"})
        
        default:
          dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }

     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
     }).catch(err => {
      dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
      console.log(err)

     })
  }
)
// user/create-cluster-user
export const AddUserCluster = createAsyncThunk("ClusterManagement/AddUserCluster",
async (payload, { dispatch }) => {
     await axios.post(`user/create-cluster-user`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
           return  new Swal({title:"Data added", icon:"success"})
        
        default:
          dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
     }
     ).catch(() => {
      dispatch(getClusterdata({query:'', limit:10, page: 1, sortingName:'', sortingValue:'', searchQuery:"", propertyTypeId:""}))
     })
  }
)
// /ulb/get-Cluster-Users?ULBId=904

export const getClusterUserdata = createAsyncThunk("ClusterManagement/getClusterUserdata",
  async (payload) => {
    const response = await axios.get(`ulb/get-Cluster-Users?ULBId=${payload.ulbId}&sortColumnName=${payload.sortingName}&sortColumnType=${payload.sortingValue}&limit=${payload.limit}&page=${payload.page}`, config)
    return {
      data: response.data
    }
  }
)

// /user/update_cluster-user
export const UpdateUserCluster = createAsyncThunk("ClusterManagement/UpdateUserCluster",
async (payload, { dispatch }) => {
     await axios.put(`user/update_cluster-user`, payload, config).then((response) => {
      const fetchScuess = response.data.success
      switch (fetchScuess) {
        case true:
          dispatch(getClusterUserdata(payload))
           return  new Swal({title:"Data added", icon:"success"})
        
        default:
          dispatch(getClusterUserdata(payload))
          return  new Swal({title:"Something want wrong!", icon:"warning"})
      }
     }, (err) => {
      if (err.response.data.error[0]["message"] !== "") {
        new Swal({icon:"warning", title : err.response.data.error[0]["message"]})
      } else {
        new Swal({icon:"warning", title : err.response.data.error["message"]})
      }
      dispatch(getClusterUserdata(payload))
     }
     ).catch(() => {
      dispatch(getClusterUserdata(payload))
     })
  }
)
export const ClusterSlice = createSlice({
    name: 'ClusterManagement',
    initialState: {
      ClusterHeaderData: [],
      ClusterData:[],
      clusterUsersListing:[]
    },
    reducers: { },
  extraReducers: (builder) => {
      builder
      .addCase(getClusterHeader.fulfilled, (state, action) => {
        state.ClusterHeaderData = action.payload.data.headers.concat({accessor: "actionButton", filter: "false", header: "Action", sortable: "false"})
      })
      .addCase(getClusterdata.fulfilled, (state, action) => {
        state.ClusterData = action.payload
      })
      .addCase(getClusterUserdata.fulfilled, (state, action) => {
        state.clusterUsersListing = action.payload
      })
     
  }
})

export default ClusterSlice.reducer