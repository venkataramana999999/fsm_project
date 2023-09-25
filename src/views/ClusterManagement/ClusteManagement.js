import {
    Modal, ModalBody, ModalHeader, Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button, Row, Col, Label, Input, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap"
import { getClusterHeader, getClusterdata, addClusterDetails, ClusterDelete, EditClusterDetails, AddUserCluster, getClusterUserdata, UpdateUserCluster } from "../../redux/ClusterMangament"
import { Fragment, useEffect, useState } from "react"
import InputPasswordToggle from '@components/input-password-toggle'
import { useDispatch, useSelector } from "react-redux"
import { getRoleList } from '../../redux/UserRedx'
// import { Link } from "react-router-dom"
import { MoreVertical, Edit, FileText, Archive, Trash, X, ChevronDown, ChevronUp, Plus, FastForward } from 'react-feather'
import Breadcrumbs from '@components/breadcrumbs'
// import AddUser from "./AddUser"
// import RoleListing from "./RoleListing"
// ** Third Party Components
import Swal from "sweetalert2"
import ReactPaginate from 'react-paginate'
import { withTranslation } from 'react-i18next'

// import moment from "moment"
const ClusterManagement = ({t}) => {
    const dispatch = useDispatch()
    // ** States
    const [modal, setModal] = useState(false)
    const [editData, setEditData] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [parPage, setParPage] = useState(1)
    const [editClusterId, setEditClusterId] = useState("")
    const [searchValue, setSearchValue] = useState('')
    const [sortName, setSortName] = useState('')
    const [sortValue, setSortValue] = useState('desc')
    const [currentSortId, setCurrentSortId] = useState('')
    const [ClusterUlbNameT, setClusterUlbNameT] = useState("")
    const [ClusterUlbNameErr, setClusterUlbNameErr] = useState("")
    const [ClusterUlbName, setClusterUlbName] = useState("")
    const [Clusterstatus, setClusterStatus] = useState(false)
    const [ClusterUserName, setClusterUserName] = useState("")
    const [RoleName, setRoleName] = useState("123")
    const [ulbSelectedId, setUlbSelectedId] = useState("")
    const [ClusterUserEmail, setClusterUserEmail] = useState("")
    const [ClusterUserPassword, setClusterUserPassword] = useState('')
    const [modalUser, setModalUser] = useState(false)
    const [ClusterUserNameErr, setClusterUserNameErr] = useState("")
    const [modalUserListing, setModalUserListing] = useState(false)
    const [ClusterUserData, setClusterUserData] = useState([])
    const [EditClusterUserId, setEditClusterUserId] = useState("")
    // ** Function to handle Modal toggle
    const handleModal = () => {
        setModal(!modal)
        setEditClusterId("")
        setClusterUlbName("")
        setClusterUlbNameT("")
        setClusterStatus(false)
        setClusterUlbNameErr("")

    }
    // const handleModalRole = () => setModalRole(!modalRole)
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
        dispatch(getClusterdata(payload))
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
            // selectedField: searchSelect

        }
        dispatch(getClusterdata(payload))
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
            // selectedField: searchSelect
        }
        dispatch(getClusterdata(payload))
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
            // selectedField: searchSelect
        }
        dispatch(getClusterdata(payload))
    }
    // const handleSearchSelect = (e) => {
    //    setSearchSelect(e.target.value)

    // }
    const handleEdit = (data) => {
        const status = data.isDisableULB === "In Active" ? "true" : "false"
        setModal(true)
        setEditClusterId(data.clusterUlbId)
        setClusterUlbName(data.clusterUlbName)
        setClusterUlbNameT(data.clusterUlbName_tn)
        setClusterStatus(status)
        setEditData(data)
    }
    const handleDelete = (userDetail) => {
        const payload = {
            tfaId: userDetail.tfaId,
            clusterUlbId: userDetail.clusterUlbId
        }
        dispatch(ClusterDelete(payload))
    }
    const checkValidity = () => {
        let error = false
        if (ClusterUlbName !== "") {
            error = false
            setClusterUlbNameErr("")
        } else {
            error = true
            setClusterUlbNameErr("*This is required field")
        }
        return error
    }
    const handleChange = (e) => {
        switch (e.target.name) {
            case "ClusterUlbName":
                setClusterUlbName(e.target.value)
                break
            case "ClusterUlbNameT":
                setClusterUlbNameT(e.target.value)
                break
            case "Clusterstatus":
                setClusterStatus(e.target.value)
                break
            case "ClusterUserName":
                setClusterUserName(e.target.value)
                break
            case "ClusterUserPassword":
                setClusterUserPassword(e.target.value)
                break
            case "ClusterUserEmail":
                setClusterUserEmail(e.target.value)
                break
            case "RoleName":
                setRoleName(e.target.value)
                break
            default:
                break
        }
    }
    const handleSumbit = () => {
        const err = checkValidity()
        if (editClusterId !== "") {
            if (!err) {
                const formdata = new FormData()
                formdata.append("id", editClusterId)
                formdata.append("typeId", editData.typeId)
                formdata.append("tfaId", editData.tfaId)
                formdata.append("tfId", editData.tfId)
                formdata.append("name", ClusterUlbName)
                formdata.append("name_tn", ClusterUlbNameT)
                formdata.append("isDisableULB", Clusterstatus)
                dispatch(EditClusterDetails(formdata))
                setModal(!modal)
                setClusterUlbName("")
                setClusterUlbNameT("")
                setClusterStatus(false)
                setClusterUlbNameErr("")
            }
        } else {
            if (!err) {
                const formdata = new FormData()

                formdata.append("typeId", "")
                formdata.append("tfaId", "")
                formdata.append("tfId", "")
                formdata.append("name", ClusterUlbName)
                formdata.append("name_tn", ClusterUlbNameT)
                formdata.append("isDisableULB", Clusterstatus)
                dispatch(addClusterDetails(formdata))
                setModal(!modal)
                setClusterUlbName("")
                setClusterUlbNameT("")
                setClusterStatus(false)
                setClusterUlbNameErr("")
            }
        }


    }
    const handleClose = () => {
        setModal(!modal)
        setClusterUlbName("")
        setClusterUlbNameT("")
        setClusterStatus(false)
        setClusterUlbNameErr("")

    }

    const handleAddClusterUser = (clusterUlbId) => {
        setModalUser(!modalUser)
        setUlbSelectedId(clusterUlbId)
        setClusterUserName("")
        setClusterUserEmail('')
        setClusterUserPassword("")
        setRoleName("123")
    }
    const handleSumbitUser = () => {
        if (ClusterUserData.length !== 0) {
            const payload = {
                username: ClusterUserName,
                email: ClusterUserEmail,
                password: ClusterUserPassword,
                role: RoleName,
                ulbId: ClusterUserData.ULBId,
                userULBId: ClusterUserData.ULBId,
                userId: ClusterUserData.Id,
                sortingName: sortName,
                sortingValue: sortValue,
                page: parPage,
                limit: rowsPerPage
            }
            dispatch(UpdateUserCluster(payload))
            setClusterUserNameErr("")
            setClusterUserPassword("")
            setClusterUserEmail("")
            setClusterUserName("")
            setModalUser(!modalUser)
        } else {
            const payload = {
                userName: ClusterUserName,
                email: ClusterUserEmail,
                password: ClusterUserPassword,
                roleId: parseInt(RoleName),
                ULBId: ulbSelectedId
            }
            dispatch(AddUserCluster(payload))
            setClusterUserNameErr("")
            setClusterUserPassword("")
            setClusterUserEmail("")
            setClusterUserName("")
            setModalUser(!modalUser)
        }
    }
    const handleCloseUser = () => {
        setModalUser(!modalUser)
        setClusterUserNameErr("")
    }
    const handleClusterUserListing = (ulbID) => {
        setModalUserListing(!modalUserListing)
        const payload = {
            sortingName: sortName,
            sortingValue: sortValue,
            page: parPage,
            limit: rowsPerPage,
            ulbId: ulbID
        }
        dispatch(getClusterUserdata(payload))
    }
    const handleClusterUserListingClose = () => {
        setModalUserListing(!modalUserListing)

    }
    const handlePaginationClusterUserListing = (page) => {
        setCurrentPage(page.selected)
        setParPage(page.selected + 1)
    }
    const handlePerPageClusterUserListing = (e) => {
        setRowsPerPage(parseInt(e.target.value))

    }
    const handleClusterUserListingEdit = (data) => {
        setModalUser(!modalUser)
        setClusterUserName(data.UserName)
        setClusterUserEmail(data.Email)
        setClusterUserPassword("")
        setRoleName(data.RoleId)
        setClusterUserData(data)
        setEditClusterUserId(data.Id)
    }
    useEffect(() => {
        dispatch(getClusterHeader())
        const payload = {
            field: "all",
            query: searchValue,
            sortingName: sortName,
            sortingValue: sortValue,
            page: parPage,
            limit: rowsPerPage
            // selectedField: searchSelect
        }
        dispatch(getClusterdata(payload))
        dispatch(getRoleList())
    }, [])
    const store = useSelector((state) => state)
    const RoleStore = store.UserRedx.RoleList ? store.UserRedx.RoleList.data ? store.UserRedx.RoleList.data.data.filter((it) => it.roleId === 123) : [] : []
    const columns = store.ClusterMangament ? store.ClusterMangament.ClusterHeaderData : []
    const clusterStore = store.ClusterMangament.ClusterData ? store.ClusterMangament.ClusterData.data ? store.ClusterMangament.ClusterData.data.data.ulbs : [] : []
    const lengthUlb = store.ClusterMangament.ClusterData.data ? store.ClusterMangament.ClusterData.data.totalCount : 0
    const count = Math.ceil(lengthUlb / rowsPerPage)
    const lengthListing = store.ClusterMangament.clusterUsersListing.data ? store.ClusterMangament.clusterUsersListing.data.totalCount : 0
    const countListing = Math.ceil(lengthListing / rowsPerPage)
    const clusterUsersListing = store.ClusterMangament.clusterUsersListing ? store.ClusterMangament.clusterUsersListing.data ? store.ClusterMangament.clusterUsersListing.data.data : [] : []
    const clusterUserHeader = [
        {
            accessor: "Id",
            filter: "false",
            header: "Sr No",
            sortable: "false"
        }, {
            accessor: "UserName",
            filter: "false",
            header: "User Name",
            sortable: "false"
        }, {
            accessor: "Email",
            filter: "false",
            header: "Email",
            sortable: "false"
        }, {
            accessor: "Name",
            filter: "false",
            header: "Role",
            sortable: "false"
        }, {
            accessor: "actionButton",
            filter: "false",
            header: "Action",
            sortable: "false"
        }
    ]
    return (
        <div>
            <Fragment>
                <Breadcrumbs title={t('clusterMng')} data={[{ title: 'ClusterManagement' }, { title: 'Cluster Management' }]} />
            </Fragment>

            <Card>
                <CardHeader className='flex flex-column align-items-end border-bottom'>
                    <Row className="align-items-end" style={{marginRight:'-60px'}}>
                        <Col className='d-flex align-items-center' sm='6'>

                            <Label className='ms-2' for='search-input'>
                                {t('search')}
                            </Label>
                            <Input
                                className='dataTable-filter mb-40'
                                type='text'
                                bsSize='md'
                                id='search-input'
                                placeholder={t('clusterUlbName')}
                                value={searchValue}
                                onChange={handleFilter}
                            />
                        </Col>
                        <Col className='d-flex align-items-center' sm='6'>
                            <Button className='ms-2' color='success' onClick={() => handleModal()}>
                                {/* <Plus size={15} /> */}
                                <span className='align-middle' >{t('addNewCluster')}</span>
                            </Button>
                            {/* <Button className='ms-2' color='primary' onClick={handleModalRole}>
                                <span className='align-middle ms-50'>Role</span>
                            </Button> */}
                        </Col>
                    </Row>
                </CardHeader>

                <div className='react-dataTable'>
                    <Table>
                        <thead>
                            <tr>
                                {columns.length !== 0 ? columns.map((item, index) => {

                                    return <th key={index} scope='col' className='text-nowrap'
                                    >
                                        {item.header}
                                        {item.header === "Action" ? "" : <> {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}


                                    </th>
                                }) : []}
                            </tr>

                        </thead>
                        <tbody>
                            {!!clusterStore && clusterStore.length !== 0 ? clusterStore.map((val, i) => {
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
                                                                        confirmButton: 'btn btn-success mx-2',
                                                                        cancelButton: 'btn btn-danger mx-2'
                                                                    }
                                                                }).then((willDelete) => {
                                                                    if (willDelete.isConfirmed) {
                                                                        handleDelete(val)
                                                                    }

                                                                }
                                                                )
                                                            }}>
                                                                <Trash size={15} />
                                                                {/* <span className='align-middle ms-50' onClick={() => handleDelete(val)}>Delete</span> */}
                                                                <span className='align-middle ms-50' >{t('delete')}</span>
                                                            </DropdownItem>

                                                            <DropdownItem onClick={() => handleAddClusterUser(val.clusterUlbId)}>
                                                                <FileText size={15} />
                                                                <span className='align-middle ms-50' >{t('CreateNewUser')}</span>
                                                            </DropdownItem>
                                                            <DropdownItem onClick={() => handleClusterUserListing(val.clusterUlbId)}>
                                                                <FileText size={15} />
                                                                <span className='align-middadminle ms-50' >{t('clusterUser')} </span>
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

            {/* add cluter */}

            <Modal isOpen={modal} toggle={handleModal} className='modal-dialog-centered modal-lg' backdrop="static">
                <ModalHeader className='bg-transparent' toggle={handleModal}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h3 className='mb-1'>{editClusterId === "" ? `${t('addNewCluster')}` : `${t('editCluster')}`} </h3>
                    </div>
                    <Row className='gy-1 pt-75'>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='ClusterUlbName'>
                                Name <span style={{ color: "red", fontSize:'15px'}}>*</span>
                            </Label>
                            <Input onChange={handleChange} name="ClusterUlbName" value={ClusterUlbName} id='ClusterUlbName' placeholder={t('phclusterUlbName')} />
                            <div style={{ color: "red" }}>{ClusterUlbNameErr}</div>

                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='ClusterUlbNameT'>
                               Name (Telugu)
                            </Label>
                            <Input onChange={handleChange} name="ClusterUlbNameT" value={ClusterUlbNameT} id='ClusterUlbNameT' placeholder='Enter cluster ULB name(Telugu)' />

                        </Col>


                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Clusterstatus'>
                                {t('status')}
                            </Label>
                            <Input type='select' name='Clusterstatus' id='Clusterstatus' value={Clusterstatus} onChange={handleChange}>
                                <option value={false}>{t('active')}</option>
                                <option value={true}>{t('Inactive')}</option>
                            </Input>

                        </Col>
                        <Col xs={12} className='text-center mt-2 pt-50'>
                            <Button type='reset' className='me-1' color='secondary' outline onClick={handleClose}>
                                {t('cancel')}
                            </Button>
                            <Button type='submit' color='success' onClick={handleSumbit}>
                                {editClusterId === "" ? `${t('save')}` : `${t('saveChange')}`}
                            </Button>

                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {/* add cluter user */}
            <Modal isOpen={modalUser} toggle={handleAddClusterUser} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={handleAddClusterUser}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h3 className='mb-1'> {EditClusterUserId !== "" ? "Edit cluster's User" :  t('CreateNewUser')} </h3>
                    </div>
                    <Row className='gy-1 pt-75'>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='ClusterUserName'>
                                {t('userName')}
                            </Label>
                            <Input required onChange={handleChange} name="ClusterUserName" value={ClusterUserName} id='ClusterUserName' placeholder={t('enterUser')} />
                            <div style={{ color: "red" }}>{ClusterUserNameErr}</div>

                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='ClusterUserPassword'>
                                {t('email')}
                            </Label>
                            <Input type="email" onChange={handleChange} name="ClusterUserEmail" required value={ClusterUserEmail} id='ClusterUserEmail' placeholder={t('enterEmail')} />

                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='ClusterUserPassword'>
                                {t('userPass')}
                            </Label>
                            {/* <Input type="password" onChange={handleChange} name="ClusterUserPassword" value={ClusterUserPassword} id='ClusterUserPassword' placeholder='Enter password)' /> */}
                            <InputPasswordToggle
                                className='input-group-merge'
                                name="ClusterUserPassword"
                                placeholder={t('enterPass')}
                                value={ClusterUserPassword}
                                onChange={(e) => handleChange(e)}

                            />
                        </Col>

                        <Col md={6} xs={12}>
                            <Label className='form-label' for='Clusterstatus'>
                                {t('role')}
                            </Label>
                            <Input aria-required="true" type='select' name='RoleName' id='RoleName' value={RoleName} onChange={handleChange}>
                                {RoleStore.map((item) => {
                                    return <option value={item.roleId}>{item.name}</option>

                                })}
                            </Input>

                        </Col>
                        <Col xs={12} className='text-center mt-2 pt-50'>
                            <Button type='reset' className='me-1' color='secondary' outline onClick={handleCloseUser}>
                                {t('cancel')}
                            </Button>
                            <Button type='submit' color='success' onClick={handleSumbitUser}> {t('save')}
                            </Button>

                        </Col>
                    </Row>
                </ModalBody>
            </Modal>

            {/* cluster's user listing */}
            <Modal isOpen={modalUserListing} toggle={handleClusterUserListingClose} className='modal-dialog-centered modal-xl' backdrop="static">
                <ModalHeader className='bg-transparent' toggle={handleClusterUserListingClose}></ModalHeader>
                <ModalBody className='px-sm-5 mx-50 pb-5'>
                    <div className='text-center mb-2'>
                        <h3 className='mb-1'>{t('clusterUser')} </h3>
                    </div>
                    <div className='react-dataTable'>
                        <Table responsive>
                            <thead>
                                <tr>
                                    {clusterUserHeader.length !== 0 ? clusterUserHeader.map((item, index) => {
                                        return <th key={index} scope='col' className='text-nowrap'
                                        >
                                            {item.header}
                                            {item.header === "Action" ? "" : <> {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}
                                        </th>
                                    }) : []}
                                </tr>

                            </thead>
                            <tbody>
                                {!!clusterUsersListing && clusterUsersListing.length !== 0 ? clusterUsersListing.map((val, i) => {
                                    return <tr key={i}>{
                                        clusterUserHeader.map((accesser, h) => {
                                            switch (accesser.accessor) {
                                                case "actionButton":
                                                    return <div className='d-flex align-items-center justify-content-center'>
                                                        <UncontrolledDropdown>
                                                            <DropdownToggle className='pe-1' tag='span'>
                                                                <MoreVertical size={15} style={{ cursor: "pointer" }} />
                                                            </DropdownToggle>
                                                            <DropdownMenu end>
                                                                <DropdownItem onClick={() => handleClusterUserListingEdit(val)}>
                                                                    <FileText size={15} />
                                                                    <span className='align-middle ms-50' >{t('edit')}</span>
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
                                        value={rowsPerPage}
                                        onChange={e => handlePerPageClusterUserListing(e)}
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
                                        pageCount={countListing}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={2}
                                        activeClassName='active'
                                        forcePage={currentPage}
                                        onPageChange={page => handlePaginationClusterUserListing(page)}
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
                </ModalBody>
            </Modal>

        </div>
    )
}

export default (withTranslation()(ClusterManagement))
