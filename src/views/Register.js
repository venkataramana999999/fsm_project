// ** React Imports
import { useState } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin"

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather"

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle"

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

const Register = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration =
    skin === "dark" ? "register-v2-dark.svg" : "register-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default
  const fmsLogo = require("@src/assets/images/logo/logo.jpeg").default
  const [OtpCode, setOtpCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const handleChange = (e) => {
    switch (e.target.name) {
      case "OtpCode":
        setOtpCode(e.target.value)
        break
      case "newPassword":
        setNewPassword(e.target.value)
        break
      default:
        break
    }
  }
  const handleResetPassword = () => {
    const emailData = localStorage.getItem('OTPEmail')
    const payload = {
      email: emailData,
      password: newPassword,
      otp: OtpCode
    }
    const url = '/user/update_password'
    axios.patch(url, payload).then((response) => {
      console.log(response)
      new Swal({ icon: "success", title: 'Password Updated!!' })
      localStorage.removeItem('OTPEmail')
      window.location.href = '/login'
    }).catch(err => {
      new Swal({ icon: "warning", title: err.response.data.error[0]["message"] })
    })
  }

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img src={fmsLogo} alt="Logo" style={{ width: "5%", marginTop: "-20px" }} />

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
          <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
            <CardTitle tag="h3" className="fw-bold mb-1 text-nowrap">
              Faecal Sludge Management
            </CardTitle>
            <CardText className="mb-2">
              We sent the OTP code to your email
              Please enter OTP below and set new password
            </CardText>
            <Form
              className="auth-register-form mt-2"
            >
              <div className="mb-1">
                <Label className="form-label" for="otpCode">
                  OTP
                </Label>
                <Input
                  type="number"
                  id="otpCode"
                  placeholder="Enter OTP"
                  autoFocus
                  name="OtpCode"
                  onChange={(e) => handleChange(e)}
                  value={OtpCode}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="new-password">
                  New Password
                </Label>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="new-password"
                  onChange={(e) => handleChange(e)}
                  name="newPassword"
                  value={newPassword}

                />
              </div>

              <Button color="primary" block onClick={handleResetPassword}>
                Submit
              </Button>
            </Form>
            <p className="text-center mt-2">
              <span className="float-md-start d-block d-md-inline-block mt-25">
                © {new Date().getFullYear()}{" "}
                <a
                  href="https://transerve.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Transerve
                </a>
                <span className="d-none d-sm-inline-block">, All rights Reserved</span>
              </span>

            </p>

          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
