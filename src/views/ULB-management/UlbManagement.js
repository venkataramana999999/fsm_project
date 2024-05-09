import {
  Modal, ModalBody, ModalHeader, Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button, Row, Col, Label, Input, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap"
import { getUlbHeader, getULBdata, deleteULBDetails, EditULBDetails } from "../../redux/ulbManagement"
import { Fragment, useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Breadcrumbs from '@components/breadcrumbs'
import AddUlb from './AddULB'
import InputPasswordToggle from '@components/input-password-toggle'
import { MoreVertical, Edit, FileText, Archive, Trash, X, ChevronDown, ChevronUp, Plus } from 'react-feather'
// ** Third Party Components
import Swal from "sweetalert2"
import ReactPaginate from 'react-paginate'
import { withTranslation } from 'react-i18next'
// import { ChevronDown, ChevronUp, Plus } from 'react-feather'
import moment from "moment"
const ulbManagement = ({ t }) => {
  const dispatch = useDispatch()
  // const { t } = useTranslation(
  // ** States
  const [modal, setModal] = useState(false)
  const [EditModal, setEditModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [parPage, setParPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [sortName, setSortName] = useState('')
  const [sortValue, setSortValue] = useState('desc')
  const [currentSortId, setCurrentSortId] = useState('')
  const [userId, setUserId] = useState("")
  const [ulbType, setULBtype] = useState("")
  const [disabledState, setDisabledState] = useState(false)
  const [status, setStatus] = useState(false)
  const [ulbName, setUlbName] = useState("")
  const [ULBnameT, setULBnameT] = useState("")
  const [ulbCode, setUlbCode] = useState("")
  const [RequestNumberPrefix, setRequestNumberPrefix] = useState("")
  const [AdminEmail, setAdminEmail] = useState("")
  const [AdminUserName, setAdminUserName] = useState("")
  const [AdminUserPassword, setAdminUserPassword] = useState("")
  const [picture, setPicture] = useState("")
  const [ulbNameErr, setUlbNameErr] = useState("")
  const [ulbCodeErr, setUlbCodeErr] = useState("")
  const [AdminUserNameErr, setAdminUserNameErr] = useState("")
  const [ulbTypeErr, setTypeErr] = useState("")
  const [AdminEmailErr, setAdminEmailErr] = useState("")
  const [statusErr, setStatusErr] = useState("")
  const [disabledStateErr, setDisabledStateErr] = useState("")
  const [RequestNumberPrefixErr, setRequestNumberPrefixErr] = useState("")
  const [AdminUserPasswordErr, setAdminUserPasswordErr] = useState("")
  const [ulbId, setUlbId] = useState("")

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal)
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
    dispatch(getULBdata(payload))
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
      limit: e.target.value
    }
    dispatch(getULBdata(payload))
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
    dispatch(getULBdata(payload))
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
    dispatch(getULBdata(payload))
  }
  const handleEdit = (val) => {
    const sdVal = val.statedashboardValue === "No" ? JSON.stringify(false) : JSON.stringify(true)
    const statusVal = val.isDisableULB === "Active" ? JSON.stringify(false) : JSON.stringify(true)
    setEditModal(!EditModal)
    setUlbName(val.name)
    setAdminEmail(val.email)
    setAdminUserName(val.username)
    setAdminUserPassword("")
    setDisabledState(sdVal)
    setRequestNumberPrefix(val.reqIdPrefix)
    setStatus(statusVal)
    setULBnameT(val.name_tn)
    setULBtype(val.typeId)
    setUlbCode(val.code)
    setPicture(val.logo)
    setUserId(val.userId)
    setUlbId(val.ulbId)
  }
  const handleDelete = (vl) => {
    const payload = {
      id: vl
    }
    dispatch(deleteULBDetails(payload))
  }
  const ULBTypeOptions = [
    {
      id: "1",
      name: "Corporation"
    },
    {
      id: "2",
      name: "Town Panchayat"
    },
    {
      id: "3",
      name: "Village Panchayat"
    },
    {
      id: "4",
      name: "Municipality"
    }
  ]
  // ** Validation
  const checkValiditon = () => {
    let error = false
    if (ulbName === "") {
      error = true
      setUlbNameErr(t(`${"required"}`))
    } else if ((ulbName.length > 0 && ulbName.length < 3) || (ulbName.length > 100)) {
      error = true
      setUlbNameErr(`${('ulbnameErr')}`)
    } else if (ulbName && ulbName.length >= 3) {
      error = false
      setUlbNameErr("")
    } else {
      error = false
      setUlbNameErr("")
    }

    if (ulbCode === "") {
      error = true
      setUlbCodeErr(t(`${"required"}`))
    } else if ((ulbCode.length > 0 && ulbCode.length < 3) || (ulbCode.length > 6)) {
      error = true
      setUlbCodeErr(`${t('ulbCodeErr')}`)
    } else {
      error = false
      setUlbCodeErr("")
    }


    if (AdminUserName === "") {
      error = true
      setAdminUserNameErr(t(`${"required"}`))
    } else if ((AdminUserName.length > 0 && AdminUserName.length < 2) || (AdminUserName.length > 100)) {
      error = true
      setAdminUserNameErr(`${t('ulbAdminErr')}`)
    } else if (AdminUserName && AdminUserName.length >= 3) {
      error = false
      setAdminUserNameErr("")
    } else {
      error = false
      setAdminUserNameErr("")
    }

    if (AdminEmail !== "") {
      const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!AdminEmail.match(mailformat)) {
        error = true
        setAdminEmailErr(`${t('ulbEmailErr')}`)
        // this.setState({AdminEmailErr: `${t("ulbEmailErr")}`})
      } else {
        error = false
        setAdminEmailErr("")
      }
    } else if (AdminEmail === "") {
      error = true
      setAdminEmailErr(t(`${"required"}`))
    }
    if (ulbType === "") {
      error = true
      setTypeErr(t(`${"required"}`))
    } else {
      error = false
      setTypeErr("")
    }

    if (disabledState === "") {
      error = true
      setDisabledStateErr(t(`${"required"}`))
    } else {
      error = false
      setDisabledStateErr("")
    }
    if (status === "") {
      error = true
      setStatusErr(t(`${"required"}`))
    } else {
      error = false
      setStatusErr("")
    }
    if (RequestNumberPrefix === "") {
      error = true
      setRequestNumberPrefixErr(t(`${"required"}`))
    } else {
      error = false
      setRequestNumberPrefixErr("")
    }
    if (ulbName !== "" && AdminUserPassword === "") {
      error = true
      setAdminUserPasswordErr(t(`${"required"}`))
    } else if (ulbName !== "" && AdminUserPassword !== "") {
      if (!AdminUserPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
        error = true
        setAdminUserPasswordErr(`${t('ulbPassErr')}`)
      } else {
        error = false
        setAdminUserPasswordErr("")
      }
    }
    return error
  }
  // ** Custom close btn
  const changeUlbType = (e) => {
    setULBtype(e.target.value)
    checkValiditon()
  }
  const changeDisabledState = (e) => {
    setDisabledState(e.target.value)
    checkValiditon()
  }
  const changeState = (e) => {
    setStatus(e.target.value)
    checkValiditon()
  }
  const handlechange = (e) => {
    switch (e.target.name) {
      case "ulbName":
        setUlbName(e.target.value)
        checkValiditon()
        break
      case "ULBnameT":
        setULBnameT(e.target.value)
        break
      case "RequestNumberPrefix":
        const receiptNo = e.target.value.toUpperCase()
        setRequestNumberPrefix(receiptNo)
        checkValiditon()
        break
      case "AdminEmail":
        setAdminEmail(e.target.value)
        checkValiditon()
        break
      case "AdminUserName":
        setAdminUserName(e.target.value)
        break
      case "AdminUserPassword":
        setAdminUserPassword(e.target.value)
        break
      case "ulbCode":
        setUlbCode(e.target.value)
        checkValiditon()
        break
      default:
        break
    }
    checkValiditon()
  }
  const handleModalClose = () => {
    setEditModal(!EditModal)
    setAdminEmail("")
    setAdminUserName("")
    setAdminUserPassword("")
    setDisabledState("")
    setRequestNumberPrefix("")
    setStatus("")
    setULBnameT("")
    setULBtype("")
    setUlbName("")
    setUlbCode("")
    setPicture("")
    setUlbId("")
  }

  const hiddenFileInput = useRef(null)

  const handleClick = event => {
    console.log(event)
    hiddenFileInput.current.click()
  }
  const handleChangeFile = event => {
    const fileUploaded = event.target.files[0]
    setPicture(fileUploaded.name)

  }
  const handleRemovedImage = () => {
    setPicture("")
  }
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModalClose} />
  const handleSubmit = () => {
    const err = checkValiditon()
    if (!err) {
      const formdata = new FormData()
      formdata.append("id", ulbId)
      formdata.append("filename", picture === null ? "" : picture)
      formdata.append("userId", userId)
      formdata.append("name", ulbName)
      formdata.append("name_tn", ULBnameT)
      formdata.append("code", ulbCode)
      formdata.append("email", AdminEmail)
      formdata.append("username", AdminUserName)
      formdata.append("typeId", ulbType)
      formdata.append("password", AdminUserPassword)
      formdata.append("reqIdPrefix", RequestNumberPrefix)
      formdata.append("isDisableULB", status)
      formdata.append("statedashboardValue", disabledState)
      dispatch(EditULBDetails(formdata))
      handleModalClose()
    }

  }
  useEffect(() => {
    dispatch(getUlbHeader())
    const payload = {
      field: "all",
      query: searchValue,
      sortingName: sortName,
      sortingValue: sortValue,
      page: parPage,
      limit: rowsPerPage
    }
    dispatch(getULBdata(payload))
  }, [])
  const store = useSelector((state) => state)

  const columns = store.ulbManagement.ulbHeaderData
  const ULBstore = store.ulbManagement.ulbData && store.ulbManagement.ulbData.data ? store.ulbManagement.ulbData.data.data.ulbs : []
  const lengthUlb = store.ulbManagement.ulbData.data ? store.ulbManagement.ulbData.data.totalCount : 0
  const count = Math.ceil(lengthUlb / rowsPerPage)

  return (
    <div>
      <Fragment>
        <Breadcrumbs title={t(`${"ulbManagement"}`)} data={[{ title: 'ULBManagement' }, { title: t(`${"ulbManagement"}`) }]} />
      </Fragment>
      <Card>
        <CardHeader className='flex flex-column align-items-end border-bottom'>
          {/* <div className='d-flex justify-content-end mx-0 mt-md-0 mt-1'> */}
          <Row className="align-items-end">
            <Col className='d-flex align-items-center' sm='6'>
              <Label className='me-25' for='search-input'>
                {t('search')}
              </Label>
              <Input
                className='dataTable-filter mb-0'
                type='text'
                bsSize='md'
                placeholder={t('ulbName')}
                id='search-input'
                value={searchValue}
                onChange={handleFilter}
              />
            </Col>
            <Col className='d-flex align-items-center' sm='6' style={{marginRight:'-70px'}}>
              <Button className='ms-2' color='success' onClick={handleModal}>
                {/* <Plus size={15} /> */}
                <span className='align-middle ms-50'>{t(`${"addNewUlb1"}`)}</span>
              </Button>
            </Col>
          </Row>
        </CardHeader>

        <div className='react-dataTable'>
          <Table responsive>
            <thead>
              <tr>
                {columns.length !== 0 ? columns.map((item, index) => {

                  return <th key={index} scope='col' className='text-nowrap'
                  >
                    {item.header}
                    {item.accessor === "logo" || item.accessor === "actionButton" ? "" : <> {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}
                  </th>
                }) : []}
              </tr>

            </thead>
            <tbody>
              {!!ULBstore && ULBstore.length !== 0 ? ULBstore.map((val, i) => {
                return <tr key={i}>{
                  columns.map((accesser, h) => {
                    switch (accesser.accessor) {
                      case "logo":
                        return val["logo"] === null ? <td>_</td> : <td><a style={{ color: "#006400" }} href={`${val["logo"]}`}>{t('View')}</a></td>
                      case "updatedAt":
                        return val["updatedAt"] === null ? "_" : <td style={{width:'100px'}} key={h}>{moment(val["updatedAt"]).format("lll")}</td>
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
                                    handleDelete(val.ulbId)
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
                        return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null || val[accesser.accessor] === "null" ? "_" : val[accesser.accessor]}</td>
                    }
                  })
                }
                </tr>
              }) : []}
            </tbody>
          </Table>
          {/* <Row>
            <Col className="" sm={9}>
            </Col>
            <Col className="align-items-end" sm={3}> */}
               <div className="d-flex float-end">
              <div className='d-flex align-items-center'>
                <Label for='sort-select'>{t('Page')}</Label>
                <Input
                  className='dataTable-select'
                  type='select'
                  id='sort-select'
                  value={rowsPerPage}
                  style={{ width: "90px" }}
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
                  pageCount={Math.ceil(count) || 1}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  activeClassName='active'
                  forcePage={currentPage !== 0 ? currentPage - 1 : 0}
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
      <AddUlb open={modal} handleModal={handleModal} />


      {/* edit */}
      <Modal
        isOpen={EditModal}
        toggle={handleEdit}
        className='modal-dialog-centered modal-lg'
        backdrop="static"
      >
        <ModalHeader toggle={handleEdit} close={CloseBtn} tag='div' className='bg-transparent'>
        </ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <div className='text-center mb-2'>
            <h3 className='mb-1'>{t('editUlb')}</h3>
          </div>
          <Row className='gy-1 pt-75'>
            <Col md={6} xs={12}>
              <Label className='form-label' for='ULBname'>
                {t('ulbName')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input
                id='ULBname'
                placeholder={t('enterUlbName')}
                value={ulbName}
                name="ulbName"
                onChange={(e) => handlechange(e)}

              />
              <div style={{ color: "red" }}>{ulbNameErr}</div>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='ULBnameT'>
                {t("ulbNameTelugu")}
              </Label>
              <Input id='ULBnameT' placeholder={t('enterUlbName')}
                name='ULBnameT' value={ULBnameT}
                onChange={(e) => handlechange(e)}
              />
              {/* <div style={{ color: "red" }}>{}</div> */}

            </Col>

            <Col md={6} xs={12}>
              <Label className='form-label' for='ULBCode'>
                {t('ulbCode')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input
                name='ulbCode'
                value={ulbCode}
                id='ULB Code'
                placeholder={t('enterUlbCode')}
                onChange={(e) => handlechange(e)}
              />
              <div style={{ color: "red" }}>{ulbCodeErr}</div>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='RequestNumberPrefix'>
               {t('reqNoPre')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input maxLength={3} id='RequestNumberPrefix' placeholder={t('enterReqNoPre')} name='RequestNumberPrefix' value={RequestNumberPrefix} onChange={(e) => handlechange(e)}
              />
              <div style={{ color: "red" }}>{RequestNumberPrefixErr}</div>

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='AdminEmail'>
                {t('adminEmail')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input type='email' id='AdminEmail' placeholder={t('enterAdEmail')} name='AdminEmail' value={AdminEmail} onChange={(e) => handlechange(e)}
              />
              <div style={{ color: "red" }}>{AdminEmailErr}</div>

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='AdminUserName'>
                {t('adminUserName')}
              </Label>
              <Input id='AdminUserName' placeholder={t('enterAdUserName')} name='AdminUserName' value={AdminUserName} onChange={(e) => handlechange(e)}
              />
              <div style={{ color: "red" }}>{AdminUserNameErr}</div>


            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='AdminUserPassword'>
                {t('adminPass')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <InputPasswordToggle
                className='input-group-merge'
                name="AdminUserPassword"
                value={AdminUserPassword}
                onChange={(e) => handlechange(e)}

              />
              <div style={{ color: "red" }}>{AdminUserPasswordErr}</div>

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='type'>
                {t('type')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input value={ulbType} type='select' name='ulbType' id='ulbType' onChange={e => changeUlbType(e)}>
                <option value={""}>{t('select')}</option>
                {ULBTypeOptions.map((item) => {
                  return <option value={item.id}>{item.name}</option>

                })}

              </Input>
              <div style={{ color: "red" }}>{ulbTypeErr}</div>

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='Status'>
                {t('status')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input value={status} type='select' name='status' id='status' onChange={e => changeState(e)}>
                {/* <option value={null}>{"Select..."}</option> */}
                <option value={true}>{t('Inactive')}</option>
                <option value={false}>{t('active')}</option>

              </Input>
              <div style={{ color: "red" }}>{statusErr}</div>

            </Col>

            <Col md={6} xs={12}>
              <Label className='form-label' for='State'>
                {t('displayUserDash')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input value={disabledState} type='select' name='disabledState' id='disabledState' onChange={e => changeDisabledState(e)}>
                {/* <option value={null}>{"Select..."}</option> */}
                <option value={true}>{t('ulbDeleteErr3')}</option>
                <option value={false}>{t('ulbDeleteErr4')}</option>

              </Input>
              <div style={{ color: "red" }}>{disabledStateErr}</div>

            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='logo'>{t("logo")} </Label>
              <div>
                {picture === null ? "" : <span className='d-flex justify-content-end'> <X className='cursor-pointer text-primary' size={15} onClick={handleRemovedImage} /></span>}
                <Button onClick={handleClick} style={{ width: '100%' }}>
                  {t('upload')}
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
            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='submit' className='me-1' color='success' onClick={handleSubmit}>
                {t('saveChange')}
              </Button>
              <Button type='reset' color='secondary' outline onClick={handleModalClose}>
                {t('cancel')}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default (withTranslation()(ulbManagement))
