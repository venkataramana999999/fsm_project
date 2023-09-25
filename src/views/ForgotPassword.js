// ** React Imports
import { useState } from 'react'
import { Link } from "react-router-dom"
import Swal from 'sweetalert2'
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin"

// ** Icons Imports
import { ChevronLeft } from "react-feather"
import axios from "../lib/ApiCall"

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button
} from "reactstrap"

// ** Styles
import "@styles/react/pages/page-authentication.scss"
const ForgotPassword = () => {
  // ** Hooks
  const { skin } = useSkin()
  const illustration =
    skin === "dark" ? "forgot-password-v2-dark.svg" : "forgot-password-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default
  const fmsLogo = require("@src/assets/images/logo/logo.jpeg").default
  const [Email, setEmail] = useState("")
  const handleChange = (e) => {
    setEmail(e.target.value)
  }
  const handleForgotPassword = () => {
    if (Email) {
      const url = '/otp'
      axios.post(url, { email: Email }).then((response) => {
        console.log(response)
        localStorage.setItem("OTPEmail", Email)
        window.location.href = '/reset-password'
      }).catch(err => {
        new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })

      })
    }
  }
  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img src={fmsLogo} alt="Logo" style={{ width: "5%", marginTop: "-17px" }} />
          <h2 className="brand-text text-primary ms-1">FSM</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Forgot Password? 🔒
            </CardTitle>
            <CardText className="mb-2">
              Enter your email and we'll send you instructions to reset your
              password
            </CardText>
            <Form
              className="auth-forgot-password-form mt-2"
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="login-email"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  value={Email}
                  placeholder="Enter email"
                />
              </div>
              <Button color="primary" block onClick={handleForgotPassword}>
                Send reset link
              </Button>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="rotate-rtl me-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default ForgotPassword
