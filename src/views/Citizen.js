// ** Reactstrap Imports
import { Button, Row, Col, Label, Input, Card, InputGroup, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap"
import { Search, Users, X } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import axios from '../lib/ApiCall'
import Marker from "./Property-management/marker"
import GoogleMapReact from 'google-map-react'
import { AddCitizen } from "../redux/auth"
// ** Styles
import "@styles/base/pages/page-misc.scss"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import Swal from 'sweetalert2'
import moment from "moment"
import { withTranslation } from "react-i18next"
import location from "../assets/images/current_location/Location.png"
import './login.css'
/**
 * Evaluates lat long for 4 digit precision
 * @param {*} loc - Lat Long for evaluation
 */
function evaluateLocation(loc) {
    return loc.toString().length > 0 ? parseFloat(loc).toFixed(4) : ""
}

const Citizen = ({ t }) => {
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
    const [Locality, setLocality] = useState("")
    const [ULBname, setULBname] = useState("")
    const [Usage, setUsage] = useState(4)
    const [houseNo, setHouseNo] = useState("")
    const [ulbOption, setUlbOptionList] = useState([])
    const [phoneNumber, setphoneNumber] = useState(localStorage.getItem('PhoneNumber').slice(2))
    const [LandMark, setLandMark] = useState("")
    const [OperatorOption, setOperatorOption] = useState([])
    const [visitDate, setVisitDate] = useState(new Date())
    const [TimeRange, setTimeRange] = useState("08:00 AM - 10:00 AM")
    const [zoom, setZoom] = useState(18)
    const [center, setCenter] = useState({ lat: "", long: "" })
    const [centerBothShow, setCenterBothSHow] = useState({ lat: "", long: "" })
    const [latitude, setLatitude] = useState(17.8302)
    const [longitude, setLongitude] = useState(79.2778)
    const [latitudeBothShow, setLatitudeBothShow] = useState(17.8302)
    const [longitudeBothShow, setLongitudeBothShow] = useState(79.2778)
    const [AssessmentNoSearch, setAssessmentNoSearch] = useState("")
    const [endTimeRange, setEndTimeRange] = useState("10:00 AM")
    const [startRangeTime, setStartRangTime] = useState("08:00 AM")
    const [UsageOption, setUsageOption] = useState([])
    const [OtherComment, setOtherComment] = useState("")
    const [map, setMap] = useState(false)
    const [openULBOption, setOpenULBOption] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        // auth/getAllUlb
        axios.get(`auth/getAllUlb`).then((res) => {
            setUlbOptionList(res.data.data)
        })
        // /auth/usageType
        axios.get(`auth/usageType`).then((res) => {
            setUsageOption(res.data.data.usageType)
        })
        setOpenULBOption(localStorage.getItem('UlbOption') === 'true')
    }, [])

    const ULB_Name = localStorage.getItem('ULBname')
    const ULB_Id = localStorage.getItem('UlbId')
    const getCurrentLocation = () => {
        const success = position => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const centerUPdate = {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
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
        setULBname(ULB_Name)
        setUsage("")
        setHouseNo('')
        setphoneNumber(localStorage.getItem('PhoneNumber').slice(2))
        setLandMark("")
        setVisitDate(new Date())
        setTimeRange("08:00 AM - 10:00 AM")
        setZoom(18)
        setCenter({ lat: "", long: "" })
        setCenterBothSHow({ lat: "", long: "" })
        setLongitude(79.2778)
        setLatitude(17.8302)
        setLatitudeBothShow(17.8302)
        setLongitudeBothShow(79.2778)
        setAssessmentNoSearch("")
        setEndTimeRange("10:00 AM")
        setStartRangTime("08:00 AM")
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
        setULBname(ULB_Name)
        setUsage("")
        setHouseNo('')
        setphoneNumber(localStorage.getItem('PhoneNumber').slice(2))
        setLandMark("")
        setVisitDate(new Date())
        setTimeRange("08:00 AM - 10:00 AM")
        setZoom(18)
        setCenter({ lat: "", long: "" })
        setCenterBothSHow({ lat: "", long: "" })
        setLongitude(79.2778)
        setLatitude(17.8302)
        setLatitudeBothShow(17.8302)
        setLongitudeBothShow(79.2778)
        setAssessmentNoSearch("")
        setEndTimeRange("10:00 AM")
        setStartRangTime("08:00 AM")
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
        setULBname(ULB_Name)
        setUsage(4)
        setHouseNo('')
        setphoneNumber(localStorage.getItem('PhoneNumber').slice(2))
        setLandMark("")
        setVisitDate(new Date())
        setTimeRange("08:00 AM - 10:00 AM")
        setZoom(18)
        setCenter({ lat: "", long: "" })
        setCenterBothSHow({ lat: "", long: "" })
        setLatitudeBothShow(17.8302)
        setLongitudeBothShow(79.2778)
        setAssessmentNoSearch("")
        setEndTimeRange("10:00 AM")
        setStartRangTime("08:00 AM")
        // location
        navigator.geolocation.getCurrentPosition(success, error)
    }
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
            setMap(true)
            document.className = 'location-icon'
        } else {
            setMap(false)
            const screenDeClass = document.getElementsByClassName("current-loct")
            for (let index = 0; index < screenDeClass.length; index++) {
                const elementOff = screenDeClass[index]
                elementOff.style["left"] = ""
                elementOff.style.top = "unset"

            }
        }
    }
    const handleChange = (e) => {
        switch (e.target.name) {
            case "TimeRange":
                const splitTime = e.target.value.split(" - ") //['08:10 AM', '10:00 AM']
                const startRangeTime = splitTime[0] // 08:00 AM
                const endTimeRange = splitTime[1]
                setEndTimeRange(endTimeRange)
                setStartRangTime(startRangeTime)
                setTimeRange(e.target.value)
                break
            default:
                break
        }
    }

    const hanldeSearchHouseNo = () => {
        axios.get(`auth/propertyTax?ULBName=${ULB_Name}&HouseNo=${houseNo}`).then((res) => {
            console.log(res)
            if (res.data.data.propertytax.length !== 0) {
                axios.get(`auth/dropDown?ULBId=${ULB_Id}`).then((res) => {
                    setOperatorOption(res.data.data.operators)
                })
            } else {
                setOperatorOption([])
                return new Swal({
                    icon: "warning",
                    title: "No Records Found!"
                })
            }
            setShowHouseNoFields(!ShowHouseNoFields)
            setShowAssesmentFields(false)
            setIsAddPorpertyField(false)
            setAssessmentNoState(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].ASSESSMENT_NO : "")
            setOwnerName(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].OwnerName : "")
            setLocality(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Locality : "")
            setUsage(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Usage === "Residence" ? 4 : res.data.data.propertytax[0].Usage === "Non Residence" ? 5 : 6 : "")
            setOtherComment(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Usage : "")
            if (res.data.data.propertytax.length !== 0 && res.data.data.propertytax[0].Lattitude.length >= 6 && res.data.data.propertytax[0].Longitude.length >= 6) {
            // if ((res.data.data.propertytax.length !== 0 && res.data.data.propertytax[0].Lattitude !== " NA") || (res.data.data.propertytax.length !== 0 && res.data.data.propertytax[0].Lattitude !== "N/A") || (res.data.data.propertytax.length !== 0 && res.data.data.propertytax[0].Lattitude !== "null") || (res.data.data.propertytax.length !== 0 && res.data.data.propertytax[0].Lattitude !== null)) {
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
        })
    }

    const hanldeTaxAssessmentNo = () => {
        axios.get(`auth/propertyTax?ULBName=${ULB_Name}&AssessmentNo=${AssessmentNoSearch}`).then((res) => {
            if (res.data.data.propertytax.length !== 0) {
                axios.get(`auth/dropDown?ULBId=${ULB_Id}`).then((res) => {
                    setOperatorOption(res.data.data.operators)
                })
            } else {
                setOperatorOption([])
                return new Swal({
                    icon: "warning",
                    title: "No Records Found!"
                })
            }
            setShowHouseNoFields(false)
            setShowAssesmentFields(true)
            setIsAddPorpertyField(false)
            setHouseNo(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].OWNER_DOORNO : "")
            setOwnerName(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].OwnerName : "")
            setLocality(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].Locality : "")
            setULBname(res.data.data.propertytax.length !== 0 ? res.data.data.propertytax[0].ULBName : "")
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
                navigator.geolocation.getCurrentPosition(function (position) {
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
        })
    }
    const handleSumbit = () => {
        const payload = {
            Name: LandMark,
            ownerName: OwnerName,
            Zone: 'NA',
            Number: 'NA',
            PhoneNumber: 91 + phoneNumber,
            ULBId: ULB_Id,
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
            OtherTypeData: OtherComment
        }
        if (OwnerName !== "" && phoneNumber !== null) {
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
                    dispatch(AddCitizen(payload))
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
        localStorage.setItem('ULBname', e.target.value)
        const handleulb = (val) => {
        const ulbId =  ulbOption.filter((ele) => ele.Name === val)
        localStorage.setItem('UlbId', ulbId[0].Id)
        return ulbId[0].Name
        }
        localStorage.setItem('UlbOption', false)
        setOpenULBOption(!openULBOption)
          return new Swal({
                icon: 'success',
                title: "ULB Selected",
               text: `Your Selected ULB is ${handleulb(e.target.value)}`
        })
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
                                    {t('ownerName')} <span style={{ color: "red" }}>*</span>
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
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('Usage')} <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input value={Usage} name="Usage" type="select" onChange={event => setUsage(event.target.value)}>
                                    {UsageOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
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
                                    {t('ownerName')} <span style={{ color: "red" }}>*</span>
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
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='OwnerName'>
                                    {t('Usage')} <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input value={Usage} name="Usage" type="select" onChange={event => setUsage(event.target.value)}>
                                    {UsageOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
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
                                    {t('ownerName')} <span style={{ color: "red" }}>*</span>
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
                            <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='usgae'>
                                    {t('Usage')} <span style={{ color: "red" }}>*</span>
                                </Label>
                                <Input value={Usage} name="Usage" type="select" onChange={event => setUsage(event.target.value)}>
                                    {UsageOption.map((item, i) => {
                                        return <option key={i} value={item.Id}>{item.Name}</option>
                                    })}
                                </Input>
                            </Col>
                            {Usage === "6" && <Col md={4} xs={12} lg={4} sm={12}>
                                <Label className='form-label' for='other'>
                                    {t('Other')} <span style={{ color: "red" }}>*</span>
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
                                    {t('phoneNumber')} <span style={{ color: "red" }}>*</span>
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
                                            <div className={map === true ? "location-icon" : "current-loct"} >
                                                <img style={{ height: '25px', width: "25px" }} src={location} onClick={() => getCurrentLocation()} />
                                            </div>
                                        </GoogleMapReact>
                                    </div>
                                </Col>
                                <Col md={6} xs={12}>
                                    <Label className='form-label' for='latitude'>
                                        {t('latitude')} <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Input disabled required name="latitude" value={evaluateLocation(latitude)} id='latitude' placeholder={t('phlatitude')} onChange={event => setLatitude(event.target.value)} />
                                </Col>
                                <Col md={6} xs={12}>
                                    <Label className='form-label' for='longitude'>
                                        {t('longitude')}  <span style={{ color: "red" }}>*</span></Label>
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
                                        {t('latitude')} <span style={{ color: "red" }}>*</span>
                                    </Label>
                                    <Input disabled required name="latitudeBothShow" value={evaluateLocation(latitudeBothShow)} id='latitude' placeholder={t('phlatitude')} onChange={event => setLatitudeBothShow(event.target.value)} />
                                </Col>
                                <Col md={6} xs={12}>
                                    <Label className='form-label' for='longitudeBothShow'>
                                        {t('longitude')} <span style={{ color: "red" }}>*</span></Label>
                                    <Input disabled required name="longitudeBothShow" value={evaluateLocation(longitudeBothShow)} id='longitude' placeholder={t('phlongitude')} onChange={event => setLongitudeBothShow(event.target.value)} />
                                </Col></> : ""}
                            <Col xs={6} className='text-center mt-2 pt-50 pb-5'>
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

            <Modal isOpen={openULBOption} className='modal-dialog-centered modal-sm' backdrop="static">
                <ModalHeader className='bg-transparent'></ModalHeader>
                <div className='text-center' style={{ margin: "-25px" }}>
                    <h3 className='mt-2'>Please Select the Required ULB</h3>
                </div>
                <ModalBody className=''>
                    <div className="mt-2 mb-1">
                        <Label className='form-label' for='ulb'>
                            {t("ulb")} <span style={{ color: "red" }}>*</span>
                        </Label>
                        <Input value={ULBname} name="ULBname" type="select" onChange={event => handleChangeULBname(event)}>
                            <option value={""}>{t('select')}</option>
                            {ulbOption.map((item, i) => {
                                return <option key={i} value={item.Name}>{item.Name}</option>
                            })}
                        </Input>
                        <div style={{ color: "red" }}>{ULBname === "" ? t("required") : ""}</div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}
export default (withTranslation()(Citizen))