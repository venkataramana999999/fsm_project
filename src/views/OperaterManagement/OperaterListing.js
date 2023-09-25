import {
    Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button, Row, Col, Label, Input, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalBody, ModalHeader
} from "reactstrap"
import { getOperaterHeader, getOperaterData, getExportFile, OperatorDelete, addOperatorDetails, UpdateOperatorDetails } from "../../redux/Operator"
import { Fragment, useEffect, useState } from "react"
import InputPasswordToggle from '@components/input-password-toggle'
import { useDispatch, useSelector } from "react-redux"
import Flatpickr from 'react-flatpickr'
import { MoreVertical, Edit, FileText, Archive, Trash, X, ChevronDown, ChevronUp, Plus } from 'react-feather'
import Breadcrumbs from '@components/breadcrumbs'
import Swal from 'sweetalert2'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import moment from "moment"
import { withTranslation } from 'react-i18next'

const OperatorListing = ({ t }) => {
    const dispatch = useDispatch()
    const [operatorIds, setOperatorId] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [parPage, setParPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [sortName, setSortName] = useState('')
    const [sortValue, setSortValue] = useState('desc')
    const [currentSortId, setCurrentSortId] = useState('')
    const [openAddModal, setOpenAddModal] = useState(false)
    const [OperatorName, setOperatorName] = useState("")
    const [OperatorNameErr, setOperatorNameErr] = useState("")
    const [OperatorNameT, setOperatorNameT] = useState("")
    const [ApplicantName, setApplicantName] = useState("")
    // const [ApplicantNameErr, setApplicantNameErr] = useState("")
    const [ContactNo, setContactNo] = useState("")
    const [ContactNoErr, setContactNoErr] = useState("")
    const [VehicleNo, setVehicleNo] = useState("")
    const [VehicleNoErr, setVehicleNoErr] = useState("")
    const [VehicleType, setVehicleType] = useState(1)
    // const [VehicleTypeErr, setVehicleTypeErr] = useState("")
    const [GPSinstalled, setGPSinstalled] = useState("No")
    const [status, setStatus] = useState(false)
    // const [GPSinstalledErr, setGPSinstalledErr] = useState("")
    const [Email, setEmail] = useState("")
    // const [EmailErr, setEmailErr] = useState('')
    const [Capacity, setCapacity] = useState("")
    const [CapacityErr, setCapacityErr] = useState("")
    const [toDate, setDate] = useState(new Date())
    const [OperatorUserName, setOperatorUserName] = useState("")
    const [OperatorUserNameErr, setOperatorUserNameErr] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [OperatorPasswordeErr, setOperatorPasswordeErr] = useState("")
    const [userPasswordConfirm, setUserPasswordConfirm] = useState("")
    const [userPasswordConfirmErr, setuserPasswordConfirmErr] = useState("")
    const Checkvalidition = (checkData) => {
        let error = false
        let errorOperatorName = false
        let errorContact = false
        let errorVehicle = false
        let errorCapacity = false
        let errorOperatorUser = false
        let errorPassword = false
        let errorConfirmPass = false
        let errorPassMatch = false
        // let errorValidContact = false

        if (OperatorName === "" && checkData === "handleSubmit") {
            errorOperatorName = true
            setOperatorNameErr(`${t('required')}`)
        } else {
            errorOperatorName = false
            setOperatorNameErr("")
        }
        if (ContactNo === "" && checkData === "handleSubmit") {
            errorContact = true
            setContactNoErr(`${t('required')}`)
        } else {
            errorContact = false
            setContactNoErr("")
        }
        // if (ContactNo !== ""  && !ContactNo.match(/^[0-9]{1,10}$/) && checkData === "handleSubmit") {
        //     errorValidContact = true
        //     console.log(errorValidContact)
        //     setContactNoErr(`${t('operatorContact')}`)
        // } else {
        //     errorValidContact = false
        //     setContactNoErr(`${t('')}`)

        // }

        if (VehicleNo === "" && checkData === "handleSubmit") {
            errorVehicle = true
            setVehicleNoErr(`${t('required')}`)
        } else {
            errorVehicle = false
            setVehicleNoErr("")
        }
        if (Capacity === "" && checkData === "handleSubmit") {
            errorCapacity = true
            setCapacityErr(`${t('required')}`)
        } else if (Capacity !== "") {
            if (!String(Capacity).match(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/)) {
                errorCapacity = true
                setCapacityErr(`${t('disposalCapacityErr2')}`)
            } else {
                errorCapacity = false
            setCapacityErr("")
            }
        } else {
            errorCapacity = false
            setCapacityErr("")
        }
        if (OperatorUserName === "" && checkData === "handleSubmit") {
            errorOperatorUser = true
            setOperatorUserNameErr(`${t('required')}`)
        } else if (OperatorUserName !== "") {
            errorOperatorUser = false
            setOperatorUserNameErr("")
            if (userPassword === "" && checkData === "handleSubmit") {
                errorPassword = true
                setOperatorPasswordeErr(`${t('required')}`)
            } else {
                errorPassword = false
                setOperatorPasswordeErr("")
            }

        } else if (OperatorUserName !== "" && userPassword !== "" && checkData === "handleSubmit") {
            if (!userPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
                errorPassMatch = true
                setOperatorPasswordeErr(`${t('ulbPassErr')}`)
            } else {
                errorPassMatch = false
                setOperatorPasswordeErr("")
            }
        } else {
            errorPassMatch = false
            setOperatorPasswordeErr("")
            setOperatorUserNameErr("")

        }
        if (userPassword !== "" && userPasswordConfirm === "" && checkData === "handleSubmit") {
            errorConfirmPass = true
            setuserPasswordConfirmErr(`${t('required')}`)
        } else if (userPassword === "" && userPasswordConfirm === "" && checkData === "handleSubmit") {
            errorConfirmPass = true
            setuserPasswordConfirmErr(`${t('required')}`)
            setOperatorPasswordeErr(`${t('required')}`)
        } else {
            errorConfirmPass = false
            setuserPasswordConfirmErr("")
        }
        if (!errorOperatorName && !errorContact && !errorVehicle && !errorCapacity && !errorOperatorUser && !errorPassword && !errorConfirmPass && !errorPassMatch) {
            error = false
          } else {
            error = true
          }
          return error
        }
    const handleExport = () => {
        const payload = {
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            page: parPage,
            limit: rowsPerPage
        }
        dispatch(getExportFile(payload))
    }
    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        setSearchValue(value)

        const payload = {
            field: "search",
            query: value,
            sortingName: sortName,
            sortingValue: sortValue,
            page: parPage,
            limit: rowsPerPage
        }
        dispatch(getOperaterData(payload))
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
            limit: parseInt(e.target.value)
        }
        dispatch(getOperaterData(payload))
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
            limit: rowsPerPage
        }
        dispatch(getOperaterData(payload))
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
            page: parPage,
            limit: rowsPerPage
        }
        dispatch(getOperaterData(payload))
    }
    const handleModalClose = () => {
        setOpenAddModal(false)
        setOperatorId("")
        setOperatorName("")
        setOperatorName("")
        setApplicantName("")
        setContactNo("")
        setVehicleNo("")
        setVehicleType(1)
        setGPSinstalled("")
        setEmail("")
        setCapacity("")
        setOperatorUserName("")
        setUserPassword('')
        setUserPasswordConfirm('')
        setOperatorNameErr("")
        setCapacityErr("")
        setContactNoErr("")
        setVehicleNoErr("")
        setOperatorUserNameErr("")
        setOperatorPasswordeErr("")
        setuserPasswordConfirmErr("")
    }
    const handleAddProperty = () => {
        setOpenAddModal(true)
        setOperatorName('')
        setOperatorNameT('')
        setApplicantName('')
        setContactNo('')
        setVehicleNo('')
        setVehicleType(1)
        setGPSinstalled('No')
        setEmail('')
        setCapacity('')
        setOperatorUserName('')
        setUserPassword('')
        setUserPasswordConfirm('')
        setOperatorNameErr("")
        setCapacityErr("")
        setContactNoErr("")
        setVehicleNoErr("")
        setOperatorUserNameErr("")
        setOperatorPasswordeErr("")
        setuserPasswordConfirmErr("")
    }
    const handleDelete = (opId) => {
        const payload = {
            id: opId
        }
        dispatch(OperatorDelete(payload))
    }
    const handleEdit = (data) => {
        // console.log(data.vehicleType, "ffffff", typeof data.vehicleType)
        setOperatorId(data.operatorId)
        setOpenAddModal(true)
        setOperatorName(data.name)
        setOperatorNameT(data.name_tn)
        setApplicantName(data.applicantName)
        setContactNo(data.contactNumber)
        setVehicleNo(data.registrationNumber)
        setVehicleType(data.vehicleType)
        setGPSinstalled(data.gpsInstalled)
        setEmail(data.email)
        setCapacity(data.capacity)
        setOperatorUserName(data.username)
        setUserPassword('')
        setUserPasswordConfirm('')
        setOperatorNameErr("")
        setCapacityErr("")
        setContactNoErr("")
        setVehicleNoErr("")
        setOperatorUserNameErr("")
        setOperatorPasswordeErr("")
        setuserPasswordConfirmErr("")
    }
    const handleChange = (e) => {
        switch (e.target.name) {
            case "OperatorName":
                setOperatorName(e.target.value)
                Checkvalidition()
                break
            case "OperatorNameT":
                setOperatorNameT(e.target.value)
                break
            case "ApplicantName":
                setApplicantName(e.target.value)
                break
            case "ContactNo":
                setContactNo(e.target.value)
                Checkvalidition()
                break
            case "VehicleNo":
                setVehicleNo(e.target.value)
                Checkvalidition()
                break
            case "VehicleType":
                setVehicleType(e.target.value)
                break
            case "GPSinstalled":
                setGPSinstalled(e.target.value)
                break
            case "Email":
                setEmail(e.target.value)
                break
            case "Capacity":
                setCapacity(e.target.value)
                Checkvalidition()
                break
            case "OperatorUserName":
                setOperatorUserName(e.target.value)
                Checkvalidition()
                break
            case "userPassword":
                setUserPassword(e.target.value)
                Checkvalidition()
                break
            case "userPasswordConfirm":
                setUserPasswordConfirm(e.target.value)
                Checkvalidition()
                break
            case "status":
                setStatus(e.target.value)
            default:
                break
        }
        Checkvalidition("handleChange")
    }

    const handleSubmit = () => {
        const err = Checkvalidition("handleSubmit")
        // console.log(err, "eeeeeeeee")
        if (operatorIds !== "") {
            if (err === true) {

            } else {
                const payloadUpdate = {
                    id: operatorIds,
                    operatorId: operatorIds,
                    name: OperatorName,
                    name_tn: OperatorNameT,
                    applicantName: ApplicantName,
                    contactNumber: ContactNo,
                    email: Email,
                    vehicleOwnerName: null,
                    username: OperatorUserName,
                    password: userPassword,
                    capacity:Capacity,
                    registrationNumber: VehicleNo,
                    gpsInstalled: GPSinstalled,
                    referenceNumber: moment(toDate).format("YYYY"),
                    typeId: VehicleType,
                    validity: moment(toDate).format("YYYY"),
                    isDisableOperator: Boolean(status)
                }
                dispatch(UpdateOperatorDetails(payloadUpdate))
                setOpenAddModal(!openAddModal)
                setOperatorName('')
                setOperatorNameT('')
                setApplicantName('')
                setContactNo('')
                setVehicleNo('')
                setVehicleType(1)
                setGPSinstalled('')
                setEmail('')
                setCapacity('')
                setStatus(false)
                setOperatorUserName('')
                setUserPassword('')
                setUserPasswordConfirm('')
                setOperatorNameErr("")
                setCapacityErr("")
                setContactNoErr("")
                setVehicleNoErr("")
                setOperatorUserNameErr("")
                setOperatorPasswordeErr("")
                setuserPasswordConfirmErr("")
            }

        } else {
            if (err === true) {

            } else {
                const payload = {
                    name: OperatorName,
                    name_tn: OperatorNameT,
                    applicantName: ApplicantName,
                    contactNumber: ContactNo,
                    email: Email,
                    vehicleOwnerName: "",
                    username: OperatorUserName,
                    password: userPassword,
                    capacity: Capacity,
                    registrationNumber: VehicleNo,
                    gpsInstalled: GPSinstalled,
                    referenceNumber: moment(toDate).format("YYYY"),
                    typeId: VehicleType,
                    validity: moment(toDate).format("YYYY"),
                    isDisableOperator: Boolean(status)

                }
                dispatch(addOperatorDetails(payload))
                setOpenAddModal(!openAddModal)
                setOperatorName('')
                setOperatorNameT('')
                setApplicantName('')
                setContactNo('')
                setVehicleNo('')
                setVehicleType(1)
                setGPSinstalled('')
                setEmail('')
                setCapacity('')
                setStatus(false)
                setOperatorUserName('')
                setUserPassword('')
                setUserPasswordConfirm('')
                setOperatorNameErr("")
                setCapacityErr("")
                setContactNoErr("")
                setVehicleNoErr("")
                setOperatorUserNameErr("")
                setOperatorPasswordeErr("")
                setuserPasswordConfirmErr("")

            }
        }

    }
    useEffect(() => {
        dispatch(getOperaterHeader())
        const payload = {
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            page: parPage,
            limit: rowsPerPage
        }
        dispatch(getOperaterData(payload))
    }, [])
    const store = useSelector((state) => state)
    const columns = store.Operator ? store.Operator.operatorHeaderData : []
    const OperatorStore = store.Operator ? store.Operator.operatorData ? store.Operator.operatorData.data ? store.Operator.operatorData.data.data.operators : [] : [] : []
    const lengthUlb = store.Operator ? store.Operator.operatorData.data ? store.Operator.operatorData.data.totalCount : 0 : 0
    const count = Math.ceil(lengthUlb / rowsPerPage)
    const options = [
        {
            id: 1,
            key: "Other"
        },
        {
            id: 2,
            key: "Vacuum truck with tanker"
        },
        {
            id: 3,
            key: "Tractor with tanker"
        },
        {
            id: 4,
            key: "Truck with separate tank"
        }
    ]
    return (
        <div>
            <Fragment>
                <Breadcrumbs title={t('operatorMang')} data={[{ title: 'OperatorManagement' }, { title: `${t('operatorMang')}` }]} />
            </Fragment>

            <Card>
                <CardHeader className='flex flex-column align-items-end border-bottom'>
                    <Row className="align-items-end">
                        <Col className='d-flex align-items-center' sm='5'>
                            <Label className='ms-2' for='search-input'>
                                {t('search')}
                            </Label>
                            <Input
                                className='dataTable-filter mb-40'
                                type='text'
                                bsSize='md'
                                placeholder={t('operName')}
                                id='search-input'
                                value={searchValue}
                                onChange={handleFilter}
                            />
                        </Col>
                        <Col className='d-flex align-items-center' sm='7' style={{marginRight:'-69px'}}>
                            <Button className='ms-2' color='success' onClick={handleExport}>
                                <span className='align-middle ms-50'>{t('export')}</span>
                            </Button>
                            <Button className='ms-2' color='success' onClick={handleAddProperty}>
                                {/* <Plus size={15} /> */}
                                <span className='align-middle' >{t('addNewOperator')}</span>
                            </Button>

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
                                        {item.header === "Action" ? "" : <> {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}
                                    </th>
                                }) : []}
                            </tr>
                        </thead>
                        <tbody>
                            {!!OperatorStore && OperatorStore.length !== 0 ? OperatorStore.map((val, i) => {
                                return <tr key={i}>{
                                    columns.map((accesser, h) => {
                                        switch (accesser.accessor) {
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
                                                                        confirmButton: 'btn btn-success mx-2',
                                                                        cancelButton: 'btn btn-danger mx-2'
                                                                    }
                                                                }).then((willDelete) => {
                                                                    if (willDelete.isConfirmed) {
                                                                        handleDelete(val.operatorId)
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
                                                return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null ? "_" : val[accesser.accessor]}</td>
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
                                    style={{width:"90px"}}
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
            <Modal isOpen={openAddModal} toggle={handleModalClose} className='modal-dialog-centered modal-lg' backdrop="static">
                <ModalHeader className='bg-transparent' toggle={handleModalClose}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h3 className='mb-1'> {operatorIds !== "" ? `${t('editOper')}` : `${t('addOpertor1')}`}</h3>
                    </div>
                    <Row className='gy-1 pt-75'>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='OperatorName'>
                                Name <span style={{ color: "red", fontSize:'15px'}}>*</span>
                            </Label>
                            <Input
                                id='OperatorName'
                                placeholder={t('phoperAppName')}
                                value={OperatorName}
                                name="OperatorName"
                                onChange={handleChange}
                                required
                            />
                            <div style={{ color: "red" }}>{OperatorNameErr}</div>
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='OperatorNameT'>
                                Name (Telugu)
                            </Label>
                            <Input
                                id='OperatorNameT'
                                placeholder={t('phoperAppName')}
                                value={OperatorNameT}
                                name="OperatorNameT"
                                onChange={handleChange}

                            />
                            {/* <div style={{ color: "red" }}>{OperatorNameTErr}</div> */}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='ApplicantName'>
                                {t('operAppName')}
                            </Label>
                            <Input
                                id='ApplicantName'
                                placeholder='Enter Applicant Name'
                                value={ApplicantName}
                                name="ApplicantName"
                                onChange={handleChange}

                            />
                            {/* <div style={{ color: "red" }}>{ApplicantNameErr}</div> */}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='ContactNo'>
                                {t('operContact')} <span style={{ color: "red", fontSize:'15px'}}>*</span>             </Label>
                            <Input
                                id='ContactNo'
                                placeholder='Enter Contact No.'
                                value={ContactNo}
                                name="ContactNo"
                                type="tel"
                                onChange={handleChange}
                                required
                            />
                            <div style={{ color: "red" }}>{ContactNo === "" ? ContactNoErr : ContactNo.length === 10 ? "" : ContactNo.length > 10 ? t("phoperContact") : ContactNo.length === 0 ? "" : ContactNo.length < 10 ? t("phoperContact") : ""}</div>
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='VehicleNo'>
                                {t('operVehicle')} <span style={{ color: "red", fontSize:'15px'}}>*</span>           </Label>
                            <Input
                                id='VehicleNo'
                                placeholder='Enter Vehicle No.'
                                value={VehicleNo}
                                name="VehicleNo"
                                onChange={handleChange}
                                required
                            />
                            <div style={{ color: "red" }}>{VehicleNoErr}</div>
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Email'>
                                {t('email')}        </Label>
                            <Input
                                id='Email'
                                placeholder={t('enterEmail')}
                                value={Email}
                                name="Email"
                                type="email"
                                onChange={handleChange}
                            />
                            {/* <div style={{ color: "red" }}>{EmailErr}</div> */}
                        </Col>

                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Capacity'>
                                {t('operCapacity')} <span style={{ color: "red", fontSize:'15px'}}>*</span>     </Label>
                            <Input
                                id='Capacity'
                                placeholder='Enter Capacity'
                                value={Capacity}
                                name="Capacity"
                                type="number"
                                onWheel={ event => event.currentTarget.blur() }
                                onChange={handleChange}
                                required
                            />
                            <div style={{ color: "red" }}>{CapacityErr}</div>
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='VehicleType'> {t('operVehicletype')} </Label>
                            <Input type='select' value={VehicleType} name='VehicleType' id='VehicleType' onChange={handleChange} required>
                                {/* <option value={""}>{"Select..."}</option> */}

                                {options.map((item) => {
                                    return <option value={item.id}>{item.key}</option>
                                })}
                            </Input>
                            {/* <div style={{ color: "red" }}>{VehicleTypeErr}</div> */}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='GPSinstalled'> {t('operGPSIns')} </Label>
                            <Input value={GPSinstalled} type='select' name='GPSinstalled' id='GPSinstalled' onChange={handleChange}>
                                <option value={"Yes"}>{t('ulbDeleteErr3')}</option>
                                <option value={"No"}>{t('ulbDeleteErr4')}</option>

                            </Input>
                            {/* <div style={{ color: "red" }}>{GPSinstalledErr}</div> */}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Status'> {t('status')} </Label>
                            <Input type='select' value={status} name='status' id='Status' onChange={handleChange}>
                                <option value={false}>{t('active')}</option>
                                <option value={true}>{t('Inactive')}</option>

                            </Input>
                            {/* <div style={{ color: "red" }}>{StatusErr}</div> */}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Validity'>{t('operLicenseVal')}</Label>
                            <Flatpickr
                                id='date'
                                name='toDate'
                                className='form-control'
                                onChange={toDate => setDate(toDate[0])}
                                value={toDate}
                                options={{ dateFormat: 'Y' }}
                            />
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='OperatorUserName'>
                                {t('operUserName')}
                            </Label>
                            <Input
                                id='OperatorUserName'
                                placeholder='Enter Operator User Name'
                                value={OperatorUserName}
                                name="OperatorUserName"
                                onChange={handleChange}
                                type="text"
                                required

                            />
                            <div style={{ color: "red" }}>{OperatorUserNameErr}</div>
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label required' for='UserPassword'>
                                {t('password')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
                            </Label>
                            <InputPasswordToggle
                                className='input-group-merge'
                                name="userPassword"
                                value={userPassword}
                                placeholder={t('phpass')}
                                onChange={handleChange}
                                required
                                // type="password"
                            />

                            <div style={{ color: "red" }}>{OperatorPasswordeErr}</div>

                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label required' for='userPasswordConfirm'>
                                Confirm Password <span style={{ color: "red", fontSize:'15px'}}>*</span>
                            </Label>
                            <InputPasswordToggle
                                className='input-group-merge'
                                name="userPasswordConfirm"
                                value={userPasswordConfirm}
                                placeholder='Confirm Password'
                                onChange={handleChange}
                                required
                                // type="password"
                            />

                            <div style={{ color: "red" }}>{userPasswordConfirmErr}</div>

                        </Col>
                        <Col xs={12} className='text-center mt-2 pt-50'>
                            <Button type='reset' className='me-1' color='secondary' outline onClick={handleModalClose}>
                                {t('cancel')}
                            </Button>
                            <Button type='submit' color='success' onClick={handleSubmit}>
                                {operatorIds !== "" ? `${t('saveChange')}` : `${t('save')}`}
                            </Button>

                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default (withTranslation()(OperatorListing))
