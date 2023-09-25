// ** React Imports
import {Link, useNavigate } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"
// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power
} from "react-feather"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Button
} from "reactstrap"
import { handleLogout } from "../../../../redux/auth"
import { useDispatch } from 'react-redux'
// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"
import { withTranslation } from 'react-i18next'

const UserDropdown = ({ t }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handLogout = () => {
    dispatch(handleLogout())
    navigate("/login", { replace: true })

  }
  const user = JSON.parse(localStorage.getItem("userData"))
  return (
    <>
      {/* {user ? "" : <Link to="/citizen-history"><Button color="primary" className="mx-4">History </Button> </Link>} */}

      <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
        <DropdownToggle
          href="/"
          tag="a"
          className="nav-link dropdown-user-link"
          onClick={(e) => e.preventDefault()}
        >
          <div className="user-nav d-sm-flex d-none">
            <span className="user-name fw-bold">{user === null ? "" : user.username}</span>
            <span className="user-status">{user === null ? "Citizen" : user.roleName}</span>
          </div>
          <Avatar
            img={defaultAvatar}
            imgHeight="40"
            imgWidth="45"

          />
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem onClick={handLogout}>
            <Power size={14} className="me-75" />
            <span className="align-middle">{t('logOut')}</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  )
}

export default (withTranslation()(UserDropdown))
