// ** React Imports
import { useState, useRef } from 'react'
import { LogIn, X } from 'react-feather'
// import { useForm, Controller } from 'react-hook-form'
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row, Col, FormFeedback } from 'reactstrap'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import InputPasswordToggle from '@components/input-password-toggle'
import { addULBDetails } from '../../redux/ulbManagement'
import { withTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
// import { dispatch } from 'react-hot-toast/dist/core/store'
const AddULB = ({ open, handleModal, t }) => {
  // ** State
  const [ulbType, setULBtype] = useState("")
  const [disabledState, setDisabledState] = useState("")
  const [status, setStatus] = useState("")
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
  // const [imgData, setImgData] = useState(null)
  const dispatch = useDispatch()
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
  const checkValiditon = (checkData) => {
    let error = false
    let errorUlb = false
    let errorUlbCode = false
    let errorAdminUserName = false
    let errorAdminEmail = false
    let errorUlbType = false
    let errorDisabledState = false
    let errorRequestNumberPrefix = false
    let errorStatus = false
    let errorAdminUserPassword = false
    if (ulbName === "" && checkData === "handleSubmit") {
      errorUlb = true
      setUlbNameErr(t(`${"required"}`))
    } else if ((ulbName.length > 0 && ulbName.length < 3) || (ulbName.length > 100)) {
      errorUlb = true
      setUlbNameErr(`${t('ulbnameErr')}`)
    } else if (ulbName && ulbName.length >= 3) {
      errorUlb = false
      setUlbNameErr("")
    } else {
      errorUlb = false
      setUlbNameErr("")
    }

    if (ulbCode === "" && checkData === "handleSubmit") {
      errorUlbCode = true
      setUlbCodeErr(t(`${"required"}`))
    } else if ((ulbCode.length > 0 && ulbCode.length < 3) || (ulbCode.length > 6)) {
      errorUlbCode = true
      setUlbCodeErr(`${t('ulbCodeErr')}`)
    } else {
      errorUlbCode = false
      setUlbCodeErr("")
    }
    if (AdminUserName === "" && checkData === "handleSubmit") {
      errorAdminUserName = true
      setAdminUserNameErr(t(`${"required"}`))
    } else if ((AdminUserName.length > 0 && AdminUserName.length < 2) || (AdminUserName.length > 100)) {
      errorAdminUserName = true
      setAdminUserNameErr(`${t('ulbAdminErr')}`)
    } else if (AdminUserName && AdminUserName.length >= 3) {
      errorAdminUserName = false
      setAdminUserNameErr("")
    } else {
      errorAdminUserName = false
      setAdminUserNameErr("")
    }

    if (AdminEmail !== "") {
      const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!AdminEmail.match(mailformat)) {
        errorAdminEmail = true
        setAdminEmailErr(`${t('ulbEmailErr')}`)
      } else {
        errorAdminEmail = false
        setAdminEmailErr("")
      }
    } else if (AdminEmail === "" && checkData === "handleSubmit") {
      errorAdminEmail = true
      setAdminEmailErr(t(`${"required"}`))
    }
    if (ulbType === "" && checkData === "handleSubmit") {
      errorUlbType = true
      setTypeErr(t(`${"required"}`))
    } else {
      errorUlbType = false
      setTypeErr("")
    }

    if (disabledState === "" && checkData === "handleSubmit") {
      errorDisabledState = true
      setDisabledStateErr(t(`${"required"}`))
    } else {
      errorDisabledState = false
      setDisabledStateErr("")
    }
    if (status === "" && checkData === "handleSubmit") {
      errorStatus = true
      setStatusErr(t(`${"required"}`))
    } else {
      errorStatus = false
      setStatusErr("")
    }
    if (RequestNumberPrefix === "" && checkData === "handleSubmit") {
      errorRequestNumberPrefix = true
      setRequestNumberPrefixErr(t(`${"required"}`))
    } else {
      errorRequestNumberPrefix = false
      setRequestNumberPrefixErr("")
    }
    if (ulbName !== "" && AdminUserPassword === "" && checkData === "handleSubmit") {
      errorAdminUserPassword = true
      setAdminUserPasswordErr(t(`${"required"}`))
    } else if (ulbName !== "" && AdminUserPassword !== "") {
      if (!AdminUserPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
        errorAdminUserPassword = true
        setAdminUserPasswordErr(`${t('ulbPassErr')}`)
      } else {
        errorAdminUserPassword = false
        setAdminUserPasswordErr("")
      }
    }
    if (!errorUlb && !errorUlbCode && !errorAdminUserName && !errorAdminEmail && !errorUlbType && !errorDisabledState && !errorRequestNumberPrefix && !errorStatus && !errorAdminUserPassword) {
      error = false
    } else {
      error = true
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
        break
      case "ULBnameT":
        setULBnameT(e.target.value)
        break
      case "RequestNumberPrefix":
        const receiptNo = e.target.value.toUpperCase()
        setRequestNumberPrefix(receiptNo)
        break
      case "AdminEmail":
        setAdminEmail(e.target.value)
        break
      case "AdminUserName":
        setAdminUserName(e.target.value)
        break
      case "AdminUserPassword":
        setAdminUserPassword(e.target.value)
        break
      case "ulbCode":
        setUlbCode(e.target.value)
      default:
        break
    }
    checkValiditon("handleChange")
  }

  const handleSubmit = () => {
    const err = checkValiditon("handleSubmit")
    if (!err) {
      const formdata = new FormData()
      formdata.append("filename", picture)
      formdata.append("userId", "")
      formdata.append("name", ulbName)
      formdata.append("name_tn", ULBnameT)
      formdata.append("code", ulbCode)
      formdata.append("email", AdminEmail)
      formdata.append("username", AdminUserName)
      formdata.append("typeId", ulbType)
      formdata.append("password", AdminUserPassword)
      formdata.append("ReqIdPrefix", RequestNumberPrefix)
      formdata.append("isDisableULB", status)
      formdata.append("statedashboardValue", disabledState)
      dispatch(addULBDetails(formdata))
      handleModal()
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
      setUlbNameErr("")
      setUlbCodeErr("")
      setAdminUserNameErr("")
      setTypeErr("")
      setAdminEmailErr("")
      setStatusErr("")
      setDisabledStateErr("")
      setRequestNumberPrefixErr("")
      setAdminUserPasswordErr("")
    }

  }
  const handleModalClose = () => {
    handleModal()
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
    setUlbNameErr("")
    setUlbCodeErr("")
    setAdminUserNameErr("")
    setTypeErr("")
    setAdminEmailErr("")
    setStatusErr("")
    setDisabledStateErr("")
    setRequestNumberPrefixErr("")
    setAdminUserPasswordErr("")
  }

  //  const handleOpenDia = () => {

  //  }
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
  return (
    <Modal
      isOpen={open}
      toggle={handleModalClose}
      className='modal-dialog-centered modal-lg'
      backdrop="static"
    >
      <ModalHeader toggle={handleModalClose} close={CloseBtn} tag='div' className='bg-transparent'>
        {/* <h5 className='modal-title'>Add New ULB</h5> */}
      </ModalHeader>
      <ModalBody className='px-sm-5 mx-50 pb-5'>
        <div className='text-center mb-2'>
          <h3 className='mb-1'>{t(`${"addNewUlb2"}`)}</h3>
        </div>
        <Row className='gy-1 pt-75'>
          <Col md={6} xs={12}>
            <Label className='form-label' for='ULBname'>
              {t(`${"ulbName"}`)} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input
              id='ULBname'
              placeholder={t(`${"enterUlbName"}`)}
              value={ulbName}
              name="ulbName"
              onChange={(e) => handlechange(e)}

            />
            <div style={{ color: "red" }}>{ulbNameErr}</div>
          </Col>
          <Col md={6} xs={12}>
            <Label className='form-label' for='ULBnameT'>
              {t(`${"ulbNameTelugu"}`)}
            </Label>
            <Input id='ULBnameT' placeholder={t(`${"enterUlbName"}`)}
              name='ULBnameT' value={ULBnameT}
              onChange={(e) => handlechange(e)}
            />
          </Col>

          <Col md={6} xs={12}>
            <Label className='form-label' for='ULBCode'>
              {t(`${"ulbCode"}`)} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input
              name='ulbCode'
              value={ulbCode}
              id='ULB Code'
              placeholder={t(`${"enterUlbCode"}`)}
              onChange={(e) => handlechange(e)}
            />
            <div style={{ color: "red" }}>{ulbCodeErr}</div>
          </Col>
          <Col md={6} xs={12}>
            <Label className='form-label' for='RequestNumberPrefix'>
              {t(`${"reqNoPre"}`)} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input maxLength={3} id='RequestNumberPrefix'
              placeholder={t(`${"enterReqNoPre"}`)}
              name='RequestNumberPrefix'
              value={RequestNumberPrefix}
              onChange={(e) => handlechange(e)}
            />
            <div style={{ color: "red" }}>{RequestNumberPrefixErr}</div>

          </Col>
          <Col md={6} xs={12}>
            <Label className='form-label' for='AdminEmail'>
              {t(`${"adminEmail"}`)} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input type='email' id='AdminEmail'
              placeholder={t(`${"enterAdEmail"}`)} name='AdminEmail' value={AdminEmail} onChange={(e) => handlechange(e)}
            />
            <div style={{ color: "red" }}>{AdminEmailErr}</div>

          </Col>
          <Col md={6} xs={12}>
            <Label className='form-label' for='AdminUserName'>
              {t(`${"adminUserName"}`)}
            </Label>
            <Input type='text' id='AdminUserName' placeholder={t(`${"enterAdUserName"}`)} name='AdminUserName' value={AdminUserName} onChange={(e) => handlechange(e)}
            />
            <div style={{ color: "red" }}>{AdminUserNameErr}</div>


          </Col>
          <Col md={6} xs={12}>
            <Label className='form-label' for='AdminUserPassword'>
              {t(`${"adminPass"}`)}
            </Label>
            <InputPasswordToggle
              className='input-group-merge'
              name="AdminUserPassword"
              // type="password"
              value={AdminUserPassword}
              onChange={(e) => handlechange(e)}
              placeholder={t(`${"enterPass"}`)}
            />
            <div style={{ color: "red" }}>{AdminUserPasswordErr}</div>

          </Col>
          <Col md={6} xs={12}>
            <Label className='form-label' for='type'>
              {t(`${"type"}`)} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input type='select' name='ulbType' id='ulbType' onChange={e => changeUlbType(e)}>
              <option value={""}>{t('select')}</option>
              {ULBTypeOptions.map((item) => {
                return <option value={item.id}>{item.name}</option>

              })}

            </Input>
            <div style={{ color: "red" }}>{ulbTypeErr}</div>

          </Col>
          <Col md={6} xs={12}>
            <Label className='form-label' for='Status'>
              {t(`${"status"}`)} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input type='select' name='status' id='status' onChange={e => changeState(e)}>
              <option value={""}>{t('select')}</option>
              <option value={true}>{t('Inactive')}</option>
              <option value={false}>{t('active')}</option>

            </Input>
            <div style={{ color: "red" }}>{statusErr}</div>

          </Col>

          <Col md={6} xs={12}>
            <Label className='form-label' for='State'>
              {t(`${"displayUserDash"}`)} <span style={{ color: "red", fontSize:'15px'}}>*</span>
            </Label>
            <Input type='select' name='disabledState' id='disabledState' onChange={e => changeDisabledState(e)}>
              <option value={""}>{t('select')}</option>
              <option value={true}>{t('ulbDeleteErr3')}</option>
              <option value={false}>{t('ulbDeleteErr4')}</option>

            </Input>
            <div style={{ color: "red" }}>{disabledStateErr}</div>

          </Col>
          <Col md={6} xs={12}>
            <Label className='form-label' for='logo'>{t(`${"logo"}`)} </Label>
            <div>
              {picture === "" ? "" : <span className='d-flex justify-content-end'> <X className='cursor-pointer text-primary' size={15} onClick={handleRemovedImage} /></span>}
              <Button onClick={handleClick} style={{ width: '100%' }}>
                {t(`${"upload"}`)}
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
            <Button className='me-1' color='secondary' outline onClick={handleModalClose}>
              {t(`${"cancel"}`)}
            </Button>
            <Button type='submit' color='success' onClick={handleSubmit}>
              {t(`${"save"}`)}
            </Button>

          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default (withTranslation()(AddULB))
