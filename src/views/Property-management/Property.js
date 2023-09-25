import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Input,
  Label,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  UncontrolledDropdown
} from "reactstrap"
import moment from "moment"
import GoogleMapReact from 'google-map-react'
import Flatpickr from 'react-flatpickr'
// ** React Imports
import { Link } from "react-router-dom"
import Marker from "./marker"
import { MoreVertical, Share, Edit, FileText, Archive, Trash, X, ChevronDown, ChevronUp, Plus, DownloadCloud } from 'react-feather'
import axios from '../../lib/ApiCall'
import ReactPaginate from 'react-paginate'
import { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Breadcrumbs from '@components/breadcrumbs'
import { getPropertyHeader, getPropertyData, getExportFile, PropertyDelete, EditPropertyDetails, bulkPropertiesUpload, getPropertyLoadsHeader, getPropertyLoadsData } from "../../redux/property"
import PropertyBulkUpload from './propertyBulkUpload.xlsx'
import { useDropzone } from 'react-dropzone'
import Swal from "sweetalert2"
import { withTranslation } from 'react-i18next'
import location from "../../assets/images/current_location/Location.png"
import '../login.css'

/**
 * Evaluates lat long for 4 digit precision
 * @param {*} loc - Lat Long for evaluation
 */
function evaluateLocation(loc) {
  return loc.toString().length > 0 ? parseFloat(loc).toFixed(4) : ""
}
const Property = ({ t }) => {
  // ** map key
  const maps_key = "AIzaSyBV5XySVlxwJm_lAJ2ZoecKismiBv1ZJAo"
   //Getting Token and Authorization headers
   const token = JSON.parse(localStorage.getItem("userData"))
   const config = {
     headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
   }
  // ** Statess
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPageLoads, setCurrentPageLoads] = useState(0)
  const [rowsPerPageLoads, setRowsPerPageLoads] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  //  const [filteredData, setFilteredData] = useState([])
  const [sortName, setSortName] = useState('')
  const [sortValue, setSortValue] = useState('')
  const [currentSortId, setCurrentSortId] = useState('')
  const [parPage, setParPage] = useState(1)
  const [parPageLoads, setParPageLoads] = useState(1)
  const [usageOption, setUsageOption] = useState([])
  const [OwnerName, setOwnerName] = useState("")
  const [Landmark, setLandmark] = useState("")
  const [TaxAssessment, setTaxAssessment] = useState("")
  const [HouseNo, setHouseNo] = useState("")
  const [Locality, setLocality] = useState("")
  const [zoneName, setZoneNumber] = useState('')
  const [wardNumber, setWardNumber] = useState("")
  // const [comment, setComment] = useState("")
  const [phoneNo, setPhoneNo] = useState("")
  const [PropertyOption, setPropertyOption] = useState([])
  const [ContainmentOptions, setContainmentOptions] = useState([])
  const [usegeId, setUsageId] = useState("")
  const [ContainmentTypeId, setContainmentTypeId] = useState("")
  const [PropertyTypeId, setPropertyTypeId] = useState("")
  // const [pincode, setPincode] = useState("")
  const [ulbOptionList, setUlbOptionList] = useState([])
  const [visitDate, setVisitDate] = useState(new Date())
  // const [selectedDayMonthId, setSelectedDayMonthId] = useState("")
  // const [month, setMonth] = useState("")
  // const [days, setDays] = useState("")
  // const [picture, setPicture] = useState("")
  const [ContainmentTypeErr, setContainmentTypeErr] = useState("")
  const [ulbSelectedId, setUlbSelectedId] = useState("")
  const [ownerNameErr, setownerNameErr] = useState("")
  const [ulbNameErr, setUlbNameErr] = useState("")
  const [phoneNoErr, setPhoneNoErr] = useState("")
  // const [zoneErr, setZoneErr] = useState("")
  // const [wardNoErr, setWardNoErr] = useState("")
  // const [PincodeErr, setPincodeErr] = useState("")
  const [PropTypeErr, setPropTypeErr] = useState("")
  const [zoom, setZoom] = useState(18)
  const [center, setCenter] = useState({ lat: "", long: "" })
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [PropertyEditId, setPropertyEditId] = useState("")
  // const [emergencyId, setEmergencyId] = useState("")
  const [files, setFiles] = useState([])
  const [TimeRange, setTimeRange] = useState("08:00 AM - 10:00 AM")
  const [endTimeRange, setEndTimeRange] = useState("10:00 AM")
  const [startRangeTime, setStartRangTime] = useState("08:00 AM")
  const [openLoadsListing, setOpenLoadsListing] = useState(false)
  const dispatch = useDispatch()
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles.map(file => { if (file !== undefined) { dispatch(bulkPropertiesUpload({ fileData: file })) } })])
    }
  })
  // const emergency = [
  //   { value: 'Yes', label: `${t('ulbDeleteErr3')}` },
  //   { value: 'No', label: `${t('ulbDeleteErr4')}` }
  // ]

  // const selectDayMonth = [
  //   { value: 'M', label: 'Months' },
  //   { value: 'D', label: 'Days' }
  // ]
  // ** Function to handle Modal toggle
  // const handleModal = () => {
  //   setModal(true)
  //   const success = position => {
  //     const latitude = position.coords.latitude
  //     const longitude = position.coords.longitude
  //     const center = {
  //       lat: latitude,
  //       lng: longitude
  //     }
  //     setLatitude(latitude)
  //     setLongitude(longitude)
  //     setZoom(18)
  //     setCenter(center)
  //   }

  //   const error = () => {
  //     ("Unable to retrieve your location")
  //   }
  //   navigator.permissions.query({ name: 'geolocation' }).then(permission => {
  //     if (permission.state === "granted") {
  //       navigator.geolocation.getCurrentPosition(success, error)
  //     } else if (permission.state === "prompt") {
  //       const tsCenter = {
  //         lat: 17.8302,
  //         lng: 79.2778
  //       }
  //       setLatitude(17.8302)
  //       setLongitude(79.2778)
  //       setZoom(7)
  //       setCenter(tsCenter)
  //       // this.setState({
  //       //     latitude: 17.8302,
  //       //     longitude: 79.2778,
  //       //     center:tsCenter,
  //       //     zoom:7
  //       //   });
  //     } else if (permission.state === "denied") {
  //       const tsCenter = {
  //         lat: 17.8302,
  //         lng: 79.2778
  //       }
  //       setLatitude(17.8302)
  //       setLongitude(79.2778)
  //       setZoom(7)
  //       setCenter(tsCenter)
  //     }
  //   })
  // }
  const handleModalClose = () => {
    setModal(false)
    // setPicture("")
    setLatitude("")
    setLongitude("")
    setUlbSelectedId("")
    // setDays("")
    // setPincode("")
    // setSelectedDayMonthId("")
    setContainmentTypeId("")
    setPhoneNo("")
    setPropertyTypeId("")
    // setComment("")
    setWardNumber("")
    setZoneNumber("")
    setLocality("")
    setHouseNo("")
    setLandmark("")
    setTaxAssessment("")
    setOwnerName("")
    setPropertyEditId("")
    setZoom(18)
    setCenter({ lat: "", lng: "" })
    setownerNameErr("")
    setPhoneNoErr("")
    setPropTypeErr("")
    setContainmentTypeErr("")
    setUlbNameErr("")
    // setZoneErr("")
    // setWardNoErr("")
    // setPincodeErr("")
  }
  // ** Function to handle filter
  const handleFilter = e => {
    const value = e.target.value
    setSearchValue(value)
    const payload = {
      page: parPage,
      limit: rowsPerPage,
      propertyTypeId: "",
      sortingName: sortName,
      sortingValue: sortValue,
      searchQuery: value
    }
    dispatch(getPropertyData(payload))

  }
  const handleLoadListing = (data) => {
    setOpenLoadsListing(!openLoadsListing)
    const payload = {
      propertyId: data.propertyId,
      page: parPageLoads,
      limit: rowsPerPageLoads
    }

    dispatch(getPropertyLoadsData(payload))
    dispatch(getPropertyLoadsHeader(payload))

  }
  const store = useSelector(state => state.property)
  const columns = store.propertyHeaderData
  const propertystore = store.propertyData && store.propertyData.data ? store.propertyData.data.properties : []
  const lengthPropty = store.propertyLength
  const count = Math.ceil(lengthPropty / rowsPerPage)
  const propertyLoadsHeader = store.propertyLoadHeader
  const loadsPropertyListing = store.propertyLoadListing.data ? store.propertyLoadListing.data ? store.propertyLoadListing.data.propertyLoads : [] : []
  const loadsLength = store.propertyLoadListing ? store.propertyLoadListing.totalCount : 0
  const countLoads = Math.ceil(loadsLength / rowsPerPageLoads)
  //** Function to get Usage Options
  const getusageOptions = () => {
    axios({
      method: 'get',
      url: '/auth/usageType'
    })
      .then((response) => {
        const usage_option = response.data.data.usageType
        setUsageOption(usage_option)

      })
  }

  //** Function to get Metadata Options
  const getMetaData = () => {
 
    axios.get('/load_template/master_data', config)
      .then((response) => {
        // console.log(response, "response")
        const PropertyOption = response.data.data['master-data'][1].data
        const containmentOptions = response.data.data['master-data'][5].data
        setPropertyOption(PropertyOption)
        setContainmentOptions(containmentOptions)
      })
  }

  // Function to get ULB Options
  const ulbOption = () => {
    axios.get('/ulb/getAllUlb', config)
      .then((response) => {
        setUlbOptionList(response.data.data)
      })
  }

  // const GetLOca
  useEffect(() => {
    dispatch(getPropertyHeader())
    getusageOptions()
    getMetaData()
    ulbOption()

    const payload = {
      page: parPage,
      limit: rowsPerPage,
      propertyTypeId: "",
      sortingName: sortName,
      sortingValue: sortValue,
      searchQuery: searchValue
    }
    dispatch(getPropertyData(payload))

    const success = position => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const center = {
        lat: latitude,
        lng: longitude
      }
      setLatitude(17.8302)
      setLongitude(79.2778)
      setZoom(7)
      setCenter(center)
    }

    const error = () => {
      console.log("Unable to retrieve your location")
    }

    navigator.geolocation.getCurrentPosition(success, error)

  }, [])


  // ** Function to handle per page
  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
    const payload = {
      page: parPage,
      limit: e.target.value,
      propertyTypeId: "",
      sortingName: sortName,
      sortingValue: sortValue,
      searchQuery: searchValue
    }
    dispatch(getPropertyData(payload))
  }
  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
    setParPage(page.selected + 1)
    const payload = {
      page: page.selected + 1,
      limit: rowsPerPage,
      propertyTypeId: "",
      sortingName: sortName,
      sortingValue: sortValue,
      searchQuery: searchValue
    }
    dispatch(getPropertyData(payload))
  }

  // ** Function to handle per page
  const handlePerPageLoads = e => {
    setRowsPerPageLoads(parseInt(e.target.value))
    const payload = {
      page: parPageLoads,
      limit: e.target.value,
      sortingName: sortName,
      sortingValue: sortValue
    }
    dispatch(getPropertyLoadsData(payload))

    // dispatch(getPropertyData(payload))
  }
  // ** Function to handle Pagination
  const handlePaginationLoads = page => {
    setCurrentPageLoads(page.selected)
    setParPageLoads(page.selected + 1)
    const payload = {
      page: page.selected + 1,
      limit: rowsPerPageLoads,
      sortingName: sortName,
      sortingValue: sortValue
    }
    dispatch(getPropertyLoadsData(payload))
    // dispatch(getPropertyData(payload))
  }

  //** Function to handle Export 
  const handleExport = () => {
    dispatch(getExportFile())
  }
  const handleDownloadSample = () => {
    const link1 = PropertyBulkUpload
    window.downloadFile = function (link) {
      window.open(link, '_blank')
    }
    window.downloadFile(link1)
  }

  const handleSort = (e, sortBy) => {
    let value
    if (sortName === sortBy.accessor) {
      value = (sortValue === 'DESC') ? 'ASC' : 'DESC'
      setSortName(sortBy.accessor)
      setSortValue(value)
    } else {
      setSortName(sortBy.accessor)
      setSortValue('DESC')
      value = 'DESC'
    }
    setCurrentSortId(sortBy.accessor)
    const payload = {
      field: "sorting",
      query: searchValue,
      sortingName: sortBy.accessor,
      sortingValue: value,
      page: parPage,
      limit: rowsPerPage,
      propertyTypeId: "",
      searchQuery: searchValue
      // selectedField: searchSelect
    }
    dispatch(getPropertyData(payload))
  }
  const changeUsegeId = (e) => {
    setUsageId(e.target.value)
  }

  const checkValidity = (checkData) => {
    let isError = false
    let ContainmentTypeIdErr = false
    let ulbSelectedId = false
    let OwnerNameErr = false
    let PropertyTypeIdErr = false
    let phoneNoErr = false
    // let zoneNameErr = false
    // let wardNumberErr = false
    // let pincodeErr = false

    if (ContainmentTypeId === "" && checkData === "handleSubmit") {
      ContainmentTypeIdErr = true
      setContainmentTypeErr(`${t('required')}`)
    } else {
      ContainmentTypeIdErr = false
      setContainmentTypeErr("")
    }
    if (ulbSelectedId === "" && checkData === "handleSubmit") {
      ulbSelectedId = true
      setUlbNameErr(`${t('required')}`)
    } else {
      ulbSelectedId = false
      setUlbNameErr("")
    }
    if (OwnerName === "" && checkData === "handleSubmit") {
      OwnerNameErr = true
      setownerNameErr(`${t('required')}`)
    } else {
      OwnerNameErr = false
      setownerNameErr("")
    }
    if (PropertyTypeId === "" && checkData === "handleSubmit") {
      PropertyTypeIdErr = true
      setPropTypeErr(`${t('required')}`)
      // this.setState({ propTypeErr: `${t("required")}` })
    } else {
      PropertyTypeIdErr = false
      setPropTypeErr("")
    }

    if (phoneNo === "" && checkData === "handleSubmit") {
      phoneNoErr = true
      setPhoneNoErr(`${t('required')}`)
    } else {
      phoneNoErr = false
      setPhoneNoErr("")
    }
    // added validation for if zones no. are unknown and you have ward no.
    // if (wardNumber !== "" && checkData === "handleSubmit") {
    //   if (zoneName !== "" && checkData === "handleSubmit") {
    //     zoneNameErr = false
    //     setZoneErr("")
    //   } else {
    //     zoneNameErr = true
    //     setZoneErr('Kindly enter "NA" if you are unknown to zone no.')
    //   }

    // } else {
    //   zoneNameErr = true
    //   setZoneErr(`${t('required')}`)

    // }
    // // added validation for if zones no. are unknown and you have ward no.
    // if (zoneName !== "" && checkData === "handleSubmit") {
    //   if (wardNumber !== "" && checkData === "handleSubmit") {
    //     wardNumberErr = false
    //     setWardNoErr("")
    //   } else {
    //     wardNumberErr = true
    //     setWardNoErr('Kindly enter "NA" if you are unknown to ward no.')
    //   }
    // } else {
    //   wardNumberErr = true
    //   setWardNoErr(`${t('required')}`)
    // }
    // if (zoneName === "" && checkData === "handleSubmit") {
    //   zoneNameErr = true
    //   setZoneErr(`${t('required')}`)
    // } else {
    //   zoneNameErr = false
    //   setZoneErr("")
    // }
    // if (wardNumber === "" && checkData === "handleSubmit") {
    //   wardNumberErr = true
    //   setWardNoErr(`${t('required')}`)
    // } else {
    //   wardNumberErr = false
    //   setWardNoErr("")
    // }
    // validation for pincode field.
    // if (pincode === "" && checkData === "handleSubmit") {
    //   pincodeErr = true
    //   setPincodeErr(`${t('required')}`)
    // } else {
    //   pincodeErr = false
    //   setPincodeErr("")
    // }
    if (!ContainmentTypeIdErr && !ulbSelectedId && !OwnerNameErr && !PropertyTypeIdErr && !phoneNoErr) {
      isError = false
    } else {
      isError = true
    }
    return isError
  }

  const handleChange = (e) => {
    switch (e.target.name) {
      case "OwnerName":
        setOwnerName(e.target.value)
        checkValidity()
        break
      case "Landmark":
        setLandmark(e.target.value)
        break
      case "TaxAssessment":
        setTaxAssessment(e.target.value)
        break
      case "HouseNo":
        setHouseNo(e.target.value)
        break
      case "Locality":
        setLocality(e.target.value)
        break
      case "zoneName":
        setZoneNumber(e.target.value)
        checkValidity()
        break
      case "wardNumber":
        setWardNumber(e.target.value)
        checkValidity()
        break
      // case "comment":
      //   setComment(e.target.value)
      //   break
      case "phoneNo":
        setPhoneNo(e.target.value)
        checkValidity()
        break
      case "PropertyTypeId":
        setPropertyTypeId(e.target.value)
        checkValidity()
        break
      case "ContainmentTypeId":
        setContainmentTypeId(e.target.value)
        checkValidity()
        break
      // case "pincode":
      //   setPincode(e.target.value)
      //   checkValidity()
      //   break
      // case "selectedDayMonthId":
      //   setSelectedDayMonthId(e.target.value)
      //   break
      // case "month":
      //   setMonth(e.target.value)
      //   break
      // case "days":
      //   setDays(e.target.value)
      //   break
      case "ulbSelectedId":
        setUlbSelectedId(e.target.value)
        checkValidity()
      break
      case "TimeRange":
        const splitTime = e.target.value.split(" - ") //['08:10 AM', '10:00 AM']
        const startRangeTime = splitTime[0] // 08:00 AM
        const endTimeRange = splitTime[1]
        setEndTimeRange(endTimeRange)
        setStartRangTime(startRangeTime)
        setTimeRange(e.target.value)
      break
      // case "emergencyId":
      //   setEmergencyId(e.target.value)
      //   break
      default:
        setLatitude("")
        setLongitude("")
        break
    }
    checkValidity("handleChange")
  }
  const handleClose = () => {
    setModal(false)
    // setPicture("")
    setLatitude("")
    setLongitude("")
    setUlbSelectedId("")
    // setDays("")
    // setPincode("")
    // setSelectedDayMonthId("")
    setContainmentTypeId("")
    setPhoneNo("")
    setPropertyTypeId("")
    // setComment("")
    setWardNumber("")
    setZoneNumber("")
    setLocality("")
    setHouseNo("")
    setLandmark("")
    setTaxAssessment("")
    setOwnerName("")
    setPropertyEditId("")
    setZoom(18)
    setCenter({ lat: "", lng: "" })
    setownerNameErr("")
    setPhoneNoErr("")
    setPropTypeErr("")
    setContainmentTypeErr("")
    setUlbNameErr("")
    // setZoneErr("")
    // setWardNoErr("")
    // setPincodeErr("")
  }
  const handleSumbit = (e) => {
    e.preventDefault()
    const err = checkValidity("handleSubmit")
    if (!err) {
      if (PropertyEditId !== "") {
      //   const formdata = new FormData()
        // formdata.append("id", PropertyEditId)
      //   formdata.append("Name", Landmark)
      //   formdata.append("OwnerName", OwnerName)
        // formdata.append("PropertyTypeId", PropertyTypeId)
        // formdata.append("ContainmentTypeId", ContainmentTypeId)
      //   formdata.append("Zone", zoneName)
        // formdata.append("Ward", wardNumber)
      //   // formdata.append("LastEmptiedDays", days)
      //   // formdata.append("LastEmptiedMonths", month)
      //   // formdata.append("Emergency", emergencyId)
      //   // formdata.append("Comments", comment)
      //   // formdata.append("Photo", picture)
      //   formdata.append("PhoneNumber", phoneNo)
      //   formdata.append("ULBId", ulbSelectedId)
      //   formdata.append("PinCode", pincode)//sending data to API
      //   formdata.append("UsageId", usegeId)//sending data to api
      //   formdata.append("ASSESSMENT_NO", TaxAssessment)//sending data to api
      //   formdata.append("OWNER_DOORNO", HouseNo)//sending data to api
      //   formdata.append("Latitude", latitude)//sending data to api
      //   formdata.append("Longitude", longitude)//sending data to api
      //   formdata.append("Locality", Locality)//sending data to api
        // dispatch(EditPropertyDetails(formdata))
      //   handleClose()
      // } else {

        const formdata = new FormData()
        formdata.append("id", PropertyEditId)
        formdata.append("Name", Landmark)
        formdata.append("OwnerName", OwnerName)
        formdata.append("Zone", zoneName)
        formdata.append("Ward", wardNumber)
        formdata.append("PhoneNumber", phoneNo)
        formdata.append("ULBId", ulbSelectedId)
        formdata.append("PinCode", "NA")//sending data to api
        formdata.append("UsageId", usegeId)//sending data to api
        formdata.append("ASSESSMENT_NO", TaxAssessment)//sending data to api
        formdata.append("OWNER_DOORNO", HouseNo)//sending data to api
        formdata.append("Latitude", latitude)//sending data to api
        formdata.append("Longitude", longitude)//sending data to api
        formdata.append("Locality", Locality)//sending data to api
        // formdata.append("OtherTypeData", )//sending data to api
        formdata.append("UpcomingColletionDate", moment(visitDate).format())
        formdata.append("UpcomingColletionStartTime", startRangeTime)
        formdata.append("PropertyTypeId", PropertyTypeId)
        formdata.append("ContainmentTypeId", ContainmentTypeId)
        formdata.append("UpcomingColletionEndTime", endTimeRange)
        dispatch(EditPropertyDetails(formdata))
        handleClose()
      }
    }
  }

  // const hiddenFileInput = useRef(null)
  // // const hiddenFileInputBulk = useRef(null)

  // const handleClick = event => {
  //   console.log(event)
  //   hiddenFileInput.current.click()
  // }
  // const handleChangeFile = event => {
  //   const fileUploaded = event.target.files[0]
  //   setPicture(fileUploaded.name)
  // }
  // const handleRemovedImage = () => {
  //   setPicture("")
  // }
  // const handleMapClick = (x) => {
  //   setLatitude(x.lat)
  //   setLongitude(x.lng)
  // }
  const handleApiLoaded = (map) => {
    map.addListener('click', e => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setLatitude(lat)
      setLongitude(lng)
    })

  }
  const handleMap = () => {
    if (document.fullscreenElement) {
      // this.setState({ position: 'fixed', top: 0, left: 0 })
      const screenClass = document.getElementsByClassName("current-loct-pro")
      for (let index = 0; index < screenClass.length; index++) {
        const element = screenClass[index]
        element.style["left"] = "670px"
        element.style.top = "230px"
        element.style.position = 'fixed'
      }
    } else {
      // this.setState({ position: 'inherit', top: '50%', left: '50%' })
      const screenDeClass = document.getElementsByClassName("current-loct-pro")
      for (let index = 0; index < screenDeClass.length; index++) {
        const elementOff = screenDeClass[index]
        elementOff.style["left"] = ""
        elementOff.style.top = "unset"

      }
    }
  }
  const getCurrentLocation = () => {
    const success = position => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const centerUPdate = {
        lat: latitude,
        lng: longitude
      }
      setLatitude(parseFloat(latitude))
      setLongitude(parseFloat(longitude))
      setZoom(18)
      setCenter(centerUPdate)
    }

    const error = () => {
      return new Swal({
        icon: 'warning',
        title: "Browser location is blocked",
        text: "Kindly unlocked the location from setting."
      })
    }
    navigator.permissions.query({ name: 'geolocation' }).then(permission => {
      if (permission.state === "granted") {
        navigator.geolocation.getCurrentPosition(success, error)
      } else if (permission.state === "prompt") {
        navigator.geolocation.getCurrentPosition(success, error)

      } else if (permission.state === "denied") {
        navigator.geolocation.getCurrentPosition(success, error)
      }
    })

  }
  const handleEdit = (data) => {
    // const selectDayMonthP = (data.lastEmptiedMonths !== "null" && data.lastEmptiedMonths !== null) ? "M" : (data.lastEmptiedDays !== "null" && data.lastEmptiedDays !== null) ? "D" : ""
    setModal(!modal)
    setTimeRange(`${data.UpcomingColletionStartTime} - ${data.UpcomingColletionEndTime}`)
    setEndTimeRange(data.UpcomingColletionEndTime)
    setStartRangTime(data.UpcomingColletionStartTime)
    setVisitDate(new Date(data.upcomingColletionDate))
    // setPicture(data.photo)
    setLatitude(Number(data.latitude))
    setLongitude(Number(data.longitude))
    setUlbSelectedId(data.ulbId)
    // setDays(data.lastEmptiedDays)
    // setMonth(data.lastEmptiedMonths)
    // setPincode(data.pinCode)
    // setSelectedDayMonthId(selectDayMonthP)
    setContainmentTypeId(data.containmentTypeId)
    setPhoneNo(data.phoneNumber)
    setPropertyTypeId(data.propertyTypeId)
    // setComment(data.comments)
    setWardNumber(data.ward)
    setZoneNumber(data.zone)
    setLocality(data.locality)
    setHouseNo(data.ownerDoorNo)
    setTaxAssessment(data.assessment_no)
    setOwnerName(data.ownerName)
    setLandmark(data.name)
    setUsageId(data.UsageId)
    setPropertyEditId(data.propertyId)
    setZoom(18)
    setCenter({ lat: Number(data.latitude), lng: Number(data.longitude) })
  }
  const handleDelete = (propId) => {
    const payload = {
      id: propId
    }
    dispatch(PropertyDelete(payload))
  }
  return (
    <>
      <Fragment>
        <Breadcrumbs title={t('propertyMangHeading')} data={[{ title: 'PropertyManagement' }, { title: `${t('propertyMangHeading')}` }]} />      </Fragment>

      <Card>
        <CardHeader className='flex flex-column align-items-end border-bottom'>
          <Row className="align-items-end">
            <Col className='d-flex align-items-center' sm='6'>
              <Label className='me-1' for='search-input'>
                {t('search')}
              </Label>
              <Input
                className='dataTable-filter mb-0'
                type='text'
                bsSize='md'
                id='search-input'
                value={searchValue}
                placeholder={t('searchLandmark')}
                onChange={handleFilter}
              />
            </Col>
            <Col className='d-flex align-items-end me-0 pe-3' sm='6' >
              <Button className='ms-2' color='primary' onClick={handleExport}>
                <span className='align-middle ms-50'>{t('export')}</span>
              </Button>
              <UncontrolledButtonDropdown className='ms-2' >
                <DropdownToggle color='secondary' caret outline>
                  <span className='align-middle ms-50'>Add Properties</span>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem className='w-100' tag={Link} to="/addProperty">
                  {/* <Link to ={{pathname: "/addProperty", state: {moduleStatus:"propertyModule" }}}  className="text-body"> */}
                    <span className='align-middle'  >{t('singleProp')}</span>
                    {/* </Link> */}
                  </DropdownItem>

                  <DropdownItem className='w-100'>
                    <div>
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className='d-flex'>
                          <span>{t('bulkUpload')}</span>
                          <p className='text-secondary'>
                            <a href='/' onClick={e => e.preventDefault()}>
                            </a>{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem className='w-100' onClick={handleDownloadSample}>
                    <span className='align-middle ' >{t('downloadSamp')}</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>

            </Col>
          </Row>
        </CardHeader>

        <div className='react-dataTable'>
          <Table responsive>
            <thead>
              <tr>
                {columns.length !== 0 ? columns.map((item, index) => {
                  return <th key={index} scope='col' className='text-nowrap'>
                    {item.header}
                    {item.header === "Action" || item.accessor === "photo" ? "" : <> {currentSortId === item.accessor && sortValue === "ASC" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}

                  </th>
                }) : []}
              </tr>

            </thead>
            <tbody>
              {!!propertystore && propertystore.length !== 0 ? propertystore.map((val, i) => {
                return <tr key={i}>{
                  columns.map((accesser, h) => {
                    switch (accesser.accessor) {
                      case "updatedAt":
                        return val["updatedAt"] === null ? <td>_</td> : <td key={h}>{moment(val["updatedAt"]).format("lll")}</td>
                      case "createdAt":
                        return val["createdAt"] === null ? <td>_</td> : <td key={h}>{moment(val["createdAt"]).format("lll")}</td>
                      // case "photo":
                      //   return val["photo"] === null || val["photo"] === "null" ? <td>_</td> : <td><a href={`http://smartfsm-test.transerve.live/${val["photo"]}`}>{t('View')}</a></td>
                      // case "comments":
                      //   return val["comments"] === "null" || val["comments"] === null ? <td>_</td> : <td key={h}>{val["comments"]}</td>
                      case "assessment_no":
                        return val["assessment_no"] === "null" || val["assessment_no"] === null ? <td>_</td> : <td key={h}>{val["assessment_no"]}</td>
                      // case "emergencData":
                      //   return val["emergencData"] === 'null' || val["emergencData"] === null || val["emergencData"] === '' ? <td>_</td> : <td key={h}>{val["emergencData"]}</td>
                      // case "lastEmptiedDays":
                      //   return val["lastEmptiedDays"] === 'null' || val["lastEmptiedDays"] === null || val["lastEmptiedDays"] === '' ? <td>_</td> : <td key={h}>{val["lastEmptiedDays"]}</td>
                      // case "lastEmptiedMonths":
                      //   return val["lastEmptiedMonths"] === 'null' || val["lastEmptiedMonths"] === null || val["lastEmptiedMonths"] === '' ? <td>_</td> : <td key={h}>{val["lastEmptiedMonths"]}</td>
                      case "UpcomingColletionEndTime":
                          return (val["UpcomingColletionStartTime"] === null && val["UpcomingColletionEndTime"] === null) || (val["UpcomingColletionStartTime"] === "null" && val["UpcomingColletionEndTime"] === "null") ? <td>_</td> : <td key={h}>{`${val["UpcomingColletionStartTime"]} - ${val["UpcomingColletionEndTime"]}`}</td>
                      case "latitude":
                        return val[accesser.accessor] === 'null' || val[accesser.accessor] === null || val[accesser.accessor] === '' ? <td>_</td> : <td key={h}>{val[accesser.accessor] ? (val[accesser.accessor]).slice(0, 8) : ""}</td>
                      case "longitude":
                        return val[accesser.accessor] === 'null' || val[accesser.accessor] === null || val[accesser.accessor] === '' ? <td>_</td> : <td key={h}>{val[accesser.accessor] ? (val[accesser.accessor]).slice(0, 8) : ""}</td>
                      case "actionButton":
                        return <div className='d-flex align-items-center justify-content-center'>
                          <UncontrolledDropdown>
                            <DropdownToggle className='pe-1' tag='span'>
                              <MoreVertical size={15} style={{ cursor: "pointer" }} />
                            </DropdownToggle>
                            <DropdownMenu end>
                              <DropdownItem onClick={() => handleEdit(val)}>
                                <FileText size={15} />
                                <span className='align-middle ms-50' >{t('edit')}</span>
                              </DropdownItem>
                              <DropdownItem onClick={() => {
                                new Swal({
                                  title: `${t("ulbDeleteErr1")}`,
                                  text: `${t("ulbDeleteErr2")}`,
                                  icon: "warning",
                                  showDenyButton: true,
                                  confirmButtonText: `${t("ulbDeleteErr3")}`,
                                  denyButtonText: `${t("ulbDeleteErr4")}`,
                                  customClass: {
                                    confirmButton: 'btn btn-primary mx-2',
                                    cancelButton: 'btn btn-danger mx-2'
                                  }
                                }).then((willDelete) => {
                                  if (willDelete.isConfirmed) {
                                    handleDelete(val.propertyId)
                                  }

                                }
                                )
                              }}>
                                <Trash size={15} />
                                <span className='align-middle ms-50' >{t('delete')}</span>
                              </DropdownItem>
                              <DropdownItem onClick={() => handleLoadListing(val)}>
                                <FileText size={15} />
                                <span className='align-middle ms-50' >{t('loads')}</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      default:
                        return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null || val[accesser.accessor] === "null" ? "_" : val[accesser.accessor]}</td>
                    }
                  })
                }
                </tr>
              }) : []}
              { }
            </tbody>
          </Table>
          <div className="d-flex float-end">
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>{t('Page')}</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                style={{ width: "90px" }}
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>

              <ReactPaginate
                previousLabel={''}
                nextLabel={''}
                breakLabel='...'
                pageCount={count}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                activeClassName='active'
                forcePage={currentPage}
                onPageChange={page => handlePagination(page)}
                pageClassName='page-item'
                breakClassName='page-item'
                nextLinkClassName='page-link'
                pageLinkClassName='page-link'
                breakLinkClassName='page-link'
                previousLinkClassName='page-link'
                nextClassName='page-item next-item'
                previousClassName='page-item prev-item'
                containerClassName={
                  'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
                }
              />
            </div>
          </div>
        </div>
      </Card>

      <Modal isOpen={modal} toggle={handleModalClose} className='modal-dialog-centered modal-lg' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={handleModalClose}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h3 className='mb-1'>{`${t('editProp')}`}</h3>
          </div>
          <Row tag='form' className='gy-1 pt-75'>
          <Col md={6} xs={12}>
              <Label className='form-label' for='HouseNo'>
                {t('HouseNo')}
              </Label>
              <Input onChange={handleChange} name="HouseNo" value={HouseNo} id='HouseNo' placeholder={t('Enterhouseno')} />

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='TaxAssessment'>
                {t('TaxAssessmentNo')}
              </Label>
              <Input onChange={handleChange} name="TaxAssessment" value={TaxAssessment} id='TaxAssessment' placeholder={t('EnterTaxAssessmentNo')} />

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='OwnerName'>
                {t("ownerName")} <span style={{ color: "red", fontSize: '15px' }}>*</span>
              </Label>
              <Input
                id='OwnerName'
                placeholder={t("phownerName")}
                value={OwnerName}
                name="OwnerName"
                onChange={handleChange}

              />
              <div style={{ color: "red" }}>{ownerNameErr}</div>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='Locality'>
                {t('Locality')}
              </Label>
              <Input onChange={handleChange} name="Locality" value={Locality} id='Locality' placeholder={t("EnterLocality")} />

            </Col>
            {/* <Col md={6} xs={12}>
              <Label className='form-label' for='pincode'>
                {t('pincode')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
              </Label>
              <Input
                id='pincode'
                placeholder={t('placeholderPincode')}
                value={pincode}
                name="pincode"
                type="number"
                onWheel={event => event.currentTarget.blur()}
                onChange={handleChange}
              />
              <div style={{ color: "red" }}>{PincodeErr}</div>

            </Col> */}
            <Col md={6} xs={12}>
              <Label className='form-label' for='ulbName'>
                {t('ulbName')}
              </Label>
              <Input type='select' name='ulbSelectedId' id='ulbSelectedId' value={ulbSelectedId} onChange={handleChange}>
                <option value={""}>{t('select')}</option>
                {ulbOptionList.map((item) => {
                  return <option value={item.Id}>{item.Name}</option>

                })}

              </Input>
              <div style={{ color: "red" }}>{ulbNameErr}</div>

            </Col>
         
          
            <Col md={6} xs={12}>
              <Label>{t('Usage')}</Label>
              <Input value={usegeId} type='select' name='usegeId' id='usegeId' onChange={e => changeUsegeId(e)}>
                <option value={""}>{t('select')}</option>
                {usageOption.map((item) => {
                  return <option value={item.Id}>{item.Name}</option>

                })}

              </Input>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='PhoneNo'>
                {t('phoneNumber')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
              </Label>
              <Input onChange={handleChange} name="phoneNo" value={phoneNo} type="number" id='PhoneNo' onWheel={event => event.currentTarget.blur()} placeholder={t('phPhoneNumber')} />
              <div style={{ color: "red" }}>{phoneNoErr}</div>

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='Landmark'>
                {t('propAddress')}
              </Label>
              <Input onChange={handleChange} name="Landmark" value={Landmark} id='Landmark' placeholder={t("phpropAddress")} />

            </Col>
            <Col md={6} xs={12} lg={6} sm={12}>
                  <Label className='form-label' for='visitDate'>
                      {t('DatetoVisit')}
                  </Label>
                  <Flatpickr
                      id='visitDate'
                      name='visitDate'
                      className='form-control'
                      onChange={date => setVisitDate(date[0])}
                      value={visitDate}
                      options={{ dateFormat: 'd M Y' }}
                  />
              </Col>
              <Col md={6} xs={12} lg={6} sm={12}>
                                <Label className='form-label' for='TimeRange'>
                                    {t('TimeRange')}
                                </Label>
                                <Input value={TimeRange} name="TimeRange" type="select" onChange={handleChange}>
                                    <option value={`08:00 AM - 10:00 AM`}>08:00 AM - 10:00 AM</option>
                                    <option value={`10:00 AM - 12:00 PM`}>10:00 AM - 12:00 PM</option>
                                    <option value={`12:00 PM - 02:00 PM`}>12:00 PM - 02:00 PM</option>
                                    <option value={`02:00 PM - 04:00 PM`}>02:00 PM - 04:00 PM</option>
                                    <option value={`04:00 PM - 06:00 PM`}>04:00 PM - 06:00 PM</option>
                                    <option value={`06:00 PM - 08:00 PM`}>06:00 PM - 08:00 PM</option>
                                </Input>
                            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='propType'>
                {t('propType')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
              </Label>

              <Input type='select' name='PropertyTypeId' id='PropertyTypeId' value={PropertyTypeId} onChange={(e) => handleChange(e)}>
                <option value={""}>{t('select')}</option>
                {PropertyOption.map((item) => {
                  return <option key={item.id} value={item.id}>{item.name}</option>

                })}

              </Input>

              <div style={{ color: "red" }}>{PropTypeErr}</div>

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='containmentType'>
                {t('containmentType')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
              </Label>
              <Input type='select' name='ContainmentTypeId' id='ContainmentTypeId' value={ContainmentTypeId} onChange={handleChange}>
                <option value={""}>{t('select')}</option>
                {ContainmentOptions.map((item) => {
                  return <option value={item.id}>{item.name}</option>

                })}

              </Input>
              <div style={{ color: "red" }}>{ContainmentTypeErr}</div>

            </Col>
        
            <Col md={6} xs={12}>
              <Label className='form-label' for='zone'>
                {t('zoneName')}
              </Label>
              <Input onChange={handleChange} name="zoneName" value={zoneName} id='zone' placeholder={t('phZone')} />
              {/* <div style={{ color: "red" }}>{ zoneName === "" ? 'Kindly enter "NA" if you are unknown to zone no.' : zoneErr}</div> */}
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='wardNo'>
                {t('wardNo')}
              </Label>
              <Input onChange={handleChange} name="wardNumber" value={wardNumber} id='wardNo' placeholder={t('phWard')} />
              {/* <div style={{ color: "red" }}>{zoneName !== "" && wardNumber === "" ? 'Kindly enter "NA" if you are unknown to ward no.' : wardNoErr}</div> */}
            </Col>
          
            {/* <Col md={6} xs={12}>
              <Label className='form-label' for='logo'>{t('photo')} </Label>
              <div>
                {picture === "" ? "" : <span className='d-flex justify-content-end'> <X className='cursor-pointer text-primary' size={15} onClick={handleRemovedImage} /></span>}
                <Button onClick={handleClick} style={{ width: '100%' }}>
                  {t('uploadPhoto')}
                </Button>
                <input type="file"
                  ref={hiddenFileInput}
                  onChange={handleChangeFile}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>
              <div style={{ color: "3b6796" }}>{picture}</div>
            </Col> */}
            {/* <Col md={6} xs={12}>
              <Label className='form-label' for='emergency'>
                {t('emergency')}
              </Label>
              <Input type='select' name='emergencyId' id='emergencyId' value={emergencyId} onChange={handleChange}>
                {emergency.map((item) => {
                  return <option value={item.value}>{item.label}</option>

                })}

              </Input>

            </Col> */}
            {/* <Col md={6} xs={12}>
              <Label className='form-label' for='comment'>
                {t('comment')}
              </Label>
              <Input onChange={handleChange} name="comment" value={comment} id='comment' placeholder={t('phComment')} />

            </Col> */}
            {/* <Col md={6} xs={12}>
              <Label className='form-label' for='selectDayMonth'>
                {t('lastEmptied')}
              </Label>

              <Input type='select' name='selectedDayMonthId' id='selectedDayMonthId' value={selectedDayMonthId} onChange={handleChange}>
                <option value={""}>{t('select')}</option>
                {selectDayMonth.map((item) => {
                  return <option value={item.value}>{item.label}</option>

                })}

              </Input>
            </Col> */}
            {/* {selectedDayMonthId === "M" ? <Col md={6} xs={12}>
              <Label className='form-label' for='month'>
                {t('months')}
              </Label>
              <Input
                id='month'
                placeholder={t('phMonths')}
                value={month}
                name="month"
                onChange={handleChange}

              />
            </Col> : selectedDayMonthId === "D" ? <Col md={6} xs={12}>   <Label className='form-label' for='month'>
              {t('days')}
            </Label>
              <Input
                id='days'
                placeholder={t('phDays')}
                value={days}
                name="days"
                onChange={handleChange}

              /></Col> : ""} */}
            <Col md={6} xs={12}></Col>
            <Col md={12} xs={12} lg={12}>
              <div style={{ height: '30vh', width: '100%', paddingBottom: '15px', position: "10px", top: 0, left: 0 }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: maps_key }}
                  center={center}
                  zoom={zoom}
                  // onClick={handleMapClick}
                  onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                  yesIWantToUseGoogleMapApiInternals
                  onChange={handleMap}
                >
                  <Marker
                    lat={latitude}
                    lng={longitude}
                    name="My Marker"
                    color="blue" />
                  <div className="current-loct-pro" >
                    <img style={{ height: '25px', width: "25px" }} src={location} onClick={() => getCurrentLocation()} />
                  </div>
                </GoogleMapReact>
              </div>

            </Col>

            <Col md={6} xs={12}>
              <Label className='form-label' for='latitude'>
                {t('latitude')}
              </Label>
              <Input disabled required onChange={handleChange} name="latitude" value={evaluateLocation(latitude)} id='latitude' placeholder={t('phlatitude')} />
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='longitude'>
                {t('longitude')} </Label>
              <Input disabled required onChange={handleChange} name="longitude" value={evaluateLocation(longitude)} id='longitude' placeholder={t('phlongitude')} />
            </Col>

            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='reset' className='me-1' color='secondary' outline onClick={handleClose}>
                {t('cancel')}
              </Button>
              <Button type='submit' color='primary' onClick={handleSumbit}>
                {PropertyEditId !== "" ? `${t("saveChange")}` : `${t("save")}`}
              </Button>

            </Col>
          </Row>
        </ModalBody>
      </Modal>


      {/* loads listing */}
      <Modal isOpen={openLoadsListing} toggle={handleLoadListing} className='modal-dialog-centered modal-xl' backdrop="static">
        <ModalHeader className='bg-transparent' toggle={handleLoadListing}>{t('loads')}</ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='react-dataTable'>
            <Table responsive>
              <thead>
                <tr>
                  {propertyLoadsHeader.length !== 0 ? propertyLoadsHeader.map((item, index) => {
                    return <th key={index} scope='col' className='text-nowrap'>
                      {item.header}

                    </th>
                  }) : []}
                </tr>

              </thead>
              <tbody>
                {!!loadsPropertyListing && loadsPropertyListing.length !== 0 ? loadsPropertyListing.map((val, i) => {
                  return <tr key={i}>{
                    propertyLoadsHeader.map((accesser, h) => {
                      return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null ? "_" : val[accesser.accessor]}</td>

                    })
                  }
                  </tr>
                }) : []}
              </tbody>

            </Table>
            <div className="d-flex float-end">
              <div className='d-flex align-items-center'>
                <Label for='sort-select'>Page</Label>
                <Input
                  className='dataTable-select'
                  type='select'
                  style={{ width: "90px" }}
                  id='sort-select'
                  value={rowsPerPageLoads}
                  onChange={e => handlePerPageLoads(e)}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={75}>75</option>
                  <option value={100}>100</option>
                </Input>

              </div>
              <ReactPaginate
                previousLabel={''}
                nextLabel={''}
                breakLabel='...'
                pageCount={countLoads}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                activeClassName='active'
                forcePage={currentPageLoads}
                onPageChange={page => handlePaginationLoads(page)}
                pageClassName='page-item'
                breakClassName='page-item'
                nextLinkClassName='page-link'
                pageLinkClassName='page-link'
                breakLinkClassName='page-link'
                previousLinkClassName='page-link'
                nextClassName='page-item next-item'
                previousClassName='page-item prev-item'
                containerClassName={
                  'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
                }
              />
            </div>

          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default (withTranslation()(Property))