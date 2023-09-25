import {
    Modal, ModalBody, ModalHeader, Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button, Row, Col, Label, Input, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap"
import { getDisposalHeader, getDisposaldata, addtreatment_facility, UpdateTreatment_facility, treatmentFacilityDelete } from '../../redux/DisposalFacilityRedux'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from 'prop-types'
import GoogleMapReact from 'google-map-react'
import Flatpickr from 'react-flatpickr'
import InputPasswordToggle from '@components/input-password-toggle'
// import { Link } from "react-router-dom"
import { MoreVertical, Edit, FileText, Archive, Trash, X, ChevronDown, ChevronUp, Plus } from 'react-feather'
import Breadcrumbs from '@components/breadcrumbs'
import ReactPaginate from 'react-paginate'
import moment from "moment"
import Swal from 'sweetalert2'
import Marker from "../Property-management/marker"
import { withTranslation } from 'react-i18next'
import location from "../../assets/images/current_location/Location.png"


/**
 * Evaluates lat long for 4 digit precision
 * @param {*} loc - Lat Long for evaluation
 */
function evaluateLocation(loc) {
    return loc.toString().length > 0 ? parseFloat(loc).toFixed(4) : ""
}
const DisposalFacility = ({t}) => {
    // ** map key
    const dispatch = useDispatch()
    const maps_key = "AIzaSyBV5XySVlxwJm_lAJ2ZoecKismiBv1ZJAo"
    // ** States
    const [openAddModal, setopenAddModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [parPage, setParPage] = useState(1)
    const [FacilityName, setFacilityName] = useState("")
    const [FacilityType, setFacilityType] = useState(1)
    const [FacilityUserName, setFacilityUserName] = useState("")
    const [Email, setEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [sortName, setSortName] = useState('')
    const [sortValue, setSortValue] = useState('desc')
    const [currentSortId, setCurrentSortId] = useState('')
    const [LocationName, setLocationName] = useState("")
    // const [TippingFee, setTippingFee] = useState(false)
    const [zoom, setZoom] = useState(18)
    const [center, setCenter] = useState({ lat: "", long: "" })
    const [Latitude, setLatitude] = useState(17.8302)
    const [Longitude, setLongitude] = useState(79.2778)
    // const [Ward, setWard] = useState("")
    // const [Zone, setZone] = useState("")
    // const [Amount, setAmount] = useState("")
    const [Capacity, setCapacity] = useState("")
    const [CapacityErr, setCapacityErr] = useState("")
    const [fromTime, setFromTime] = useState("09:00")
    const [toTime, setToTime] = useState("18:00")
    const [FacilityNameErr, setFacilityNameErr] = useState("")
    const [FacilityTypeErr, setFacilityTypeErr] = useState("")
    const [FacilityUserNameErr, setFacilityUserNameErr] = useState("")
    const [EmailErr, setEmailErr] = useState("")
    const [userPasswordErr, setUserPasswordErr] = useState("")
    const [latitudeErr, setLatitudeErr] = useState("")
    const [longitudeErr, setLongitudeErr] = useState("")
    // const [AmountErr, setAmountErr] = useState("")
    const [tfId, setTfId] = useState("")
    const [map, setMap] = useState(false)
    useEffect(() => {
        dispatch(getDisposalHeader())
        const payload = {
            field: "all",
            sortingName: sortName,
            sortingValue: sortValue,
            page: parPage,
            limit: rowsPerPage
        }
        dispatch(getDisposaldata(payload))
      
    }, [])
    const store = useSelector((state) => state)
    const columns = store.DisposalFacilityRedux ? store.DisposalFacilityRedux.disposalHeaderData : []
    const disposalList = store.DisposalFacilityRedux.disposalData ? store.DisposalFacilityRedux.disposalData : []
    const dataLength = store.DisposalFacilityRedux ? store.DisposalFacilityRedux.totalCounts : 0
    const count = Math.ceil(dataLength / rowsPerPage)

    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        // setDisposalValue([])
        const payload = {
            field: "all",
            sortingName: sortName,
            sortingValue: sortValue,
            page: parPage,
            limit: parseInt(e.target.value)

        }
        dispatch(getDisposaldata(payload))
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
        setParPage(page.selected + 1)
        const payload = {
            field: "all",
            sortingName: sortName,
            sortingValue: sortValue,
            page: page.selected + 1,
            limit: rowsPerPage
        }
        dispatch(getDisposaldata(payload))
    }
    const handleSort = (e, sortBy) => {
        let value
        if (sortName === sortBy.accessor) {
            value = (sortValue === 'desc') ? 'asc' : 'desc'
            setSortName(sortBy.accessor)
            setSortValue(value)
        } else {
            setSortName(sortBy.accessor)
            setSortValue('desc')
            value = 'desc'
        }
        setCurrentSortId(sortBy.accessor)
        const payload = {
            field: "sorting",
            sortingName: sortBy.accessor,
            sortingValue: value,
            page: parPage,
            limit: rowsPerPage
        }
        dispatch(getDisposaldata(payload))
    }

    const handleEdit = (data) => {
        setopenAddModal(true)
        setTfId(data.TFId)
        // setAmount(data.Amount)
        // setTippingFee(data.Amount !== null)
        setCapacity(data.Capacity)
        // setZone(data.Zone)
        // setWard(data.Ward)
        setLocationName(data.LocationName)
        setUserPassword("")
        setEmail(data.Email)
        setFacilityUserName(data.UserName)
        setFacilityType(data.TreatmentFacilityTypeId)
        setFacilityName(data.Name)
        setFromTime(data.OperationHoursFrom)
        setToTime(data.OperationHoursTo)
        setLatitude(data.Location["x"])
        setLongitude(data.Location["y"])
        setCenter({ lat: data.Location["x"], lng: data.Location["y"] })
        setZoom(7)
        // setAmountErr("")
        setFacilityNameErr("")
        setFacilityTypeErr("")
        setUserPasswordErr("")
        setFacilityUserNameErr("")
        setEmailErr("")
        setLatitudeErr("")
        setLongitudeErr("")
        setCapacityErr("")
    }
    const handleDelete = (Id) => {
        const payload = { id: Id }
        dispatch(treatmentFacilityDelete(payload))

    }
    const success = position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const center = {
          lat: latitude,
          lng: longitude
        }
        setLatitude(parseFloat(latitude))
        setLongitude(parseFloat(longitude))
        setZoom(18)
        setCenter(center)
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
                setZoom(7)
                setCenter(tsCenter)
            } else if (permission.state === "denied") {
                const tsCenter = {
                    lat: 17.8302,
                    lng: 79.2778
                }
                setLatitude(17.8302)
                setLongitude(79.2778)
                setZoom(7)
                setCenter(tsCenter)
            }
        })
      }
    const handleAddDisposal = () => {
        setopenAddModal(true)
        const tsCenter = {
            lat: 17.8302,
            lng: 79.2778
        }
        setLatitude(17.8302)
        setLongitude(79.2778)
        setZoom(7)
        setCenter(tsCenter)
        navigator.geolocation.getCurrentPosition(success, error)
    }
    const handleAddDisposalClose = () => {
        setopenAddModal(false)
    }
    const handleClose = () => {
        setopenAddModal(false)
        // setAmount("")
        // setTippingFee(false)
        setCapacity("")
        // setZone("")
        // setWard("")
        setLocationName("")
        setUserPassword("")
        setEmail("")
        setFacilityUserName("")
        setFacilityType(1)
        setFacilityName("")
        setFromTime("09:00")
        setToTime("18:00")
        setLatitude(17.8302)
        setLongitude(79.2778)
        setZoom(7)
        // setAmountErr("")
        setFacilityNameErr("")
        setFacilityTypeErr("")
        setUserPasswordErr("")
        setFacilityUserNameErr("")
        setEmailErr("")
        setLatitudeErr("")
        setLongitudeErr("")
        setCapacityErr("")
    }
    const checkValidation = (checkData) => {
        let error = false
        let FacilityNameErr = false
        let FacilityTypeErr = false
        let FacilityUserNameErr = false
        let userPasswordErr = false
        let EmailErr = false
        let LatitudeErr = false
        let LongitudeErr = false
        // let AmountErr = false
        let CapacityErr = false

        if (FacilityName === "" && checkData === "handleSubmit") {
            FacilityNameErr = true
            setFacilityNameErr(`${t('required')}`)
        } else {
            FacilityNameErr = false
            setFacilityNameErr("")
        }
        if (FacilityType === "" && checkData === "handleSubmit") {
            FacilityTypeErr = true
            setFacilityTypeErr(`${t('required')}`)
        } else {
            FacilityTypeErr = false
            setFacilityTypeErr("")
        }
        if (FacilityUserName === "" && checkData === "handleSubmit") {
            FacilityUserNameErr = true
            setFacilityUserNameErr(`${t('required')}`)
        } else if (FacilityUserName !== "" && checkData === "handleSubmit") {
            FacilityUserNameErr = false
            setFacilityUserNameErr("")
            if (userPassword === "" && checkData === "handleSubmit") {
                userPasswordErr = true
                setUserPasswordErr(`${t('required')}`)
            } else {
                userPasswordErr = false
                setUserPasswordErr("")
            }
        } else {
            FacilityUserNameErr = false
            setFacilityUserNameErr("")
        }
        if (Email === "" && checkData === "handleSubmit") {
            EmailErr = true
            setEmailErr(`${t('required')}`)
        } else {
            EmailErr = false
            setEmailErr("")
        }
        if (Latitude === "" && checkData === "handleSubmit") {
            LatitudeErr = true
            setLatitudeErr(`${t('required')}`)
        } else {
            LatitudeErr = false
            setLatitudeErr("")
        }
        if (Longitude === "" && checkData === "handleSubmit") {
            LongitudeErr = true
            setLongitudeErr(`${t('required')}`)
        } else {
            LongitudeErr = false
            setLongitudeErr("")
        }
        // if (Amount !== "" && checkData === "handleSubmit") {
        //     if (!String(Amount).match(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/)) {
        //         AmountErr = true
        //         setAmountErr(`${t('disposalAmountErr2')}`)
        //     } else {
        //         AmountErr = false
        //         setAmountErr("")
        //     }
        // } else {
        //     AmountErr = false
        //     setAmountErr("")
        // }
        if (Capacity === "" && checkData === "handleSubmit") {
            CapacityErr = true
            setCapacityErr(`${t('required')}`)
        } else if (Capacity !== "") {
            if (!String(Capacity).match(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/)) {
                CapacityErr = true
                setCapacityErr(`${t('disposalCapacityErr2')}`)
            } else {
                CapacityErr = false
                setCapacityErr("")
            }
        } else {
            CapacityErr = false
            setCapacityErr("")
        }
        if (userPassword === "" && checkData === "handleSubmit") {
            userPasswordErr = true
            setUserPasswordErr(`${t('required')}`)
        } else {
            userPasswordErr = false
            setUserPasswordErr("")
        }
        if (!FacilityNameErr && !FacilityTypeErr && !FacilityUserNameErr && !userPasswordErr && !EmailErr && !LatitudeErr && !LongitudeErr && !CapacityErr) {
            error = false
          } else {
            error = true
          }
        return error
    }
    // const handleMapClick = (x) => {
    //     setLatitude(x.lat)
    //     setLongitude(x.lng)
    //     checkValidation()
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
        //   const screenClass = document.getElementsByClassName("current-loct-pro")
        //   for (let index = 0; index < screenClass.length; index++) {
        //     const element = screenClass[index]
        //     element.style["left"] = "670px"
        //     element.style.top = "230px"
        //     element.style.position = 'fixed'
        //   }
        setMap(true)
            document.className = 'location-icon'
        } else {
          // this.setState({ position: 'inherit', top: '50%', left: '50%' })
          setMap(false)
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
    const handleChange = (e) => {
        switch (e.target.name) {
            case "FacilityName":
                setFacilityName(e.target.value)
                checkValidation()
                break
            case "FacilityType":
                setFacilityType(e.target.value)
                checkValidation()
                break
            case "FacilityUserName":
                checkValidation()
                setFacilityUserName(e.target.value)

                break
            case "Email":
                setEmail(e.target.value)
                checkValidation()
                break
            case "userPassword":
                setUserPassword(e.target.value)
                checkValidation()
                break
            case "LocationName":
                setLocationName(e.target.value)
                break
            // case "Ward":
            //     setWard(e.target.value)
            //     break
            // case "Zone":
            //     setZone(e.target.value)
            //     break
            case "Capacity":
                setCapacity(e.target.value)
                checkValidation()
                break
            // case "TippingFee":
            //     setTippingFee(e.target.checked)
            //     break
            // case "Amount":
            //     setAmount(e.target.value)
            //     checkValidation()
            //     break
            default:
                break
        }
        checkValidation("handleChange")
    }
    const handleChangeDate = (date) => {
        const d = new Date(date)
        const changeFormat = moment(d).format('HH:mm')
        setToTime(changeFormat)
    }
    const handleChangeFromDate = (date) => {
        const d = new Date(date)
        const changeFormat = moment(d).format('HH:mm')
        setFromTime(changeFormat)
    }
    const handleSumbit = () => {
        const err = checkValidation("handleSubmit")
        if (!err) {
            if (tfId !== "") {
                const payload = {
                    id: tfId,
                    receiptNumberPrefix: null,
                    tfName: FacilityName,
                    capacity: Capacity,
                    operationalHoursFrom: fromTime,
                    operationalHoursTo: toTime,
                    username: FacilityUserName,
                    email: Email,
                    location: { latitude: Latitude, longitude: Longitude },
                    type: FacilityType,
                    locationName: LocationName,
                    password: userPassword
                }
                dispatch(UpdateTreatment_facility(payload))
                handleClose()
            } else {
                const payload = {
                    tfName: FacilityName,
                    capacity: Capacity,
                    operationalHoursFrom: fromTime,
                    operationalHoursTo: toTime,
                    username: FacilityUserName,
                    email: Email,
                    location: { latitude: Latitude, longitude: Longitude },
                    type: FacilityType,
                    locationName: LocationName,
                    password: userPassword
                }
                dispatch(addtreatment_facility(payload))
                handleClose()
            }
        }
    }
    return (
        <div>
            <Fragment>
                <Breadcrumbs title={t('disposalFac')} data={[{ title: 'DisposalFacility' }, { title: t('disposalFac') }]} />
            </Fragment>

            <Card>
                <CardHeader className='flex flex-column align-items-end border-bottom'>
                    <Button className='ms-2' color='primary' onClick={() => handleAddDisposal()}>
                        {/* <Plus size={15} /> */}
                        <span className='align-middle' >{t('addNewDisposal')}</span>
                    </Button>
                </CardHeader>

                <div className='react-dataTable'>
                    <Table responsive>
                        <thead>
                            <tr>
                                {columns.length !== 0 ? columns.map((item, index) => {
                                    return <th key={index} scope='col' className='text-nowrap'
                                    >
                                        {item.header}
                                        {item.header === "Action Button" ? "" : <> {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}


                                    </th>
                                }) : []}
                            </tr>

                        </thead>
                        <tbody>

                            {disposalList.map((val, i) => {
                                return <tr key={i}>{columns.map((accesser, h) => {
                                    switch (accesser.accessor) {
                                        case "UpdatedAt":
                                            return val["UpdatedAt"] === null ? "_" : <td key={h}>{`${moment(val["UpdatedAt"]).format("lll")}`}</td>
                                        case "Location":
                                            return <td key={i}>{`${val[accesser.accessor]["x"].toString().slice(0, 8)}, ${val[accesser.accessor]["y"].toString().slice(0, 8)}`}</td>
                                        case "actionButton":
                                            return <div className='d-flex align-items-center justify-content-center'>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle className='pe-1' tag='span'>
                                                        <MoreVertical size={15} style={{ cursor: "pointer" }} />
                                                    </DropdownToggle>
                                                    <DropdownMenu end>
                                                        <DropdownItem onClick={() => handleEdit(val)}>
                                                            <FileText size={15} />
                                                            <span className='align-middle ms-50'>{t('edit')}</span>
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
                                                                    handleDelete(val.TFId)
                                                                }

                                                            }
                                                            )
                                                        }}>
                                                            <Trash size={15} />
                                                            <span className='align-middle ms-50' >{t('delete')}</span>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        default:
                                            return <td key={i}>{val[accesser.accessor] === null || val[accesser.accessor] === "null" ? "-" : `${val[accesser.accessor]}`}</td>

                                    }
                                })
                                }
                                </tr>
                            })}
                        </tbody>
                    </Table>
                    <div className="d-flex float-end">
                            <div className='d-flex align-items-center'>
                                <Label for='sort-select'>{t('Page')}</Label>
                                <Input
                                    className='dataTable-select'
                                    type='select'
                                    style={{width:"90px"}}
                                    id='sort-select'
                                    value={rowsPerPage}
                                    onChange={e => handlePerPage(e)}
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
                                    }/>
                                </div>
                            </div>
                        </Card>

            <Modal isOpen={openAddModal} toggle={handleAddDisposalClose} className='modal-dialog-centered modal-lg' backdrop="static">
                <ModalHeader className='bg-transparent' toggle={handleAddDisposalClose}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h3 className='mb-1'>{tfId !== "" ? `${t("editDisposalFac")}` : `${t("addDisposalFac")}`}</h3>
                    </div>
                    <Row className='gy-1 pt-75'>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='FacilityName'>
                                {t('facilityName')} <span style={{ color: "red", fontSize:'15px' }}>*</span>
                            </Label>
                            <Input onChange={handleChange} name="FacilityName" value={FacilityName} id='FacilityName' placeholder={t('phfacilityName')} />
                            <div style={{ color: "red" }}>{FacilityNameErr}</div>
                        </Col>

                        <Col md={6} xs={12}>
                            <Label className='form-label' for='FacilityType'>

                               {t('faclityType')}
                            </Label>
                            <Input type='select' name='FacilityType' id='FacilityType' value={FacilityType} onChange={handleChange}>
                                <option value={1}>{"FSTP"}</option>
                                {/* <option value={2}>STP</option> */}
                                {/* <option value={3}>Pumping/Decanting station</option> */}
                                
                            </Input>
                            <div style={{ color: "red" }}>{FacilityTypeErr}</div>

                        </Col>

                        <Col md={6} xs={12}>
                            <Label className='form-label' for='FacilityUserName'>
                                {t('facilityUser')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
                            </Label>
                            <Input onChange={handleChange} name="FacilityUserName" value={FacilityUserName} id='FacilityUserName' placeholder={t('phfacilityUser')} />
                            <div style={{ color: "red" }}>{FacilityUserNameErr}</div>

                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Email'>{t('facilityEmail')}</Label>
                            <Input
                                id='Email'
                                placeholder={t('phfacilityEmail')}
                                value={Email}
                                name="Email"
                                type="email"
                                onChange={handleChange}
                            />
                            <div style={{ color: "red" }}>{EmailErr}</div>
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label required' for='UserPassword'>
                                {t('facilityPass')}
                            </Label>
                            <InputPasswordToggle
                                className='input-group-merge'
                                name="userPassword"
                                value={userPassword}
                                placeholder={t('phfacilityPass')}
                                onChange={handleChange}
                                required
                            />
                            <div style={{ color: "red" }}>{userPasswordErr}</div>

                        </Col>
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
                                        lat={parseFloat(Latitude)}
                                        lng={parseFloat(Longitude)}
                                        name="My Marker"
                                        color="blue" />
                                         <div className={map === true ? "location-icon" : "current-loct-pro"}  >
                                            <img style={{height:'25px', width:"25px"}} src={location} onClick={() => getCurrentLocation()} />
                                        </div>
                                </GoogleMapReact>
                            </div>

                        </Col>


                        <Col md={6} xs={12}>
                            <Label className='form-label' for='latitude'>
                                {t('latitude')}
                            </Label>
                            <Input disabled required onChange={handleChange} name="Latitude" value={evaluateLocation(Latitude)} id='Latitude' placeholder={t('EnterLatitude')} />
                            <div style={{ color: "red" }}>{latitudeErr}</div>

                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='longitude'>
                                {t('longitude')} </Label>
                            <Input disabled required onChange={handleChange} name="Longitude" value={evaluateLocation(Longitude)} id='Longitude' placeholder={t('EnterLongitude')} />
                            <div style={{ color: "red" }}>{longitudeErr}</div>

                        </Col>


                        <Col md={6} xs={12}>
                            <Label className='form-label' for='LocationName'>
                                {t('location')} </Label>
                            <Input required onChange={handleChange} name="LocationName" value={LocationName} id='LocationName' placeholder={t('phlocation')} />
                        </Col>

                        {/* <Col md={6} xs={12}>
                            <Label className='form-label' for='Ward'>
                                {t('ward')}</Label>
                            <Input onChange={handleChange} name="Ward" value={Ward} id='Ward' placeholder={t('phWard')} />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Zone'>
                                {t('zone')}</Label>
                            <Input onChange={handleChange} name="Zone" value={Zone} id='Zone' placeholder={t('phZone')} />
                        </Col> */}
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Capacity'>
                               {t('capacity')} <span style={{ color: "red", fontSize:'15px'}}>*</span></Label>
                            <Input onChange={handleChange} name="Capacity" value={Capacity} id='Capacity' type="number" min="0" onWheel={ event => event.currentTarget.blur() } placeholder={t('phoperCapacity')} />
                            <div style={{ color: "red" }}>{CapacityErr}</div>
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Capacity'>
                                {t('operationalHoursFrom')}</Label>
                            <Flatpickr
                                className='form-control'
                                value={fromTime}
                                id='timepicker'
                                options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: 'H:i',
                                    time_24hr: true,
                                    autoFillDefaultTime: [new Date(), "09:00"]
                                }}
                                onChange={date => handleChangeFromDate(date)}
                            />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='toTime'>
                                {t('operationalHoursTO')}</Label>
                            <Flatpickr
                                className='form-control'
                                value={toTime}
                                id='timepicker'
                                options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: 'H:i',
                                    time_24hr: true,
                                    autoFillDefaultTime: [new Date(), "18:00"]
                                }}
                                onChange={date => handleChangeDate(date)}
                            />
                        </Col>

                        {/* <Col md={6} xs={12}>

                            <Label className='form-label' for='TippingFee'>
                                {t('tippingFee')}</Label>

                            <Input type='checkbox' id='primary-checkbox' name="TippingFee" checked={TippingFee} onChange={handleChange} />
                        </Col>
                        {TippingFee && <Col md={6} xs={12}>
                            <Label className='form-label' for='Amount'>
                                {t('amount')}  </Label>
                            <Input onChange={handleChange} type="number" name="Amount" value={Amount} id='Amount' min="0" placeholder={t('phamount')} />
                            <div style={{ color: "red" }}>{AmountErr}</div>
                        </Col>} */}


                        <Col xs={12} className='text-center mt-2 pt-50'>
                            <Button type='reset' className='me-1' color='secondary' outline onClick={handleClose}>
                                {t('cancel')}
                            </Button>
                            <Button type='submit' color='primary' onClick={handleSumbit}>
                                {tfId !== "" ? `${t('saveChange')}` : `${t('save')}`}
                            </Button>

                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default (withTranslation()(DisposalFacility))
