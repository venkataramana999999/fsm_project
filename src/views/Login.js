// import { useSkin } from "@hooks/useSkin"
import { Link, useNavigate } from "react-router-dom"
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee, X, PhoneOutgoing } from 'react-feather'
import InputPasswordToggle from "@components/input-password-toggle"
import { useForm, Controller } from 'react-hook-form'
import { handleLogin } from "../redux/auth"
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRTL } from '@hooks/useRTL'
import '@styles/react/libs/swiper/swiper.scss'
import './login.css'

import SwiperCore, {
  Grid,
  Lazy,
  Virtual,
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCube,
  EffectCoverflow
} from 'swiper'

import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  Alert,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  Nav, NavItem, NavLink, CardFooter,
  InputGroup, InputGroupText,
  Spinner
} from "reactstrap"
// ** Third Party Components
// import Cleave from 'cleave.js/react'
import "@styles/react/pages/page-authentication.scss"
import axios from '../lib/ApiCall'
import { getHomeRouteForLoggedInUser } from '@utils'
import { withTranslation } from 'react-i18next'

// import img1 from "@src/assets/images/pages/image1.png"
// import img2 from "@src/assets/images/pages/image2.jpg"
// import img3 from "@src/assets/images/pages/image3.jpg"
import img4 from "@src/assets/images/pages/sanitation_chain_-_blog_laura_png.png"
import i18next from "i18next"
import fmsLogo from "@src/assets/images/logo/logo.jpeg"
import cp1 from "@src/assets/images/pages/Logo_develoPPP_claim_RGB.png"
import cp2 from "@src/assets/images/pages/GIZ-Combined-logo-scaled.jpg"
import cp3 from  "@src/assets/images/pages/transerve.png"
import emp from "@src/assets/images/pages/employee_new.png"
import citizen_logo from "@src/assets/images/pages/citizen_new.png"

const params = {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  pagination: {
    clickable: true
  },
  navigation: true
}
SwiperCore.use([Navigation, Grid, Pagination, EffectFade, EffectCube, EffectCoverflow, Autoplay, Lazy, Virtual])

const Login = (props) => {
  // const location = useLocation()

  // const { skin } = useSkin() 
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formModal, setFormModal] = useState(false)
  const [citizenModal, setCitizenModal] = useState(false)
  const [phoneDetails, setPhoneDetails] = useState([])
  const [SuccessMsg, setSuccessMsg] = useState("")
  const [FaileddMsg, setFaileddMsg] = useState("")
  const [GenerateOtpV, setGenerateOtpV] = useState(false)
  const [langSelect, setLangSelect] = useState("lang")
  const [PhoneNumberEnter, setPhoneNumberEnter] = useState("")
  const [PhoneNumberEnterErr, setPhoneNumberEnterErr] = useState("")
  const [Error, SetError] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [otp1, setotp1] = useState("")
  const [otp2, setotp2] = useState("")
  const [otp3, setotp3] = useState("")
  const [otp4, setotp4] = useState("")
  // const [otp5, setotp5] = useState("")
  // const [otp6, setotp6] = useState("")

  const [isRtl] = useRTL()
  // const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg"
  //  const source = require(`@src/assets/images/pages/${illustration}`).default

  const defaultValues = {
    email: "",
    password: ""
  }
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = (data) => {
    if (Object.values(data).every(field => field.length > 0)) {
      axios.post('auth/login', { email: data.email, password: data.password })
        .then(res => {
          console.log(res)
          const data = { ...res.data.data }
          console.log(data)
          localStorage.setItem("role", data.roleName)
          dispatch(handleLogin(data))
          navigate(getHomeRouteForLoggedInUser(data.roleName))
        })
        .catch(err => {
          SetError(err.response.data.success)
          setErrorMsg(err.response.data.error[0].message)
        })
    } else {
      console.log("err")
    }
  }
  const handleLanguageChange = (e) => {
    setLangSelect(e.target.value)
    if (e.target.value === "hin" || e.target.value === "te" || e.target.value === "en") {
      i18next.changeLanguage(e.target.value)
    }
  }
  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 1
      if (next > -1) {

        elmnt.target.form.elements[next].focus()
      }
    } else {
      const next = elmnt.target.tabIndex
      if (next < 4) {
        elmnt.target.form.elements[next].focus()
      }
    }

  }
  const { t } = props
  const checkValiditon = () => {
    let err = false
    if (PhoneNumberEnter === "") {
      err = true
      setPhoneNumberEnterErr("This is required.")
    } else if (PhoneNumberEnter !== "") {
        if (PhoneNumberEnter.length === 10) {
          err = false
          setPhoneNumberEnterErr(" ")
        } else {
           err = true
           setPhoneNumberEnterErr("Enter a Valid Number")
        }
    } else {
      err = false
      setPhoneNumberEnterErr("")
    }

    return err
  }
  const handleGenrateOtp = () => {
    const error = checkValiditon()
    if (!error) {
    const payload = {
      PhoneNumber: 91 + PhoneNumberEnter
    }
    axios.post('auth/citizenLogin', payload).then((res) => {
      setPhoneDetails(res.data.data)
      setGenerateOtpV(true)
      setSuccessMsg("Successfully Sent OTP.")
    }).catch(err => console.log(err))
  } else {
    setPhoneNumberEnterErr("This is required.")
  }
  }
  const handleChange = (e) => {
    setPhoneNumberEnter(e.target.value)
    checkValiditon()
  }

  const handleCitizenLogin = () => {
    const payload = {
      PhoneNumber: phoneDetails[0].PhoneNumber,
      CitizenOtp: JSON.parse(otp1 + otp2 + otp3 + otp4)
    }
    axios.put('auth/verifyopt', { PhoneNumber: payload.PhoneNumber, CitizenOtp: payload.CitizenOtp })
      .then(res => {
        const fetchSucuess = res.data.success
        if (fetchSucuess === true) {
          localStorage.setItem('citizen', fetchSucuess)
          localStorage.setItem('PhoneNumber', res.data.data[0].PhoneNumber)
          localStorage.setItem('UlbOption', fetchSucuess)
          // window.location.href = '/citizen'
          navigate("/citizen")
        } else {
          setFaileddMsg("Enter a valid OTP!!")
        }
      })
      .catch(err => {
        setFaileddMsg(err.response.data.error[0].message)
      }
      )
  }
//const reload = () => window.location.reload()

  const handleClose = () => {
    setCitizenModal(!citizenModal)
    //reload()
  } 
  return (
    <div >
      <Row>
        <Card className="header-fixed">
          <CardHeader className="mx-5 py-1">
            <Link className='brand-logo d-flex' to='/' onClick={e => e.preventDefault()}>
              <img src={fmsLogo} alt="Logo" style={props.i18n.language === "te" ? { width: "13%" } : { width: "10%" }} />
              <h4 className='brand-text fw-bolder mx-1 my-auto' style={{ color: "#3b6796", textTransform: "uppercase" }}>{t("title")}</h4>
            </Link>
            <Nav className='justify-content-end'>
              <NavItem>
              </NavItem>
              <NavItem>
                {/* <NavLink href='#'></NavLink> */}
              </NavItem>
              <NavItem>
                {/* <NavLink href='#'>Link</NavLink> */}
              </NavItem>
              <NavItem>
                <NavLink active>
                  <Input value={langSelect} name="langSelect" type="select" onChange={handleLanguageChange}>
                    <option value={"lang"}>Language</option>
                    <option value={"en"}>English</option>
                    {/* <option value={"hin"}>Hindi</option> */}
                    <option value={"te"}>Telugu</option>
                  </Input>
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
        </Card>
        <Col className='d-flex align-items-center px-1' lg='5' sm='12' md="12">
          <div className='w-100 container swpier-text mt-3 mx-2'>
            <Swiper dir={isRtl ? 'rtl' : 'ltr'} {...params}>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Digital Transformation for FSM</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>Digital platform for smart faecal sludge management system providing end-to-end monitoring</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Citizen-centric Service Delivery</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>Smart digital platform for citizens to ensure ease of access to service providers and to log desludging requests</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}>Manage Daily Desludging Operations</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>A simple mobile interface for truck operators to manage daily desludging workloads and access requests</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Assess FSM Operations</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>A centralised interface for municipal bodies to manage and monitor citizen requests, desludging operations and treatment facilities</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}>Data Analytics and Dashboard</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>An interactive dashboard for the decision makers to visualize the performance of FSSM processes in the ULBs</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Digital Transformation for FSM</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>Digital platform for smart faecal sludge management system providing end-to-end monitoring</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Citizen-centric Service Delivery</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>Smart digital platform for citizens to ensure ease of access to service providers and to log desludging requests</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}>Manage Daily Desludging Operations</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>A simple mobile interface for truck operators to manage daily desludging workloads and access requests</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Assess FSM Operations</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>A centralised interface for municipal bodies to manage and monitor citizen requests, desludging operations and treatment facilities</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}>Data Analytics and Dashboard</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>An interactive dashboard for the decision makers to visualize the performance of FSSM processes in the ULBs</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Digital Transformation for FSM</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>Digital platform for smart faecal sludge management system providing end-to-end monitoring</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Citizen-centric Service Delivery</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>Smart digital platform for citizens to ensure ease of access to service providers and to log desludging requests</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}>Manage Daily Desludging Operations</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>A simple mobile interface for truck operators to manage daily desludging workloads and access requests</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}> Assess FSM Operations</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>A centralised interface for municipal bodies to manage and monitor citizen requests, desludging operations and treatment facilities</p>
              </SwiperSlide>
              <SwiperSlide>
                <h4 className='w-70 brand-text ms-1' style={{ margin: "20% 0 0 0", fontSize: "25px", fontWeight: "700", color: "#3b6796" }}>Data Analytics and Dashboard</h4>
                <p className='w-70  ms-1 fw-bolder' style={{ marginTop: '20px' }}>An interactive dashboard for the decision makers to visualize the performance of FSSM processes in the ULBs</p>
              </SwiperSlide>
            </Swiper>
            <div className="d-flex mx-5">
              <div className="d-flex flex-column align-items-center px-1" style={{ cursor: "pointer" }} onClick={() => setFormModal(!formModal)} >
                <img src={emp} alt={"employee"} width={60} />
                <h5 className="fw-bolder mt-1 px-1 text-citizen text-center" style={{ color: "#3b6796", borderRadius: "25px", border: "2px solid #3b6796" }}>{t("employee")}</h5>
              </div>
              <div className="mx-1" style={{ cursor: "pointer" }} onClick={() => setCitizenModal(!citizenModal)}>
                <div className="d-flex flex-column align-items-center px-1" >
                  <img src={citizen_logo} alt={"citizen"} width={60} />
                  <h5 className="fw-bolder mt-1 px-1 text-citizen text-center" style={{ color: "#3b6796", borderRadius: "25px", border: "2px solid #3b6796" }}>{t("CitizenRequest")} form</h5>
                </div>
              </div>
              <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered' backdrop="static">
                <ModalHeader toggle={() => setFormModal(!formModal)}>{t(`${"login"}`)}</ModalHeader>
                <ModalBody>
                  <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-1'>
                      <Label className='form-label' for='login-email'>
                        {t(`${"userName"}`)}
                      </Label>
                      <Controller
                        id='email'
                        name='email'
                        control={control}
                        render={({ field }) => (
                          <Input
                            autoFocus
                            type='text'
                            placeholder='Enter user Id'
                            invalid={errors.loginEmail && true}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className='mb-1'>
                      <div className='d-flex justify-content-between'>
                        <Label className='form-label' for='login-password'>
                          {t(`${"password"}`)}
                        </Label>
                        <Link to='/forgot-password' style={{ color: "#3b6796" }}>
                          <small>{t(`${"createnew"}`)}</small>
                        </Link>
                      </div>
                      <Controller
                        id='password'
                        name='password'
                        control={control}
                        render={({ field }) => (
                          <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                        )}
                      />
                    </div>
                    {Error === false ? <div>
                      <span style={{ color: "red" }}>{errorMsg}</span>
                    </div> : ""}
                    <Button className="btn-style" color="success" style={{ marginBottom: '10px' }} block>
                      {t(`${"login"}`)}
                    </Button>

                  </Form>
                </ModalBody>
              </Modal>
              <Modal isOpen={citizenModal} toggle={() => handleClose()} className='modal-dialog-centered modal-sm' backdrop="static">
                <ModalHeader toggle={() =>  handleClose()}>{t(`${"login"}`)}</ModalHeader>
                <ModalBody>
                  {/* <Form className='auth-login-form mt-2' > */}
                  <div className="d-flex flex-column">
                    <Form className='auth-login-form mt-2' onSubmit={handleSubmit(handleGenrateOtp)}>
                      <div className='mb-1'>
                        <Label className='form-label' for='login-email'>
                          {t("phoneNumber")} <span style={{ color: "red" }}>*</span>
                        </Label>
                        <InputGroup className='input-group-merge'>
                          <InputGroupText>IN (+91)</InputGroupText>
                          <Input
                            autoFocus
                            type='number'
                            maxlength={9}
                            minLength={0}
                            placeholder={t("phPhoneNumber")}
                            onChange={handleChange}
                            value={PhoneNumberEnter}
                          />
                        </InputGroup>
                      </div>
                      <div style={{ color: "red" }}>{PhoneNumberEnter.length === 10 ? "" : PhoneNumberEnter.length > 10 ? t("phoperContact") : PhoneNumberEnter.length === 0 ? "" : PhoneNumberEnter.length < 10 ? t("phoperContact") : ""}</div>
                      {GenerateOtpV === false ? <>
                        <div style={{ color: "green" }}>{SuccessMsg}</div>
                        <Button className="btn-style" type="submit" color="success" style={{ marginBottom: '10px', float: "right" }} >
                          Generate OTP
                        </Button></> : ""}
                    </Form>
                    
                    {GenerateOtpV && <Form className='mt-2' onSubmit={e => e.preventDefault()}>
                      {/* <h4>{"Verify OTP"}</h4> */}

                      <h6>{t("securityCode")}</h6>
                      <div className='auth-input-wrapper d-flex align-items-center '>
                        <Input
                          name="otp1"
                          type="text"
                          autoComplete="off"
                          className='auth-input height-43 text-center numeral-mask mx-25 mb-1'
                          value={otp1}
                          onChange={e => setotp1(e.target.value)}
                          tabIndex="1" maxLength="1"
                          onKeyUp={e => inputfocus(e)}

                        />
                        <Input
                          name="otp2"
                          type="text"
                          autoComplete="off"
                          className='auth-input height-43 width-40 text-center numeral-mask mx-25 mb-1 '
                          value={otp2}
                          onChange={e => setotp2(e.target.value)}
                          tabIndex="2" maxLength="1"
                          onKeyUp={e => inputfocus(e)}

                        />
                        <Input
                          name="otp3"
                          type="text"
                          autoComplete="off"
                          className='auth-input height-43 text-center numeral-mask mx-25 mb-1'
                          value={otp3}
                          onChange={e => setotp3(e.target.value)}
                          tabIndex="3" maxLength="1"
                          onKeyUp={e => inputfocus(e)}
                          

                        />
                        <Input
                          name="otp4"
                          autoComplete="off"
                          className='auth-input height-43 text-center numeral-mask mx-25 mb-1'
                          value={otp4}
                          type="text"
                          onChange={e => setotp4(e.target.value)}
                          tabIndex="4" maxLength="1"
                          onKeyUp={e => inputfocus(e)}

                        />
                      </div>
                      <span style={{cursor: 'pointer', color:'#3b6796', fontWeight:'700'}} onClick={handleGenrateOtp} >Resend OTP</span>
                        <div><span style={{color:"red"}}>{FaileddMsg}</span></div>
                      <Button className="btn-style" color="success" style={{ marginBottom: '10px' }} onClick={handleCitizenLogin} block >
                        {t(`${"login"}`)}
                      </Button>
                    </Form>}
                  </div>


                  {/* <CardText className='mb-75'>
                        We sent a verification code to your mobile. Enter the code from the mobile in the field below.
                      </CardText> */}
                  {/* <CardText className='fw-bolder mb-2'>******0789</CardText> */}


                </ModalBody>
              </Modal>

            </div>
          </div>

        </Col>
        <Col className='d-flex align-items-center pr-1' lg='7' sm='12' md="12" style={{ margin: "11% 0 0 0" }}>
          <img src={img4} style={{ overflow: "hidden", width: "100%", height: "100%" }} />
        </Col>
      </Row>
      <Row className="my-2 mt-5">
        <Col lg="12" md="12" sm="12" xs="12">
          <div>
            <div className="container d-flex justify-content-center mb-1">
              <hr style={{ border: "1px solid #3b6796", width: "10%" }} />
            </div>
            <div className="d-flex justify-content-center">
              <div className="d-flex flex-column px-5 align-items-center">
                <span className="fw-bolder" style={{ fontSize: "10px", color: "#222222" }}>Implemented By</span>
                <img src={cp2} width={150} />
              </div>
              <div className="d-flex flex-column px-5 align-items-center">
                <span className="fw-bolder mb-1" style={{ fontSize: "10px", color: "#222222" }}>Funding Programmer</span>
                <img src={cp1} width={150} />
              </div>
              <div className="d-flex flex-column px-5 align-items-center">
                <span className="fw-bolder mb-1" style={{ fontSize: "10px", color: "#222222" }}>In Cooperation with</span>
                <img src={cp3} width={150} />
              </div>
            </div>
            <Card>
              <CardFooter className="" style={{ fontSize: "12px", position: "fixed", width: "100%", bottom: "0", height: "auto", zIndex: "999", background: "#fff" }}>
                <div className="copyright text-center">
                  © Powered by <strong> Transerve</strong>. All Rights Reserved
                </div>
              </CardFooter>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default (withTranslation()(Login))
