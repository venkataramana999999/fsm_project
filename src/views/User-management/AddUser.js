// ** React Imports
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { X } from 'react-feather'
// import { Controller } from 'react-hook-form'
import InputPasswordToggle from '@components/input-password-toggle'
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row, Col, FormFeedback } from 'reactstrap'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { getRoleListAdmin, addUserDetails } from '../../redux/UserRedx'
import { getULBdata } from '../../redux/ulbManagement'
import { withTranslation } from 'react-i18next'

const AddUser = ({ open, handleModal, t }) => {
  const [roleName, setRoleName] = useState("")
  const [roleNameErr, setRoleNameErr] = useState("")
  const [ulbName, setulbName] = useState("")
  const [ulbNameErr, setUlbNameErr] = useState("")
  const [username, setUserName] = useState("")
  const [usernameErr, setUserNameErr] = useState("")
  const [useremail, setUseremail] = useState("")
  const [useremailErr, setUseremailErr] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />
  const dispatch = useDispatch()
  const Checkvalidition = (dataCheck) => {
    let error = false
    if (username === "" && dataCheck === "handleSubmit") {
      error = true
      setUserNameErr(`${t('required')}`)
    } else {
      error = false
      setUserNameErr("")
    }
    if (useremail === "" && dataCheck === "handleSubmit") {
      error = false
      setUseremailErr(`${t('required')}`)
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
      error = true
      setUseremailErr("")
    }
    if (roleName === "" && dataCheck === "handleSubmit") {
      error = false
      setRoleNameErr(`${t('required')}`)
    } else {
      error = true
      setRoleNameErr("")
    }
    if (ulbName === "" && dataCheck === "handleSubmit") {
      error = false
      setUlbNameErr(`${t('required')}`)
    } else {
      error = true
      setUlbNameErr("")
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
    Checkvalidition("handleChange")
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const err = Checkvalidition("handleSubmit")
    if (err) {
      const payload = {
        id: "",
        userName: username,
        email: useremail,
        roleId: roleName,
        ulbId: ulbName,
        password: userPassword
      }
      dispatch(addUserDetails(payload))
      handleModal()
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

  }
  const handleClose = () => {
    handleModal()
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
  useEffect(() => {
    dispatch(getRoleListAdmin())
    dispatch(getULBdata({}))
  }, [])
  const store = useSelector((state) => state)
  const roleAdmin = store.UserRedx.RoleListAdmin.data === undefined ? [] : store.UserRedx.RoleListAdmin.data[0] 
  const UlbListingUser = store.ulbManagement.ulbData && store.ulbManagement.ulbData.data ? store.ulbManagement.ulbData.data.data.ulbs : []
  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='modal-dialog-centered modal-lg'
      backdrop="static"
    >
      <ModalHeader toggle={handleModal} close={CloseBtn} tag='div' className='bg-transparent'>
      </ModalHeader>
      <ModalBody className='px-sm-5 mx-50 pb-5 text-success'>
        <div className='text-center mb-2'>
          <h3 className='mb-1'>{t("addNewUser")}</h3>
        </div>

        <Row tag='form' className='gy-1 pt-75'>
          <Col md={6} xs={12}>
            <Label className='form-label' for='username'>
            {t('userName')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input
              id='username'
              name='username'
              placeholder={t('enterUser')}
              value={username}
              type="text"
              onChange={(e) => handleChange(e)}
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
              // type="password"
              onChange={(e) => handleChange(e)}

            />
          </Col>

          <Col md={6} xs={12}>
            <Label className='form-label required' for='roleName'>
              {t('role')} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input type='select' name='roleName' id='roleName' value={roleName} onChange={e => changeRoleName(e)} required>
              <option value={""}>{t('select')}</option>
              {/* {roleAdmin === undefined ? [] : roleAdmin.map((val) => {
                return <option value={val.roleId}>{val.name}</option>
              })} */}
                <option value={roleAdmin.roleId}>{roleAdmin.name}</option>
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
            <Button type='reset' className='me-1' color='secondary' outline onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button color='success' onClick={handleSubmit}>
              {t('save')}
            </Button>

          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default (withTranslation()(AddUser))
