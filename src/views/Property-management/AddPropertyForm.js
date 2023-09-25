// ** Reactstrap Imports
import { Button, Row, Col, Label, Input, Card, InputGroup } from "reactstrap"
import { Search, Users, X } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import axios from '../../lib/ApiCall'
import Marker from "./marker"
import GoogleMapReact from 'google-map-react'
import { PropertyAddCitizen } from "../../redux/property"
// ** Styles
import { Link } from "react-router-dom"
import "@styles/base/pages/page-misc.scss"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import Swal from 'sweetalert2'
import moment from "moment"
import { withTranslation } from "react-i18next"
// import location from "../assets/images/current_location/Location.png"
import '../login.css'
import location from "@src/assets/images/current_location/Location.png"

/**
 * Evaluates lat long for 4 digit precision
 * @param {*} loc - Lat Long for evaluation
 */
function evaluateLocation(loc) {
    return loc.toString().length > 0 ? parseFloat(loc).toFixed(4) : ""
}
const AddPropertyForm = ({ t }) => {
    const token = JSON.parse(localStorage.getItem("userData"))
    const config = {
    headers: { Authorization: `Bearer ${token !== null ? token.token : ""}` }
    }
    // ** map key
    const maps_key = "AIzaSyBV5XySVlxwJm_lAJ2ZoecKismiBv1ZJAo"
    //state
    const [isHouseSearchFields, setIsHouseSearchField] = useState(false)
    const [isAssessmentSearchFields, setIsAssesmentSearchField] = useState(false)
    const [isAddPropertyFields, setIsAddPorpertyField] = useState(false)
    const [ShowHouseNoFields, setShowHouseNoFields] = useState(false)
    const [ShowAssesmentFields, setShowAssesmentFields] = useState(false)
    const [AssessmentNoState, setAssessmentNoState] = useState("")
    const [OwnerName, setOwnerName] = useState("")
    // const [OwnerNameErr, setOwnerNameErr] = useState("")
    const [Locality, setLocality] = useState("")
    // const [Pincode, setPincode] = useState("")
    const [ULBname, setULBname] = useState("")
    // // const [ULBnameErr, setULBnameErr] = useState("")
    const [Usage, setUsage] = useState(4)
    const [houseNo, setHouseNo] = useState("")
    const [ulbOption, setUlbOptionList] = useState([])
    const [ContainmentOption, setContainmentOptionList] = useState([])
    const [ContainmentType, setContainmentType] = useState("")
    // const [ContainmentTypeErr, setContainmentTypeErr] = useState("")
    const [PropertyTypeOption, setPropertyTypeList] = useState([])
    const [propertyType, setPropertyType] = useState("")
    // const [propertyTypeErr, setPropertyTypeErr] = useState("")
    const [phoneNumber, setphoneNumber] = useState(localStorage.getItem('PhoneNumber'))
    // // const [PhoneNumberErr, setphoneNumberErr] = useState("")
    const [LandMark, setLandMark] = useState("")
    const [zoneName, setZoneName] = useState("")
    const [WardNumber, setWardNumber] = useState("")
    // const [Emergency, setEmergency] = useState("No")
    // const [OperatorOption, setOperatorOption] = useState([])
    // const [OperaterName, setOperaterName] = useState("")
    const [visitDate, setVisitDate] = useState(new Date())
    // const [selectedDayMonthId, setSelectedDayMonthId] = useState("")
    // const [month, setMonth] = useState("")
    // const [days, setDays] = useState("")
    // const [picture, setPicture] = useState("")
    const [TimeRange, setTimeRange] = useState("08:00 AM - 10:00 AM")
    // const [comment, setComment] = useState("")
    const [zoom, setZoom] = useState(18)
    const [center, setCenter] = useState({ lat: "", long: "" })
    const [centerBothShow, setCenterBothSHow] = useState({ lat: "", long: "" })
    const [latitude, setLatitude] = useState(17.8302)
    const [longitude, setLongitude] = useState(79.2778)
    const [latitudeBothShow, setLatitudeBothShow] = useState(17.8302)
    const [longitudeBothShow, setLongitudeBothShow] = useState(79.2778)
    // const [randomCaptcha, setRandomCaptcha] = useState("")
    // const [captcha, setCaptcha] = useState("")
    // // const [captchaErr, setCaptchaErr] = useState("")
    const [AssessmentNoSearch, setAssessmentNoSearch] = useState("")
    const [endTimeRange, setEndTimeRange] = useState("10:00 AM")
    const [startRangeTime, setStartRangTime] = useState("08:00 AM")
    const [UsageOption, setUsageOption] = useState([])
    const [OtherComment, setOtherComment] = useState("")
    const [UlbName, setUlbName] = useState('')
    const [map, setMap] = useState(false)
    const dispatch = useDispatch()
    // const selectDayMonth = [
    //     { value: 'M', label: 'Months' },
    //     { value: 'D', label: 'Days' }
    // ]
    useEffect(() => {
        // auth/getAllUlb
        axios.get(`ulb/getAllUlb`, config).then((res) => {
            setUlbOptionList(res.data.data)
            // console.log(res.data.data[0].Id)
            setULBname(res.data.data[0].Id)
            setUlbName(res.data.data[0].Name)
        })
        // auth/getContainmentType 
        axios.get(`auth/getContainmentType`).then((res) => {
            setContainmentOptionList(res.data.data)
        })
        // /property_type
        axios.get(`property_type`).then((res) => {
            setPropertyTypeList(res.data.data.propertyTypes)
        })
        // /auth/usageType
        axios.get(`auth/usageType`).then((res) => {
            setUsageOption(res.data.data.usageType)
        })
        // const dat = getCaptch(6)
        // setRandomCaptcha(dat)

        // if (ULBname !== "") { 
        //     axios.get(`auth/dropDown?ULBId=${e.target.value}`).then((res) => {
        //     setOperatorOption(res.data.data.operators)
        // })
        // }
    }, [])

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
            setLatitudeBothShow(parseFloat(latitude))
            setLongitudeBothShow(parseFloat(longitude))
            setZoom(18)
            setCenter(centerUPdate)
            setCenterBothSHow(centerUPdate)
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
    const success = position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const centerUPdate = {
            lat: latitude,
            lng: longitude
        }
        setLatitude(parseFloat(latitude))
        setLongitude(parseFloat(longitude))
        setLatitudeBothShow(parseFloat(latitude))
        setLatitudeBothShow(parseFloat(longitude))
        setZoom(18)
        setCenter(centerUPdate)
    }

    const error = () => {
        console.log("Unable to retrieve your location")
        navigator.permissions.query({ name: 'geolocation' }).then(permission => {
            if (permission.state === "granted") {
            } else if (permission.state === "prompt") {
                const tsCenter = {
                    lat: 17.8302,
                    lng: 79.2778
                }
                setLatitude(17.8302)
                setLongitude(79.2778)
                setLatitudeBothShow(17.8302)
                setLongitudeBothShow(79.2778)
                setZoom(7)
                setCenter(tsCenter)
                setCenterBothSHow(tsCenter)
            } else if (permission.state === "denied") {
                const tsCenter = {
                    lat: 17.8302,
                    lng: 79.2778
                }
                setLatitude(17.8302)
                setLongitude(79.2778)
                setLatitudeBothShow(17.8302)
                setLongitudeBothShow(79.2778)
                setZoom(7)
                setCenter(tsCenter)
                setCenterBothSHow(tsCenter)
            }
        })

    }
    const handleSeachByHouseNo = () => {
        setIsHouseSearchField(true)
        setIsAssesmentSearchField(false)
        setIsAddPorpertyField(false)
        setShowHouseNoFields(false)
        setShowAssesmentFields(false)
        setAssessmentNoState("")
        setOwnerName("")
        setLocality("")
        // setPincode("")
        setULBname("")
        setUsage("")
        setHouseNo('')
        setContainmentType("")
        setPropertyType("")
        setphoneNumber(localStorage.getItem('PhoneNumber'))
        setLandMark("")
        setZoneName("")
        setWardNumber("")
        // setEmergency("No")
        // setOperaterName("")
        setVisitDate(new Date())
        // setSelectedDayMonthId("")
        // setMonth("")
        // setDays("")
        // setPicture("")
        setTimeRange("08:00 AM - 10:00 AM")
        // setComment("")
        setZoom(18)
        setCenter({ lat: "", long: "" })
        setCenterBothSHow({ lat: "", long: "" })
        setLongitude(79.2778)
        setLatitude(17.8302)
        setLatitudeBothShow(17.8302)
        setLongitudeBothShow(79.2778)
        // setCaptcha("")
        setAssessmentNoSearch("")
        setEndTimeRange("10:00 AM")
        setStartRangTime("08:00 AM")
        // setOperatorOption([])
        // setOwnerNameErr()
        // setULBnameErr()
        // setContainmentTypeErr()
        // setCaptchaErr()
        // setPropertyTypeErr()
        // setphoneNumberErr()
        navigator.geolocation.getCurrentPosition(success, error)
    }
    const handleAssessmentNo = () => {
        setIsAssesmentSearchField(true)
        setIsHouseSearchField(false)
        setIsAddPorpertyField(false)
        setShowHouseNoFields(false)
        setShowAssesmentFields(false)
        setAssessmentNoState("")
        setOwnerName("")
        setLocality("")
        // setPincode("")
        setULBname("")
        setUsage("")
        setHouseNo('')
        setContainmentType("")
        setPropertyType("")
        setphoneNumber(localStorage.getItem('PhoneNumber'))
        setLandMark("")
        setZoneName("")
        setWardNumber("")
        // setEmergency("No")
        // setOperaterName("")
        setVisitDate(new Date())
        // setSelectedDayMonthId("")
        // setMonth("")
        // setDays("")
        // setPicture("")
        setTimeRange("08:00 AM - 10:00 AM")
        // setComment("")
        setZoom(18)
        setCenter({ lat: "", long: "" })
        setCenterBothSHow({ lat: "", long: "" })
        setLongitude(79.2778)
        setLatitude(17.8302)
        setLatitudeBothShow(17.8302)
        setLongitudeBothShow(79.2778)
        // setCaptcha("")
        setAssessmentNoSearch("")
        setEndTimeRange("10:00 AM")
        setStartRangTime("08:00 AM")
        // setContainmentTypeErr()
        // setPropertyTypeErr()
        // setOperatorOption([])
        //Location
        navigator.geolocation.getCurrentPosition(success, error)
    }
    const handleAddProperty = () => {
        setIsHouseSearchField(false)
        setIsAddPorpertyField(true)
        setIsAssesmentSearchField(false)
        setShowHouseNoFields(false)
        setShowAssesmentFields(false)
        setAssessmentNoState("")
        setOwnerName("")
        setLocality("")
        // setPincode("")
        setULBname("")
        setUsage(4)
        setHouseNo('')
        setContainmentType("")
        setPropertyType("")
        setphoneNumber(localStorage.getItem('PhoneNumber'))
        setLandMark("")
        setZoneName("")
        setWardNumber("")
        // setEmergency("No")
        // setOperaterName("")
        setVisitDate(new Date())
        // setSelectedDayMonthId("")
        // setMonth("")
        // setDays("")
        // setPicture("")
        setTimeRange("08:00 AM - 10:00 AM")
        // setComment("")
        setZoom(18)
        setCenter({ lat: "", long: "" })
        setCenterBothSHow({ lat: "", long: "" })
        setLatitudeBothShow(17.8302)
        setLongitudeBothShow(79.2778)
        // setCaptcha("")
        setAssessmentNoSearch("")
        setEndTimeRange("10:00 AM")
        setStartRangTime("08:00 AM")
        // setOperatorOption([])
        // setPropertyTypeErr()
        // setContainmentTypeErr()

        // location

        navigator.geolocation.getCurrentPosition(success, error)
        // ulb listing
        axios.get(`ulb/getAllUlb`, config).then((res) => {
            setUlbOptionList(res.data.data)
            setULBname(res.data.data[0].Id)
        })
    }
    // const handleMapClick = (e) => {

    //     console.log(e.lat, e.lng, "-------map")
    //     setLatitude(e.lat)
    //     setLongitude(e.lng)
    //     setLatitudeBothShow(e.lat)
    //     setLongitudeBothShow(e.lng)
    // }
    const handleApiLoaded = (map) => {
        map.addListener('click', e => {
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()
            setLatitude(lat)
            setLongitude(lng)
            setLatitudeBothShow(lat)
            setLongitudeBothShow(lng)
        })

    }
    const handleMap = () => {
        if (document.fullscreenElement) {
            // this.setState({ position: 'fixed', top: 0, left: 0 })
            // const screenClass = document.getElementById("location-icon")
            // for (let index = 0; index < screenClass.length; index++) {
            //     // const element = screenClass[index]
            //     // element.style.bottom = "0px"
            //     // element.style.top = "230px"
            //     // element.style.position = "fixed"
            // }
            setMap(true)
            document.className = 'location-icon'
        } else {
            // this.setState({ position: 'inherit', top: '50%', left: '50%' })
            setMap(false)
            const screenDeClass = document.getElementsByClassName("current-loct")
            for (let index = 0; index < screenDeClass.length; index++) {
                const elementOff = screenDeClass[index]
                elementOff.style["left"] = ""
                elementOff.style.top = "unset"

            }
        }
    }
    // const checkValiditon = () => {
    //     let error = true
    //     // console.log(OwnerName, "OwnerNamess")
    //     if (OwnerName !== "") {
    //         error = false
    //         setOwnerNameErr("")
    //     } else {
    //         error = true
    //         setOwnerNameErr(`${t('required')}`)
    //     }
    //     if (ULBname) {
    //         error = false
    //         setULBnameErr("")
    //     } else {
    //         error = true
    //         setULBnameErr(`${t('required')}`)
    //     }
    //     if (ContainmentType !== "") {
    //         error = false
    //         setContainmentTypeErr("")
    //     } else {
    //         error = true
    //         setContainmentTypeErr(`${t('required')}`)
    //     }
    //     if (propertyType !== "") {
    //         error = false
    //         setPropertyTypeErr("")
    //     } else {
    //         error = true
    //         setPropertyTypeErr(`${t('required')}`)
    //     }
    //     if (phoneNumber === "") {
    //         error = true
    //         setphoneNumberErr(`${t('required')}`)
    //     } else {
    //         error = false
    //         setphoneNumberErr("")
    //     }
    //     if (captcha !== "") {
    //         error = false
    //         setCaptchaErr("")
    //         if (randomCaptcha.length === captcha.length || randomCaptcha.length === captcha.length + 1) {
    //             error = false
    //             setCaptchaErr("")
    //         } else {
    //             error = true
    //             setCaptchaErr(`${t('EnterValidCaptcha')}`)
    //         }
    //     } else {
    //         error = true
    //         setCaptchaErr(`${t('required')}`)
    //     }

    //     return error
    // }
    const handleChange = (e) => {
        switch (e.target.name) {
            // case "houseNo":
            //     setHouseNo(e.target.value)
            //     break
            // case "ContainmentType":
            //     setContainmentType(e.target.value)
            //     checkValiditon()
            //     break
            // case "propertyType":
            //     setPropertyType(e.target.value)
            //     checkValiditon()
            //     break
            // case "phoneNumber":
            //     checkValiditon()
            //     setphoneNumber(e.target.value)
            //     break
            // case "LandMark":
            //     setLandMark(e.target.value)
            //     break
            // case "zoneName":
            //     setZoneName(e.target.value)
            //     break
            // case "WardNumber":
            //     setWardNumber(e.target.value)
            //     break
            // case "Emergency":
            //     setEmergency(e.target.value)
            //     break
            // case "ULBname":
            //     axios.get(`auth/dropDown?ULBId=${e.target.value}`).then((res) => {
            //         setOperatorOption(res.data.data.operators)
            //     })
            //     setULBname(parseInt(e.target.value))
            //     checkValiditon()
            //     break
            // case "OperaterName":
            //     setOperaterName(e.target.value)
            //     break
            case "TimeRange":
                const splitTime = e.target.value.split(" - ") //['08:10 AM', '10:00 AM']
                const startRangeTime = splitTime[0] // 08:00 AM
                const endTimeRange = splitTime[1]
                setEndTimeRange(endTimeRange)
                setStartRangTime(startRangeTime)
                setTimeRange(e.target.value)
                break
            // case "selectedDayMonthId":
            //     setSelectedDayMonthId(e.target.value)
            //     break
            // case "month":
            //     setMonth(e.target.value)
            //     break
            // case "days":
            //     setDays(e.target.value)
            //     break
            // case "comment":
            //     setComment(e.target.value)
            //     break
            // case "captcha":
            //     setCaptcha(e.target.value)
            //     checkValiditon()
            //     break
            // case "AssessmentNoSearch":
            //     setAssessmentNoSearch(e.target.value)
            //     break
            // case "AssessmentNoState":
            //     setAssessmentNoState(e.target.value)
            //     break
            // case "OwnerName":
            //     setOwnerName(e.target.value)
            //     checkValiditon()
            //     break
            // case "Locality":
            //     setLocality(e.target.value)
            //     break
            // case "Pincode":
            //     setPincode(e.target.value)
            //     break
            // case "Usage":
            //     setUsage(e.target.value)
            //     break
            default:
                break
        }
    }

    const hanldeSearchHouseNo = () => {
        axios.get(`auth/propertyTax?ULBName=${UlbName}&HouseNo=${houseNo}`).then((res) => {
            const fetchResponse = res.data.data.propertytax
            if (fetchResponse.length !== 0) {
                setShowHouseNoFields(!ShowHouseNoFields)
                setShowAssesmentFields(false)
                setIsAddPorpertyField(false)
                setAssessmentNoState(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].ASSESSMENT_NO : "")
                setOwnerName(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].OwnerName : "")
                setLocality(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Locality : "")
                setUsage(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Usage === "Residence" ? 4 : res.data.data.propertytax[0].Usage === "Non Residence" ? 5 : 6 : "")
                setOtherComment(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Usage : "")
                console.log(res.data.data.propertytax[0].Lattitude.length)
                if (res.data.data.propertytax.length !== 0 && res.data.data.propertytax[0].Lattitude.length >= 6 && res.data.data.propertytax[0].Longitude.length >= 6) {
                    const center = {
                        lat: parseFloat(evaluateLocation(res.data.data.propertytax[0].Lattitude)),
                        lng: parseFloat(evaluateLocation(res.data.data.propertytax[0].Longitude))
                    }
                    setLatitudeBothShow(parseFloat(evaluateLocation(res.data.data.propertytax[0].Lattitude)))
                    setLongitudeBothShow(parseFloat(evaluateLocation(res.data.data.propertytax[0].Longitude)))
                    setZoom(18)
                    setCenterBothSHow(center)
                } else {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        const center = {
                            lat: parseFloat(evaluateLocation(position.coords.latitude)),
                            lng: parseFloat(evaluateLocation(position.coords.longitude))
                        }
                        setLatitudeBothShow(parseFloat(evaluateLocation(position.coords.latitude)))
                        setLongitudeBothShow(parseFloat(evaluateLocation(position.coords.longitude)))
                        setZoom(18)
                        setCenterBothSHow(center)
                      })
                    }
                axios.get(`ulb/getAllUlb`, config).then((res) => {
                    setUlbOptionList(res.data.data)
                    setULBname(res.data.data[0].Id)
                })
            } else {
                return new Swal({
                    icon: "warning",
                    title: "No Records Found!"
                })
            }
        })
    }

    const hanldeTaxAssessmentNo = () => {
        axios.get(`auth/propertyTax?ULBName=${UlbName}&AssessmentNo=${AssessmentNoSearch}`).then((res) => {
            const fetchResponse = res.data.data.propertytax
            if (fetchResponse.length !== 0) {
                setShowHouseNoFields(false)
                setShowAssesmentFields(true)
                setIsAddPorpertyField(false)
                setHouseNo(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].OWNER_DOORNO : "")
                setOwnerName(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].OwnerName : "")
                setLocality(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Locality : "")
                setUsage(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Usage === "Residence" ? 4 : res.data.data.propertytax[0].Usage === "Non Residence" ? 5 : 6 : "")
                setOtherComment(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Usage : "")
                if (res.data.data.propertytax.length !== 0 && res.data.data.propertytax[0].Lattitude.length >= 6 && res.data.data.propertytax[0].Longitude.length >= 6) {
                    const center = {
                        lat: parseFloat(evaluateLocation(res.data.data.propertytax[0].Lattitude)),
                        lng: parseFloat(evaluateLocation(res.data.data.propertytax[0].Longitude))
                    }
                    setLatitudeBothShow(parseFloat(evaluateLocation(res.data.data.propertytax[0].Lattitude)))
                    setLongitudeBothShow(parseFloat(evaluateLocation(res.data.data.propertytax[0].Longitude)))
                    setZoom(18)
                    setCenterBothSHow(center)
                } else {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        const center = {
                            lat: parseFloat(evaluateLocation(position.coords.latitude)),
                            lng: parseFloat(evaluateLocation(position.coords.longitude))
                        }
                        setLatitudeBothShow(parseFloat(evaluateLocation(position.coords.latitude)))
                        setLongitudeBothShow(parseFloat(evaluateLocation(position.coords.longitude)))
                        setZoom(18)
                        setCenterBothSHow(center)
                      })
                    }
                axios.get(`ulb/getAllUlb`, config).then((res) => {
                    setUlbOptionList(res.data.data)
                    setULBname(res.data.data[0].Id)
                })
            } else {
                return new Swal({
                    icon: "warning",
                    title: "No Records Found!"
                })
            }
        })
    }
    const handleSumbit = () => {
        const payload = {
            Name: LandMark,
            ownerName: OwnerName,
            Zone: zoneName,
            Number: WardNumber,
            PhoneNumber: 91 + phoneNumber,
            ULBId: ULBname === '' ? token.ulbid : ULBname,
            pinCode: "NA",
            UsageId: Usage,
            ASSESSMENT_NO: AssessmentNoSearch !== "" ? AssessmentNoSearch : AssessmentNoState,
            OWNER_DOORNO: houseNo,
            Latitude: latitude,
            Longitude: longitude,
            locality: Locality,
            UpcomingColletionDate: moment(visitDate).format(),
            UpcomingColletionStartTime: startRangeTime,
            UpcomingColletionEndTime: endTimeRange,
            OtherTypeData: OtherComment,
            PropertyTypeId: propertyType,
            ContainmentTypeId: ContainmentType
        } 
        if (OwnerName !== "" && ULBname !== "" && phoneNumber !== null && zoneName !== "") {
            return new Swal({
                title: `${("Are you sure?")}`,
                icon: "warning",
                showDenyButton: true,
                confirmButtonText: 'Yes',
                denyButtonText: `No`,
                customClass: {
                    confirmButton: 'btn btn-primary mx-2',
                    cancelButton: 'btn btn-danger mx-2'
                }
            }).then((willDelete) => {
                if (willDelete.isConfirmed) {
                    dispatch(PropertyAddCitizen(payload))
                }
            })
        } else {
            return new Swal({
                icon: "warning",
                title: "Please fill required fields!"
            })
        }
    }
    const handleChangeULBname = (e) => {
        setULBname(e.target.value)
    }
    return (
        <div className="px-1">
            <Card>
                <div className="misc-inner px-1 px-sm-3 mt-2">
                    <div className="w-100 px-1">
                        <Row className="mb-2 text-center">
                            <Col sm={12}  >
                                <h3>{t('CitizenRequestForm')}</h3></Col>
                        </Row>
                        <Row className="px-1 font-small-2">
                            <Col md={4} sm={4} lg={4}>
                                <Button style={{ fontSize: "12px", width: "100%" }} color="primary" onClick={handleAddProperty}>{t('addProp').toUpperCase()}</Button>
                            </Col>
                            <Col md={4} sm={4} lg={4}>
                                <Button style={{ fontSize: "12px", width: "100%" }} color="primary" onClick={handleSeachByHouseNo}>
                                    {t('SearchbyHouseNo').toUpperCase()}
                                </Button>
                            </Col>
                            <Col md={4} sm={4} lg={4}>
                                <Button style={{ fontSize: "12px", width: '100%' }} color="primary" onClick={handleAssessmentNo}>{t('SearchbyTaxAssessmentNo').toUpperCase()}</Button>
                            </Col>

                        </Row>
                        {isHouseSearchFields && <Row className="px-1">
                            <Col className='mt-2' md='6' sm='12'>
                                <Label className='form-label required' for='houseno' required>
                                    {t('SearchbyHouseNo')}
                                </Label>
                                <InputGroup>
                                    <Input value={houseNo} name="houseNo" placeholder={t('searchHouseno')} required onChange={event => setHouseNo(event.target.value)} />
                                    <Button color='primary' outline onClick={hanldeSearchHouseNo}>
                                        <Search size={12} />
                                    </Button>
                                </InputGroup>
                            </Col></Row>}

                        {ShowHouseNoFields && <Row tag='form' className='gy-1 pt-75 px-1'>
                            <hr color="primary"></hr>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('TaxAssessmentNo')}
                                </Label>
                                <Input
                                    id='AssessmentNo'
                                    placeholder={t('EnterTaxAssessmentNo')}
                                    value={AssessmentNoState}
                                    disabled
                                    name="AssessmentNoState"
                                    onChange={event => setAssessmentNoState(event.target.value)}
                                />
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('ownerName')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input
                                    id='OwnerName'
                                    placeholder={t('phownerName')}
                                    value={OwnerName}

                                    name="OwnerName"
                                    onChange={event => setOwnerName(event.target.value)}
                                />
                                <div style={{ color: "red" }}>{OwnerName === "" ? t('required') : ""}</div>
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('Locality')}
                                </Label>
                                <Input
                                    id='Locality'
                                    placeholder={t('EnterLocality')}
                                    value={Locality}
                                    disabled
                                    name="Locality"
                                    onChange={event => setLocality(event.target.value)}
                                />
                            </Col>
                            {/* <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('pincode')}
                                </Label>
                                <Input
                                    id='Pincode'
                                    placeholder={t('placeholderPincode')}
                                    value={Pincode}
                                    name="Pincode"
                                    disabled
                                    onChange={event => setPincode(event.target.value)}

                                />
                            </Col> */}
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('Usage')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input disabled value={Usage} name="Usage" type="select" onChange={event => setUsage(event.target.value)}>
                                    {UsageOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t("ulb")}
                                </Label>
                                <Input value={ULBname} name="ULBname" type="select" onChange={event => handleChangeULBname(event)}>
                                    {ulbOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                                <div style={{ color: "red" }}>{ULBname === "" ? t("required") : ""}</div>
                            </Col>
                        </Row>
                        }
                        {isAssessmentSearchFields && <Row className="px-1">
                            <Col className='mt-2' md='6' sm='12'>
                                <Label className='form-label required' for='houseno' required>
                                    {t('SearchbyTaxAssessmentNo')}
                                </Label>
                                <InputGroup>
                                    <Input value={AssessmentNoSearch} name="AssessmentNoSearch" placeholder={t('phSearchTax')} required onChange={event => setAssessmentNoSearch(event.target.value)} />
                                    <Button color='primary' outline onClick={hanldeTaxAssessmentNo}>
                                        <Search size={12} />
                                    </Button>
                                </InputGroup>
                            </Col></Row>}

                        {ShowAssesmentFields && <Row tag='form' className='gy-1 pt-75 px-1'>
                            <hr color="primary"></hr>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('HouseNo')}
                                </Label>
                                <Input
                                    id='houseNo'
                                    placeholder={t('Enterhouseno')}
                                    value={houseNo}
                                    disabled
                                    name="houseNo"
                                    onChange={event => setHouseNo(event.target.value)}
                                // 

                                />
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('ownerName')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input
                                    id='OwnerName'
                                    placeholder={t('phownerName')}
                                    value={OwnerName}

                                    name="OwnerName"
                                    onChange={event => setOwnerName(event.target.value)}
                                // 

                                />
                                <div style={{ color: "red" }}>{OwnerName === "" ? t('required') : ""}</div>
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('Locality')}
                                </Label>
                                <Input
                                    id='Locality'
                                    placeholder={t('EnterLocality')}
                                    value={Locality}
                                    disabled
                                    name="Locality"
                                    onChange={event => setLocality(event.target.value)}
                                />
                            </Col>
                            {/* <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('pincode')}
                                </Label>
                                <Input
                                    id='Pincode'
                                    placeholder={t('placeholderPincode')}
                                    value={Pincode}
                                    name="Pincode"
                                    disabled
                                    onChange={event => setPincode(event.target.value)}
                                />
                            </Col> */}
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('Usage')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input disabled value={Usage} name="Usage" type="select" onChange={event => setUsage(event.target.value)}>
                                    {UsageOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='ulbname'>
                                    {t("ulb")} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input value={ULBname} name="ULBname" type="select" onChange={event => handleChangeULBname(event)}>
                                    {ulbOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                                <div style={{ color: "red" }}>{ULBname === "" ? t("required") : ""}</div>
                            </Col>
                        </Row>}
                        {isAddPropertyFields && <Row tag='form' className='gy-1 pt-75 px-1'>
                            <hr color="primary"></hr>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label required' for='houseno' required>
                                    {t('HouseNo')}
                                </Label>
                                <Input value={houseNo} name="houseNo" placeholder={t('Enterhouseno')} required onChange={event => setHouseNo(event.target.value)} />
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('TaxAssessmentNo')}
                                </Label>
                                <Input
                                    id='AssessmentNo'
                                    placeholder={t('EnterTaxAssessmentNo')}
                                    value={AssessmentNoState}
                                    name="AssessmentNoState"
                                    // 
                                    onChange={event => setAssessmentNoState(event.target.value)}
                                />
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('ownerName')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input
                                    id='OwnerName'
                                    placeholder={t('phownerName')}
                                    value={OwnerName}
                                    name="OwnerName"
                                    onChange={event => setOwnerName(event.target.value)}
                                />
                                <div style={{ color: "red" }}>{OwnerName === "" ? t('required') : ""}</div>
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('Locality')}
                                </Label>
                                <Input
                                    id='Locality'
                                    placeholder={t('EnterLocality')}
                                    value={Locality}
                                    onChange={event => setLocality(event.target.value)}
                                    name="Locality"
                                />
                            </Col>
                            {/* <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='pincode'>
                                    {t('pincode')}
                                </Label>
                                <Input
                                    id='Pincode'
                                    placeholder={t('placeholderPincode')}
                                    value={Pincode}
                                    name="Pincode"
                                    onChange={event => setPincode(event.target.value)}
                                />
                            </Col> */}
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='ulb'>
                                    {t("ulb")} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input value={ULBname} name="ULBname" type="select" onChange={event => handleChangeULBname(event)}>
                                    {ulbOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                                <div style={{ color: "red" }}>{ULBname === "" ? t("required") : ""}</div>
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='usgae'>
                                    {t('Usage')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input value={Usage} name="Usage" type="select" onChange={event => setUsage(event.target.value)}>
                                    {UsageOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                            </Col>
                            {Usage === "6" && <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='other'>
                                    {t('Other')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input
                                    id='other'
                                    placeholder={t('enterOtherComment')}
                                    value={OtherComment}
                                    type='textarea'
                                    name="OtherComment"
                                    onChange={event => setOtherComment(event.target.value)}
                                />
                                <div style={{ color: "red" }}>{Usage === "6" && OtherComment === "" ? t("required") : ""}</div>

                            </Col>}

                        </Row>}
                        <Row className="px-1 gy-1 pt-75">
                            <hr></hr>


                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='phoneNumber'>
                                    {t('phoneNumber')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input value={phoneNumber} pattern="[1-9]{1}[0-9]{9}" name="phoneNumber" type="number" onChange={event => setphoneNumber(event.target.value)} />
                                <div style={{ color: "red" }}>{phoneNumber !== null ? phoneNumber.length === 10 ? "" : phoneNumber.length > 10 ? t("phoperContact") : phoneNumber.length === 0 ? t("required") : "" : ""}</div>

                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='LandMark'>
                                    {t('propAddress')}
                                </Label>
                                <Input value={LandMark} name="LandMark" onChange={event => setLandMark(event.target.value)} />
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='zoneName'>
                                    {t('zoneName')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                </Label>
                                <Input value={zoneName} name="zoneName" onChange={event => setZoneName(event.target.value)} />
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='wardNumber'>
                                    {t('wardNo')}
                                </Label>
                                <Input value={WardNumber} name="WardNumber" onChange={event => setWardNumber(event.target.value)} />
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='ContainmentOption'>
                                    {t('containmentType')}
                                </Label>
                                <Input value={ContainmentType} name="ContainmentType" type="select" onChange={event => setContainmentType(event.target.value)}>
                                <option value={""}>{t('select')}</option>
                                    {ContainmentOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                                {/* <div style={{ color: "red" }}>{ContainmentType === "" ? t("required") : ""}</div> */}

                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='PropertyTypeOption'>
                                    {t('propType')}
                                </Label>
                                <Input value={propertyType} name="propertyType" type="select" onChange={event => setPropertyType(event.target.value)}>
                                <option value={""}>{t('select')}</option>
                                    {PropertyTypeOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                                {/* <div style={{ color: "red" }}>{propertyType === "" ? t("required") : ""}</div> */}

                            </Col>
                            {/* <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='Emergency'>
                                    {t('emergency')}
                                </Label>
                                <Input value={Emergency} name="Emergency" type="select" onChange={event => setEmergency(event.target.value)}>

                                    <option value={"No"}>{t('ulbDeleteErr3')}</option>
                                    <option value={"Yes"}>{t('ulbDeleteErr4')}</option>
                                </Input>

                            </Col> */}
                            {/* {ULBname !== "" && <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OperaterName'>
                                    {t('operatorName')}
                                </Label>
                                <Input value={OperaterName} name="OperaterName" type="select" onChange={event => setOperaterName(event.target.value)} >
                                    <option value={""}>{t('select')}</option>
                                    {OperatorOption.map((item, i) => {
                                        return <option key={i} value={item.id}>{item.name}</option>
                                    })}isAddPropertyFields
                                </Input>

                            </Col>} */}
                            {/* {OperaterName !== "" && <> */}
                            <Col md={4} xs={12} lg={4} sm={12}>
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
                            <Col md={4} xs={12} lg={4} sm={12}>
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

                            {/* <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='logo'>{t('photo')} </Label>
                                <div>
                                    {picture === "" ? "" : <span className='d-flex justify-content-end'> <X className='cursor-pointer text-primary' size={15} onClick={handleRemovedImage} /></span>}
                                    <Button color="white" className="border" onClick={handleClick} style={{ width: '100%', backgroundColor: "white", border: "1px solid #7367f0" }}>
                                        {t('uploadPhoto')}
                                    </Button>
                                    <input type="file"
                                        ref={hiddenFileInput}
                                        onChange={handleChangeFile}
                                        style={{ display: 'none' }}
                                        accept="image/png, image/jpeg, image/jpg"
                                    />
                                </div>
                                <div style={{ color: "green" }}>{picture}</div>
                            </Col>
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='selectDayMonth'>
                                    {t('lastEmptied')}
                                </Label>

                                <Input type='select' name='selectedDayMonthId' id='selectedDayMonthId' value={selectedDayMonthId} onChange={event => setSelectedDayMonthId(event.target.value)}>
                                    <option value={""}>{t('select')}</option>
                                    {selectDayMonth.map((item) => {
                                        return <option value={item.value}>{item.label}</option>

                                    })}

                                </Input>
                            </Col>
                            {selectedDayMonthId === "M" ? <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='month'>
                                    {t('months')}
                                </Label>
                                <Input
                                    id='month'
                                    placeholder={t('phMonths')}
                                    value={month}
                                    name="month"
                                    onChange={event => setMonth(event.target.value)}
                                />
                            </Col> : selssectedDayMonthId === "D" ? <Col md={4} xs={12} lg={4} sm={12}>   <Label className='form-label' for='month'>
                                {t('days')}
                            </Label>
                                <Input
                                    id='days'
                                    placeholder={t('phDays')}
                                    value={days}
                                    name="days"
                                    onChange={event => setDays(event.target.value)}

                                /></Col> : ""}

                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='comment'>
                                    {t('comment')}
                                </Label>
                                <Input name="comment" value={comment} id='comment' placeholder={t('phComment')} onChange={event => setComment(event.target.value)} />

                            </Col> */}
                            <Col md={4} xs={12}></Col>
                            {isAddPropertyFields && <>
                                <Col md={12} xs={12} lg={12}>
                                    <div style={{ height: '30vh', width: '100%', top: 0, left: 0, overflow: "visible" }}>
                                        <GoogleMapReact
                                            bootstrapURLKeys={{ key: maps_key }}
                                            center={center}
                                            zoom={zoom}
                                            // onClick={(e) => handleMapClick(e)}
                                            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                                            yesIWantToUseGoogleMapApiInternals
                                            onChange={handleMap}
                                        >
                                            <Marker
                                                lat={parseFloat(latitude)}
                                                lng={parseFloat(longitude)}
                                                name="My Marker"
                                                color="blue" />
                                            <div className={map === true ? "location-icon" : "current-loct"}>
                                                <img style={{ height: '25px', width: "25px" }} src={location} onClick={() => getCurrentLocation()} />
                                            </div>
                                        </GoogleMapReact>
                                    </div>
                                </Col>
                                <Col md={6} xs={12}>
                                    <Label className='form-label' for='latitude'>
                                        {t('latitude')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                    </Label>
                                    <Input disabled required name="latitude" value={evaluateLocation(latitude)} id='latitude' placeholder={t('phlatitude')} onChange={event => setLatitude(event.target.value)} />
                                </Col>
                                <Col md={6} xs={12}>
                                    <Label className='form-label' for='longitude'>
                                        {t('longitude')}  <span style={{ color: "red", fontSize: '15px' }}>*</span></Label>
                                    <Input disabled required name="longitude" value={evaluateLocation(longitude)} id='longitude' placeholder={t('phlongitude')} onChange={event => setLongitude(event.target.value)} />
                                </Col></>}
                            {ShowAssesmentFields === true || ShowHouseNoFields === true ? <>
                                <Col md={12} xs={12} lg={12}>
                                    <div style={{ height: '30vh', width: '100%', top: 0, left: 0, overflow: "visible" }}>
                                        <GoogleMapReact
                                            bootstrapURLKeys={{ key: maps_key }}
                                            center={centerBothShow}
                                            zoom={zoom}
                                            // onClick={handleMapClick}
                                            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                                            yesIWantToUseGoogleMapApiInternals
                                            onChange={handleMap}
                                        >
                                            <Marker
                                                lat={parseFloat(latitudeBothShow)}
                                                lng={parseFloat(longitudeBothShow)}
                                                name="My Marker"
                                                color="blue" />
                                            <div className={map === true ? "location-icon" : "current-loct"} >
                                                <img style={{ height: '25px', width: "25px" }} src={location} onClick={() => getCurrentLocation()} />
                                            </div>
                                        </GoogleMapReact>
                                    </div>
                                </Col>
                                <Col md={6} xs={12}>
                                    <Label className='form-label' for='latitudeBothShow'>
                                        {t('latitude')} <span style={{ color: "red", fontSize: '15px' }}>*</span>
                                    </Label>
                                    <Input disabled required name="latitudeBothShow" value={evaluateLocation(latitudeBothShow)} id='latitude' placeholder={t('phlatitude')} onChange={event => setLatitudeBothShow(event.target.value)} />
                                </Col>
                                <Col md={6} xs={12}>
                                    <Label className='form-label' for='longitudeBothShow'>
                                        {t('longitude')} <span style={{ color: "red", fontSize: '15px' }}>*</span></Label>
                                    <Input disabled required name="longitudeBothShow" value={evaluateLocation(longitudeBothShow)} id='longitude' placeholder={t('phlongitude')} onChange={event => setLongitudeBothShow(event.target.value)} />
                                </Col></> : ""}

                            <Col xs={6} className='text-center mt-2 pt-50 pb-5'>
                                <Link to={"/property-management"}>
                                    <Button type='reset' color='secondary' className=" w-50" outline>
                                        {('Back')}
                                    </Button>
                                </Link>

                            </Col>
                            <Col xs={6} className='text-center mt-2 pt-50 pb-5' >
                                <Button type='submit' className='w-50' color='primary' onClick={handleSumbit}>
                                    {t('save')}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>

        </div>
    )
}
export default (withTranslation()(AddPropertyForm))
