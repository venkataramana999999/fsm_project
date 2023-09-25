import {
  Modal, ModalBody, ModalHeader, Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button, Row, Col, Label, Input, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroupText, InputGroup
} from "reactstrap"
import InputPasswordToggle from '@components/input-password-toggle'
import { getUserHeader, getUserdata, userDelete, getRoleListAdmin, EditUserDetails } from "../../redux/UserRedx"
import { getULBdata } from '../../redux/ulbManagement'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
// import { Link } from "react-router-dom"
import { MoreVertical, Edit, FileText, Archive, Trash, X, ChevronDown, ChevronUp, Plus, Search } from 'react-feather'
import Breadcrumbs from '@components/breadcrumbs'
import AddUser from "./AddUser"
import RoleListing from "./RoleListing"
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import moment from "moment"
import Swal from "sweetalert2"
import { withTranslation } from 'react-i18next'

const userListing = ({t}) => {
  const dispatch = useDispatch()
  // const { t } = useTranslation()
  // ** States
  const [modal, setModal] = useState(false)
  const [EditModal, setEditModal] = useState(false)
  const [modalRole, setModalRole] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [parPage, setParPage] = useState(1)
  const [searchSelect, setSearchSelect] = useState("selected")
  const [searchValue, setSearchValue] = useState('')
  const [sortName, setSortName] = useState('')
  const [sortValue, setSortValue] = useState('desc')
  const [currentSortId, setCurrentSortId] = useState('')
  const [roleName, setRoleName] = useState("")
  const [roleNameErr, setRoleNameErr] = useState("")
  const [ulbName, setulbName] = useState("")
  const [ulbNameErr, setUlbNameErr] = useState("")
  const [username, setUserName] = useState("")
  const [usernameErr, setUserNameErr] = useState("")
  const [useremail, setUseremail] = useState("")
  const [useremailErr, setUseremailErr] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [userId, setUserId] = useState("")
  // ** Function to handle Modal toggle
  const handlemodal = () => setModal(!modal)
  const handleModalRole = () => setModalRole(!modalRole)
  const Checkvalidition = () => {
    let error = false
    if (username !== "") {
      error = false
      setUserNameErr("")
    } else {
      error = true
      setUserNameErr(`${t('required')}`)
    }

    if (useremail !== "") {
      error = true
      setUseremailErr("")
    } else if (useremail) {
      const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!useremail.match(mailformat)) {
        error = false
        setUseremailErr(`${t('phoperEmail')}`)
      } else {
        error = true
        setUseremailErr("")
      }
    } else {
      error = false
      setUseremailErr(`${t('required')}`)
    }

    if (roleName !== "") {
      error = true
      setRoleNameErr("")
    } else {
      error = false
      setRoleNameErr(`${t('required')}`)
    }

    if (ulbName !== "") {
      error = true
      setUlbNameErr("")
    } else {
      error = false
      setUlbNameErr(`${t('required')}`)
    }
    return error
  }
  const changeRoleName = (e) => {
    setRoleName(e.target.value)
  }
  const changeULBName = (e) => {
    setulbName(e.target.value)
  }
  const handleChange = (e) => {
    Checkvalidition()
    switch (e.target.name) {
      case "username":
        setUserName(e.target.value)
        break
      case "useremail":
        setUseremail(e.target.value)
        break
      case "userPassword":
        setUserPassword(e.target.value)
        break

      default:
        break
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const err = Checkvalidition()
    if (err) {
      const payload = {
        id: userId,
        userName: username,
        email: useremail,
        roleId: roleName,
        ulbId: ulbName,
        password: userPassword,
        page: parPage,
        limit: rowsPerPage,
        selectedField: searchSelect
      }
      dispatch(EditUserDetails(payload))
      setRoleName("")
      setUserName("")
      setUserPassword("")
      setulbName("")
      setUseremail('')
      setEditModal(false)
    }

  }
  const handleClose = () => {
    setEditModal(false)
    setRoleName("")
    setUserName("")
    setUserPassword("")
    setulbName("")
    setUseremail('')
    setRoleNameErr("")
    setUserNameErr()
    setUlbNameErr("")
    setUseremailErr("")

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
      limit: rowsPerPage,
      selectedField: searchSelect
    }
    dispatch(getUserdata(payload))
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
    dispatch(getUserdata(payload))
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
    dispatch(getUserdata(payload))
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
      limit: rowsPerPage,
      selectedField: searchSelect
    }
    dispatch(getUserdata(payload))
  }
  const handleSearchSelect = (e) => {
    setSearchSelect(e.target.value)

  }
  const handleEdit = (data) => {
    setEditModal(!EditModal)
    setRoleName(data.roleId)
    setUserName(data.userName)
    setUserPassword("")
    setulbName(data.ULBId)
    setUseremail(data.email)
    setUserId(data.userId)
  }
  const handleDelete = (userId) => {
    const payload = {
      id: userId
    }
    dispatch(userDelete(payload))
  }
  useEffect(() => {
    dispatch(getUserHeader())
    const payload = {
      field: "all",
      query: searchValue,
      sortingName: sortName,
      sortingValue: sortValue,
      page: parPage,
      limit: rowsPerPage,
      selectedField: searchSelect
    }
    dispatch(getRoleListAdmin())
    dispatch(getUserdata(payload))
    dispatch(getULBdata({}))

  }, [])
  const store = useSelector((state) => state)
  const columns = store.UserRedx ? store.UserRedx.userHeaderData : []
  const ULBstore = store.UserRedx.userData && store.UserRedx.userData.data ? store.UserRedx.userData.data.data.users : []
  const lengthUlb = store.UserRedx.userData.data ? store.UserRedx.userData.data.totalCount : 0
  const count = Math.ceil(lengthUlb / rowsPerPage)
  const UlbListingUser = store.ulbManagement.ulbData && store.ulbManagement.ulbData.data ? store.ulbManagement.ulbData.data.data.ulbs : []
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleEdit} />
  const roleAdmin = store.UserRedx.RoleListAdmin.data === undefined ? [] : store.UserRedx.RoleListAdmin.data[0]
  return (
    <div>
      <Fragment>
        <Breadcrumbs title={t('userManagement')} data={[{ title: 'UserManagement' }, { title: `${t('userManagement')}` }]} />
      </Fragment>

      <Card>
        <CardHeader className='flex flex-column align-items-end border-bottom'>
          <Row className="align-items-end">
            <Col className='d-flex align-items-center' sm='6'>
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
                  <option value={"roleSelected"}>{t('role')}</option>
                  <option value={"UserSelected"}>{t('User')}</option>

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
                  placeholder={searchSelect === "selected" ? `${t('searchby')}` : searchSelect === "roleSelected" ? `${t('SearchbyRole')}` : searchSelect === "UserSelected" ? `${t('SearchbyUser')}` : ""}
                  id='search-input'
                  disabled={searchSelect === "selected"}
                  value={searchValue}
                  onChange={handleFilter}
                />
              </InputGroup>
            </Col>
            <Col className='d-flex align-items-center' sm='6'  style={{marginRight:'-70px'}}>
              <Button className='ms-2' color='success' onClick={handlemodal}>
                {/* <Plus size={15} /> */}
                <span className='align-middle'>{t('addNewUser')}</span>
              </Button>
              <Button className='ms-2' color='success' onClick={handleModalRole}>
                <span className='align-middle ms-50'>{t('role')}</span>
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
                    {item.header === "Action" ? "" : <> {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}

                  </th>
                }) : []}
              </tr>

            </thead>
            <tbody>
              {!!ULBstore && ULBstore.length !== 0 ? ULBstore.map((val, i) => {
                return <tr key={i}>{
                  columns.map((accesser, h) => {
                    switch (accesser.accessor) {
                      case "updatedAt":
                        return val["updatedAt"] === null ? "_" : <td key={h}>{moment(val["updatedAt"]).format("lll")}</td>
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
                                    handleDelete(val.userId)
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
          <div className="d-flex float-end">
              <div className='d-flex align-items-center'>
                <Label for='sort-select'>{t('Page')}</Label>
                <Input
                  className='dataTable-select'
                  type='select'
                  style={{ width: "90px" }}
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
      <AddUser open={modal} handleModal={handlemodal} />
      <RoleListing open={modalRole} handleModal={handleModalRole} />

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
            <h3 className='mb-1'>{t('editUser')}</h3>
          </div>

          <Row tag='form' className='gy-1 pt-75'>
            <Col md={6} xs={12}>
              <Label className='form-label' for='username'>
                {t('userName')} 
              </Label>
              <Input
                id='username'
                name='username'
                placeholder={t('enterUser')}
                value={username}
                onChange={(e) => handleChange(e)}
                required
              />
              <div style={{ color: "red" }}>{usernameErr}</div>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label' for='userEmail'>
                {t('email')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input
                id='useremail'
                name='useremail'
                placeholder={t('EnteruserEmail')}
                value={useremail}
                type="email"
                onChange={(e) => handleChange(e)}
              />
              <div style={{ color: "red" }}>{useremailErr}</div>
            </Col>
            <Col md={6} xs={12}>
              <Label className='form-label required' for='UserPassword'>
               {t('userPass')}
              </Label>
              <InputPasswordToggle
                className='input-group-merge'
                name="userPassword"
                value={userPassword}
                onChange={(e) => handleChange(e)}

              />
            </Col>

            <Col md={6} xs={12}>
              <Label className='form-label required' for='roleName'>
                {t('role')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input type='select' name='roleName' id='roleName' value={roleName} onChange={e => changeRoleName(e)} required>
                <option value={""}>{"Select..."}</option>
                {/* {roleAdmin === undefined ? [] : roleAdmin.map((val) => { */}
                   <option value={roleAdmin.roleId}>{roleAdmin.name}</option>
                {/* })} */}

              </Input>
              <div style={{ color: "red" }}>{roleNameErr}</div>
            </Col>

            <Col md={6} xs={12}>
              <Label className='form-label' for='ulbName'>
                ULB <span style={{ color: "red", fontSize:'15px'}}>*</span>
              </Label>
              <Input type='select' name='ulbName' id='ulbName' value={ulbName} onChange={e => changeULBName(e)} required>
                <option value={""}>{t('select')}</option>
                {UlbListingUser === undefined ? [] : UlbListingUser.map((val) => {
                  return <option value={val.ulbId}>{val.name}</option>
                })}

              </Input>
              <div style={{ color: "red" }}>{ulbNameErr}</div>
            </Col>


            <Col xs={12} className='text-center mt-2 pt-50'>
              <Button type='reset' color='secondary' className='me-1' outline onClick={handleClose}>
                {t('cancel')}
              </Button>
              <Button type='submit' color='primary' onClick={handleSubmit}>
               {t("saveChange")}
              </Button>

            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default (withTranslation()(userListing))
