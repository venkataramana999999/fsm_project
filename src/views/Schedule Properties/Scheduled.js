import {
    Modal, ModalBody, ModalHeader, Card, CardHeader, CardBody, CardTitle, CardText, CardLink, InputGroup, InputGroupText, Button, Row, Col, Label, Input, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, ModalFooter
} from "reactstrap"
import { getSchedulerPropeties, UpdateScheduleDetail, AddScheduleDetail, addFreqSchedule, getScheduleHistory, AddBulkScheduleDetail, getunhandledPropeties } from "../../redux/SchedulerRedux"
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Flatpickr from 'react-flatpickr'
import Breadcrumbs from '@components/breadcrumbs'
// import AddUlb from './AddULB'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, ChevronUp, Plus, MoreVertical, FileText, Trash, Search, ChevronLeft } from 'react-feather'
import moment from "moment"
import { withTranslation } from 'react-i18next'

const Scheduled = ({t}) => {
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [parPage, setParPage] = useState(1)
    const [searchSelect, setSearchSelect] = useState("selected")
    const [searchValue, setSearchValue] = useState('')
    const [sortName, setSortName] = useState('')
    const [sortValue, setSortValue] = useState('desc')
    const [currentSortId, setCurrentSortId] = useState('')
    const [ScheduleId, setScheduleId] = useState('')
    const [openSchedulePopup, setOpenSchedulePopup] = useState(false)
    const [openSetFrequencyPopup, setOpenSetFrequencyPopup] = useState(false)
    const [selecteDate, setSelectDate] = useState(new Date())
    const [Emergency, setEmergency] = useState(false)
    const [PropertyId, setPropertyId] = useState(false)
    const [Days, setDays] = useState("")
    const [disabledValue, setDisabledValue] = useState(true)
    const [SelectedFreq, setSelectedFreq] = useState("")
    const [daily, setDaily] = useState(false)
    const [custom, setCustom] = useState(true)
    const [alternate, setAlternate] = useState(false)
    const [ViewHistoryOpen, setViewHistoryOpen] = useState(false)
    const [currentPageViewHistory, setCurrentPageViewHistory] = useState(0)
    const [rowsPerPageViewHistory, setRowsPerPageViewHistory] = useState(10)
    const [parPageViewHistory, setParPageViewHistory] = useState(1)
    const [historyPropertyId, setHistoryPropertyId] = useState("")
    const [selectedRows, setSelectedRows] = useState([])
    const [openbulkSchedule, setOpenBulkSchedule] = useState(false)
    const [unhandledOption, setUnhandledOption] = useState(false)

    const dispatch = useDispatch()

    const historyHeaders = [
        {
            accessor: "operatorName",
            filter: "false",
            header: "Operator Name",
            sortable: "false"
        },
        {
            accessor: "truckNo",
            filter: "false",
            header: "Truck No",
            sortable: "false"
        },
        // {
        //     accessor: "tfName",
        //     filter: "false",
        //     header: "TF No",
        //     sortable: "false"
        // },
        // {
        //     accessor: "GPSLocation",
        //     filter: "false",
        //     header: "GPS Location",
        //     sortable: "false"
        // },
        {
            accessor: "scheduledDate",
            filter: "false",
            header: "Scheduled Date",
            sortable: "false"
        },
        {
            accessor: "collectionDate",
            filter: "false",
            header: "Collected Date",
            sortable: "false"
        },
        {
            accessor: "disposedDate",
            filter: "false",
            header: "Disposed Date",
            sortable: "false"
        },
        {
            header: "Rejected Date",
            accessor: "refusedDate",
            filter: "false",
            sortable: "false"
        },
        {
            header: "Cancelled Date",
            accessor: "cancelledDate",
            filter: "false",
            sortable: "false"
        },
        {
            header: "Expired Date",
            accessor: "expiredDate",
            filter: "false",
            sortable: "false"
        }
    ]
    const updatedHeaders = [
        {
            accessor: "checkbox",
            filter: "false",
            header: "",
            sortable: "false"
        },
        {
            header: "Sr No.",
            accessor: "id",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Request Id",
            accessor: "ReqId",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Tax Assessment No.",
            accessor: "assessment_no",
            sortable: "false",
            filter: "false"
        },
        {
            header: "House No.",
            accessor: "ownerDoorNo",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Owner Name",
            accessor: "ownerName",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Phone Number",
            accessor: "phoneNumber",
            sortable: "false",
            filter: "false"
        },
        {
            accessor: "name",
            filter: "false",
            header: "LandMark",
            sortable: "true"
        },
        {
            accessor: "locality",
            filter: "false",
            header: "Locality",
            sortable: "false"
        },
        // {
        //     header: "Pincode",
        //     accessor: "pinCode",
        //     sortable: "false",
        //     filter: "false"
        // },
        {
            header: "Zone Name",
            accessor: "zone",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Ward Number",
            accessor: "ward",
            sortable: "false",
            filter: "false"
        },
        {
            header: "ULB Name",
            accessor: "ulb",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Date to Visit",
            accessor: "upcomingColletionDate",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Time Range",
            accessor: "visitTime",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Scheduled Date / Time",
            accessor: "dateTime",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Service Status",
            accessor: "status",
            sortable: "false",
            filter: "true"
        },
        {
            header: "Property Type",
            accessor: "propertyType",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Containment type",
            accessor: "containmentType",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Usage",
            accessor: "usagesType",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Created By",
            accessor: "createdBby",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Created Date/Time",
            accessor: "createdAt",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Updated Date/Time",
            accessor: "updatedAt",
            sortable: "true",
            filter: "true"
        },
        {
            header: "Latitude",
            accessor: "latitude",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Longitude",
            accessor: "longitude",
            sortable: "false",
            filter: "false"
        },
        {
            header: "Schedule Frequency in days",
            accessor: "propUpdateFreqdays",
            sortable: "false",
            filter: "true"
        },
        {
            header: "Action",
            accessor: "actionButton",
            sortable: "false",
            filter: "true"
        }
        // {
        //     accessor: "upcomingColletionDate",
        //     filter: "false",
        //     header: "Visit Date",
        //     sortable: "false"
        // },
        // {
        //     accessor: "visitTime",
        //     filter: "false",
        //     header: "Visit Time",
        //     sortable: "false"
        // },
       
    ]
    const handleFilter = e => {
        const value = e.target.value
        setSearchValue(value)
        const payload = {
            field: "search",
            query: value,
            sortingName: sortName,
            sortingValue: sortValue,
            limit: rowsPerPage,
            page: parPage,
            selectedField: searchSelect
        }
        dispatch(getSchedulerPropeties(payload))
    }
    // ** Function to handle per page
    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        const payload = {
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            page: parPage,
            limit: parseInt(e.target.value),
            selectedField: searchSelect

        }
        dispatch(getSchedulerPropeties(payload))
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
        setParPage(page.selected + 1)
        const payload = {
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            page: page.selected + 1,
            limit: rowsPerPage,
            selectedField: searchSelect
        }
        dispatch(getSchedulerPropeties(payload))
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
            query: searchValue,
            sortingName: sortBy.accessor,
            sortingValue: value,
            limit: rowsPerPage,
            page: parPage,
            selectedField: searchSelect

        }
        dispatch(getSchedulerPropeties(payload))
    }
    const handleSearchSelect = (e) => {
        setSearchSelect(e.target.value)

    }
    const handleSchedule = (scheduleData) => {
        console.log(scheduleData, "scheduleData")
        if ((scheduleData.scheduleId !== "" || scheduleData.scheduleId !== null) && (scheduleData.dateTime !== null) && (scheduleData.emergency !== null)) {
            setOpenSchedulePopup(!openSchedulePopup)
            setScheduleId(scheduleData.scheduleId)
            setSelectDate(scheduleData.dateTime)
            setPropertyId(scheduleData.propertyId ? scheduleData.propertyId : scheduleData.id)
            setEmergency(scheduleData.emergency)
        } else {
            setOpenSchedulePopup(!openSchedulePopup)
            setScheduleId("")
            setEmergency(false)
            setSelectDate(new Date())
            setPropertyId(scheduleData.propertyId)
        }

    }
    const handleScheduleProperty = (e) => {
        e.preventDefault()
        const payload = {
            dateTime: moment(selecteDate).valueOf(),
            emergency: Boolean(Emergency),
            date: moment(selecteDate).format(),
            propertyId: PropertyId,
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            limit: rowsPerPage,
            page: parPage,
            selectedField: searchSelect
        }
        dispatch(AddScheduleDetail(payload))
        setOpenSchedulePopup(!openSchedulePopup)
        setEmergency(false)
        setSelectDate(new Date())
        setPropertyId("")
        setScheduleId("")
    }
    const handleChangeEmergency = (e) => {
        setEmergency(e.target.checked)

    }
    const handleChange = (e) => {
        switch (e.target.name) {
            case "Days":
                setDays(e.target.value)
                break
            default:
                break
        }
    }
    const handleScheduleUpdate = () => {

        const payload = {
            dateTime: moment(selecteDate).valueOf(),
            emergency: Boolean(Emergency),
            scheduleId: ScheduleId,
            date: moment(selecteDate).format(),
            propertyId: PropertyId,
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            limit: rowsPerPage,
            page: parPage,
            selectedField: searchSelect, 
            UnhandledOption:unhandledOption
        }

        dispatch(UpdateScheduleDetail(payload))
        setOpenSchedulePopup(!openSchedulePopup)
        setScheduleId("")
        setEmergency(false)
        setSelectDate(new Date())
        setPropertyId("")
        setUnhandledOption(false)

    }
    const handleScheduleClose = () => {
        setOpenSchedulePopup(!openSchedulePopup)
        setScheduleId("")
        setEmergency(false)
        setSelectDate(new Date())
        setPropertyId("")
    }
    const handleSetFrequency = (data) => {
        setOpenSetFrequencyPopup(!openSetFrequencyPopup)
        setPropertyId(data.propertyId)
        if (custom === true) {
            setDisabledValue(false)
            setDays(data.propUpdateFreqdays)
        }

    }
    const handleSetFeq = (e) => {
        setSelectedFreq(e.target.name)
        switch (e.target.name) {
            case "daily":
                setDaily(true)
                setAlternate(false)
                setCustom(false) 
                setDays(1)
                setDisabledValue(true)
                break
            case "alternate":
                setAlternate(true)
                setCustom(false)
                setDaily(false)
                setDays(2)
                setDisabledValue(true)
                break
            case "custom":
                setCustom(true)
                setDaily(false)
                setAlternate(false)
                setDisabledValue(false)
                setDays("")
            default:
                break
        }
    }
    const handleSubmitSetFreq = () => {
        const payload = {
            propUpdateFreqdays: Days,
            propertyId: PropertyId,
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            limit: rowsPerPage,
            page: parPage,
            selectedField: searchSelect,
            selectedFreq: SelectedFreq
        }
        dispatch(addFreqSchedule(payload))
        setOpenSetFrequencyPopup(!openSetFrequencyPopup)
        setCustom(true)
        setDaily(false)
        setAlternate(false)
        setDisabledValue(false)
        setDays("")
    }
    const handleViewHistory = (data) => {
        setViewHistoryOpen(!ViewHistoryOpen)
        setHistoryPropertyId(data.propertyId)
        const payload = { 
            propertyId: data.propertyId,
            page: parPageViewHistory,
            limit: rowsPerPageViewHistory 
        }
        dispatch(getScheduleHistory(payload))
    }
    const handleCloseHistory = () => {
        setViewHistoryOpen(!ViewHistoryOpen)
    }
    const handleClose = () => {
        setOpenSetFrequencyPopup(false)
        setCustom(true)
        setDaily(false)
        setAlternate(false)
        setDisabledValue(false)
        setDays("")
    }
    useEffect(() => {
        const payload = {
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            limit: rowsPerPage,
            page: parPage,
            selectedField: searchSelect

        }
        dispatch(getSchedulerPropeties(payload))
    }, [])
    const handlePerPageViewHistory  = (e) => {
        setRowsPerPageViewHistory(parseInt(e.target.value))
        setCurrentPageViewHistory(0)
        setParPageViewHistory(1)
        const payload = {
            page: parPageViewHistory,
            limit: parseInt(e.target.value),
            propertyId: historyPropertyId
        }
        dispatch(getScheduleHistory(payload))
    }
    const handlePaginationViewHistory = (page) => {
        setCurrentPageViewHistory(page.selected)
        setParPageViewHistory(page.selected + 1)
        const payload = {
            page: page.selected + 1,
            limit: rowsPerPageViewHistory,
            propertyId: historyPropertyId
        }
        dispatch(getScheduleHistory(payload))

    }
    const handleUnhandleProperties = () => {
        const payload = {
            sortingName: sortName,
            sortingValue: sortValue,
            limit: rowsPerPage,
            page: parPage
        }
        dispatch(getunhandledPropeties(payload))
        setUnhandledOption(true)
    }
    const handleBack = () => {
        const payload = {
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            limit: rowsPerPage,
            page: parPage,
            selectedField: searchSelect

        }
        dispatch(getSchedulerPropeties(payload))
        setUnhandledOption(false)

    }
    const store = useSelector((state) => state)
    const scheduledPropertiesStore = store.SchedulerRedux.SchedulerPropertiesData.data ? store.SchedulerRedux.SchedulerPropertiesData.data.data.properties : []
    const lenth = store.SchedulerRedux.SchedulerPropertiesData.data ? store.SchedulerRedux.SchedulerPropertiesData.data.totalCount : 0
    const count = Math.ceil(lenth / rowsPerPage)
    const historyListingStore = store.SchedulerRedux.historyListing.data ? store.SchedulerRedux.historyListing.data.data : []
    const countHistory = store.SchedulerRedux.historyListing.data ? store.SchedulerRedux.historyListing.data.totalCount : 0
    const countViewHistory =  Math.ceil(countHistory / rowsPerPageViewHistory)

    const handleBulkSchedule = () => {
       
        setOpenBulkSchedule(!openbulkSchedule)
            setEmergency(false)
            setSelectDate(new Date())
            setPropertyId(selectedRows)
    }
    const handleBulkScheduleClose = () => {
        setOpenBulkSchedule(!openbulkSchedule)
        setEmergency(false)
        setSelectDate(new Date())
        setPropertyId("")
        setSelectedRows([])
    }
    const handleBulkScheduleProperty = (e) => {
        e.preventDefault()
        const payload = {
            dateTime:  moment(selecteDate).format(),
            emergency: Boolean(Emergency),
            date: selecteDate,
            propertyId: selectedRows,
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            limit: rowsPerPage,
            page: parPage,
            selectedField: searchSelect
        }
        dispatch(AddBulkScheduleDetail(payload))
        setOpenBulkSchedule(!openbulkSchedule)
        setEmergency(false)
        setSelectDate(new Date())
        setPropertyId("")
        setScheduleId("")
        setSelectedRows([])
    }
    const handleSelect = id => {
        const selectedRowsArr = selectedRows
        if (!selectedRowsArr.includes(id)) {
            selectedRowsArr.push(id)
        } else if (selectedRowsArr.includes(id)) {
            selectedRowsArr.splice(selectedRowsArr.indexOf(id), 1)
        } else {
            return null
        }
        setSelectedRows([...selectedRowsArr])
    }

    const handleSelectAll = () => {
        let selectedRowsArr = selectedRows
        if (selectedRowsArr.length < scheduledPropertiesStore.length) {
            const ids = scheduledPropertiesStore.map(i => i.propertyId)
            selectedRowsArr = ids
        } else if (selectedRowsArr.length === scheduledPropertiesStore.length) {
            selectedRowsArr = []
        } else {
            return null
        }

        setSelectedRows(selectedRowsArr)
    }
    return <div>
        <Fragment>
            <Breadcrumbs title={t('scheduledPropH')} data={[{ title: 'ScheduledProperties' }, { title: 'Scheduled Properties' }]} />
        </Fragment>
        <Card>
            <CardHeader className='flex flex-column align-items-end border-bottom'>
            <Row className={unhandledOption === true ? "container p-0" : "align-items-end"}>
    {unhandledOption && <Col className="my-1" sm="1"> <div className="d-flex align-items-center cursor-pointer" onClick={() => handleBack()}> <ChevronLeft size={15} />Back</div></Col> }
    {unhandledOption && <Col sm={selectedRows.length !== 0 ? "5" : "7"}></Col>}
                    <Col className='d-flex align-items-end p-0' sm={unhandledOption === true && selectedRows.length !== 0 ? '6' : unhandledOption === true ? "4" : '12'}>
                        <div className='d-flex align-items-center'> 
                            <Input
                                className='dataTable-select'
                                type='select'
                                id='sort-select'
                                value={searchSelect}
                                style={{ width: "100px", padding: '5%' }}
                                onChange={e => handleSearchSelect(e)}
                            >
                                <option value={"selected"}>{t('select')}</option>
                                <option value={"propertySelected"}>{t('ByLandmark')}</option>
                                <option value={"propertyTypeSelected"}>{t('byPropType')}</option>
                                <option value={"requestSelected"}>{t('byReqId')}</option>
                            </Input>
                        </div>

                        <InputGroup className=''>
                            <InputGroupText>
                                <Search size={14} />
                            </InputGroupText>
                            <Input
                                className='dataTable-filter mb-40'
                                type='text'
                                bsSize='sm'
                                placeholder={searchSelect === "selected" ? `${t('searchby')}` : searchSelect === "propertySelected" ? `${t('SearchbyLandMark')}` : searchSelect === "propertyTypeSelected" ? `${t('searchbyPropType')}` : searchSelect === "requestSelected" ? `${t('SearchbyRequestId')}` : ""}
                                id='search-input'
                                disabled={searchSelect === "selected"}
                                value={searchValue}
                                onChange={handleFilter}
                            />
                        </InputGroup>
                        {selectedRows.length !== 0 ? <Button className='ms-1 w-100' onClick={() => handleBulkSchedule()}  color='success' >Bulk Schedule</Button> : "" }

                        {unhandledOption === false &&  
                        <Button className='ms-1' onClick={() => handleUnhandleProperties()}  color='success' >Unhandled</Button>
                        }

                    </Col>
                  

                </Row>
            </CardHeader>

            <div className='react-dataTable'>
                <Table responsive>
                    <thead>
                        <tr>

                            {updatedHeaders.length !== 0 ? updatedHeaders.map((item, index) => {
                                if (item.accessor === "checkbox") {
                                    return <th><div className="form-check mx-1">
                
                                        <Input
                                            type='checkbox'
                                            id='select-all'
                                            label=''
                                            checked={!!selectedRows.length}
                                            onChange={() => handleSelectAll()}
                                        /></div></th>
                                }
                                return <th key={index} scope='col' className='text-nowrap'
                                >
                                    {item.header}
                                    {item.header === "Action" ? "" : <> {currentSortId === item.accessor && sortValue === "ASC" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}

                                </th>
                            }) : []}
                        </tr>

                    </thead>
                    <tbody>
                        {!!scheduledPropertiesStore && scheduledPropertiesStore.length !== 0 ? scheduledPropertiesStore.map((val, i) => {
                            return <tr key={i}
                            style={{
                                color: val.unhandledStatus !== 'Unhandled' ? "" : "white",
                                backgroundColor:  val.unhandledStatus !== 'Unhandled' ? "" : "#b3cee5"
                              }}>{
                                updatedHeaders.map((accesser, h) => {
                                    switch (accesser.accessor) {
                                        case "checkbox":
                                            return <td><div className="form-check mx-1"> <Input
                                                id={val.propertyId}
                                                type='checkbox'
                                                onChange={() => handleSelect(val.propertyId)}
                                                checked={!!selectedRows.includes(val.propertyId)}
                                            /></div></td>
                                        case "dateTime":
                                            return val["dateTime"] === null ? <td>_</td> : <td key={h}>{moment(val["dateTime"]).format("lll")}</td>
                                        case "upcomingColletionDate":
                                            return val["upcomingColletionDate"] === null ? <td>_</td> : <td key={h}>{moment(val["upcomingColletionDate"]).format("ll")}</td>
                                        case "createdAt":
                                            return val["createdAt"] === null ? <td>_</td> : <td key={h}>{moment(val["createdAt"]).format("lll")}</td>
                                        case "updatedAt":
                                            return val["updatedAt"] === null ? <td>_</td> : <td key={h}>{moment(val["updatedAt"]).format("lll")}</td>
                                        case "visitTime":
                                            return (val["UpcomingColletionStartTime"] === null && val["UpcomingColletionEndTime"] === null) || (val["UpcomingColletionStartTime"] === "null" && val["UpcomingColletionEndTime"] === "null") ? <td>_</td> : <td key={h}>{`${val["UpcomingColletionStartTime"]} - ${val["UpcomingColletionEndTime"]}`}</td>
                                        case "latitude":
                                            return val[accesser.accessor] === 'null' || val[accesser.accessor] === null || val[accesser.accessor] === '' ? <td>_</td> : <td key={h}>{val[accesser.accessor] ? (val[accesser.accessor]).slice(0, 8) : ""}</td>
                                        case "longitude":
                                            return val[accesser.accessor] === 'null' || val[accesser.accessor] === null || val[accesser.accessor] === '' ? <td>_</td> : <td key={h}>{val[accesser.accessor] ? (val[accesser.accessor]).slice(0, 8) : ""}</td>
                                        case "propUpdateFreqdays":
                                            return val[accesser.accessor] === 'null' || val[accesser.accessor] === null || val[accesser.accessor] === '' ? <td>_</td> : <td key={h} style={{textAlign:'center'}} >{val[accesser.accessor]}</td>
                                        case "actionButton":
                                            return <div className='d-flex align-items-center justify-content-center'>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle className='pe-1' tag='span'>
                                                        <MoreVertical size={15} style={{ cursor: "pointer" }} />
                                                    </DropdownToggle>
                                                    <DropdownMenu end>
                                                        <DropdownItem onClick={() => handleSchedule(val)}>
                                                            <FileText size={15} />
                                                            <span className='align-middle ms-50'>{(val.scheduleId !== "" || unhandledOption === true || val.scheduleId !== null) && (val.dateTime !== null) && (val.status === "Scheduled") ? `${t('editSchedule')}` : `${t('addSchedule')}`}</span>
                                                        </DropdownItem>
                                                        {unhandledOption === true ? '' : <DropdownItem onClick={() => handleSetFrequency(val)}>
                                                            <FileText size={15} />
                                                            <span className='align-middle ms-50' >{t('setFreq')}</span>
                                                        </DropdownItem>}
                                                      
                                                        {unhandledOption === true ? '' :   <DropdownItem onClick={() => handleViewHistory(val)}>
                                                            <FileText size={15} />
                                                            <span className='align-middle ms-50' >{t('viewHist')}</span>
                                                        </DropdownItem>}
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
        <Modal isOpen={openSchedulePopup} toggle={handleSchedule} className='modal-dialog-centered modal-sm' backdrop="static">
            <ModalHeader className='bg-transparent' toggle={handleSchedule}></ModalHeader>
            <div className='text-center' style={{ margin: "-25px" }}>
                <h3 className=''> {ScheduleId !== "" ? `${t('editSchedule')}` : `${t('addSchedule')}`}</h3>
            </div>
            <ModalBody className='mx-auto align-items-center'>
                <div className='demo-inline-spacing'>
                    <div className='d-flex align-items-center'>

                        <div className='form-switch form-check-primary'>
                            <Input type='checkbox' id='switch-primary' name='Emergency' checked={Emergency} onChange={handleChangeEmergency} />
                        </div>
                        <Label for='switch-primary' className='form-check-label mb-50'>
                            {t('emergency')}
                        </Label>
                    </div>
                </div>


                <div className='mb-sm-0 mb-1' sm='6' md='4' lg='2'>
                    <Label className="mb-sm-0 mb-lg-0">{t('selectDate')}</Label>
                    <Flatpickr
                        id='selectDate'
                        name='selectDate'
                        className='form-control'
                        maxDate={moment().toDate()}
                        // selected={selecteDate}
                        onChange={date => setSelectDate(date[0])}
                        value={selecteDate}
                        options={{ dateFormat: 'd-M-Y' }}
                    />
                </div>

            </ModalBody>
            <ModalFooter>
                <Button onClick={handleScheduleClose}>{t('cancel')}</Button>
                {ScheduleId !== "" ? <Button color="primary" onClick={handleScheduleUpdate}>{t('editSchedule')}</Button> : <Button onClick={handleScheduleProperty} color="primary">Schedule</Button>}
            </ModalFooter>
        </Modal>

        {/* setFrequency */}
        <Modal isOpen={openSetFrequencyPopup} toggle={handleSetFrequency} className='modal-dialog-centered modal-md' backdrop="static">
            <ModalHeader className='bg-transparent' toggle={handleSetFrequency}>    </ModalHeader>
            <div className='text-center mb-1'>
                <h3 className=''> {t('setFreq')} </h3>
            </div>
            <ModalBody className='mx-auto align-items-center'>
                <Row>
                    <Col md={4} xs={4} lg={4}>
                        <div className='form-check form-check-primary'>
                            <Input
                                type='radio'
                                label='Daily'
                                id='daily'
                                name="daily"
                                value={daily}
                                checked={daily === true}
                                onChange={(e) => handleSetFeq(e)}
                            />
                            <Label className='form-check-label' for='daily'>
                                {t('daily')}
                            </Label>
                        </div>
                    </Col>
                    <Col md={4} xs={4} lg={4}>
                        <div className='form-check form-check-primary'>
                            <Input
                                type='radio'
                                label='alternate'
                                id='alternate'
                                name="alternate"
                                value={alternate}
                                checked={alternate === true}
                                onChange={(e) => handleSetFeq(e)}
                            />
                            <Label className='form-check-label' for='alternate'>
                                {t('alternate')}
                            </Label>
                        </div>
                    </Col>
                    <Col md={4} xs={4} lg={4}>
                        <div className='form-check form-check-primary'>
                            <Input
                                type='radio'
                                label='Custom'
                                id='custom'
                                name="custom"
                                value={custom}
                                onChange={(e) => handleSetFeq(e)}
                                checked={custom === true}
                            />
                            <Label className='form-check-label' for='custom'>
                                {t('custom')}
                            </Label>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} xs={12} lg={12}>
                        <Label className='form-label' for='Days'>
                            {t('days')}
                        </Label>
                        <Input type="number" disabled={disabledValue} onChange={(e) => handleChange(e)} name="Days" value={daily === true ? 1 : alternate === true ? 2 : custom === true ? Days : ""} id='Days' placeholder={t('phDays')} />

                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter className="mt-2">
                <Button type='reset' color='secondary' outline onClick={handleClose}>
                    {t('cancel')}
                </Button>
                {/* <div xs={12} className='text-center mt-2 pt-50'> */}
                <Button type='submit' color='primary' onClick={handleSubmitSetFreq} > {t('save')}
                </Button>

                {/* </div> */}
            </ModalFooter>
        </Modal>

        {/* Bulk schedule */}
        <Modal isOpen={openbulkSchedule} toggle={handleBulkSchedule} className='modal-dialog-centered modal-sm' backdrop="static">
            <ModalHeader className='bg-transparent' toggle={handleBulkSchedule}></ModalHeader>
            <div className='text-center' style={{ margin: "-25px" }}>
                <h3 className=''> {t('addSchedule')}</h3>
            </div>
            <ModalBody className='mx-auto align-items-center'>
                <div className='demo-inline-spacing'>
                    <div className='d-flex align-items-center'>

                        <div className='form-switch form-check-primary'>
                            <Input type='checkbox' id='switch-primary' name='Emergency' checked={Emergency} onChange={handleChangeEmergency} />
                        </div>
                        <Label for='switch-primary' className='form-check-label mb-50'>
                            {t('emergency')}
                        </Label>
                    </div>
                </div>


                <div className='mb-sm-0 mb-1' sm='6' md='4' lg='2'>
                    <Label className="mb-sm-0 mb-lg-0">{t('selectDate')}</Label>
                    <Flatpickr
                        id='selectDate'
                        name='selectDate'
                        className='form-control'
                        maxDate={moment().toDate()}
                        // selected={selecteDate}
                        onChange={date => setSelectDate(date[0])}
                        value={selecteDate}
                        options={{ dateFormat: 'd-M-Y' }}
                    />
                </div>

            </ModalBody>
            <ModalFooter>
                <Button onClick={handleBulkScheduleClose}>{t('cancel')}</Button>
                 <Button onClick={handleBulkScheduleProperty} color="primary">Schedule</Button>
            </ModalFooter>
        </Modal>
        {/* view history */}
        <Modal isOpen={ViewHistoryOpen} toggle={handleViewHistory} className='modal-dialog-centered modal-xl' backdrop="static">
            <ModalHeader className='bg-transparent' toggle={handleViewHistory}></ModalHeader>
            <div className='text-center mb-1'>
                <h3 className=''>{t('scheduledHist')}</h3>
            </div>
            <ModalBody className=''>

                <div className='react-dataTable'>
                    <Table responsive>
                        <thead>
                            <tr>
                                {historyHeaders.length !== 0 ? historyHeaders.map((item, index) => {
                                    return <th key={index} scope='col' className='text-nowrap'>
                                        {item.header}
                                        {/* {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)} */}

                                    </th>
                                }) : []}
                            </tr>

                        </thead>
                        <tbody>
                            {!!historyListingStore && historyListingStore.length !== 0 ? historyListingStore.map((val, i) => {
                                return <tr key={i}>{
                                    historyHeaders.map((accesser, h) => {
                                        return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null ? "_" : val[accesser.accessor]}</td>

                                    })
                                }
                                </tr>
                            }) : []}
                        </tbody>

                    </Table>
              
                </div>

            </ModalBody>
            <ModalFooter>
            <div className="d-flex float-end">
                        <div className='d-flex align-items-center'>
                            <Label for='sort-select'>{t('Page')}</Label>
                            <Input
                                className='dataTable-select'
                                type='select'
                                id='sort-select'
                                style={{ width: "90px" }}
                                value={rowsPerPageViewHistory}
                                onChange={e => handlePerPageViewHistory(e)}
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
                                pageCount={countViewHistory}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={2}
                                activeClassName='active'
                                forcePage={currentPageViewHistory}
                                onPageChange={page => handlePaginationViewHistory(page)}
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
                <Button onClick={handleCloseHistory}>{t('cancel')}</Button>
            </ModalFooter>
        </Modal>
    </div>
}

export default (withTranslation()(Scheduled))