// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout"
import { withTranslation } from 'react-i18next'

// ** Menu Items Array
import navigation from "@src/navigation/vertical"
import "../views/login.css"

const VerticalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])
  navigation.forEach(element => {
    switch (element.id) {
      case "StateDashboard":
        element.title = props.t("stateDashBoard")
        break
      case "ulbManagement":
        element.title = props.t("ulbManagement")
        break
      case "userListing":
        element.title = props.t("userManagement")
        break
      case "dashboards":
        element.title = props.t("dashBoard")
        break
      case "dashboard":
        element.title = props.t("dashBoard")
        break
      case "map":
        element.title = props.t("Map View")
        break
      case "Property":
        element.title = props.t("propertyMangHeading")
        break
      case "Scheduled":
        element.title = `Scheduled 
        Properties`
        break
      case "DisposalFacility":
        element.title = props.t("disposalFac")
        break
      case "ClusterManagement":
        element.title = props.t("clusterMang")
        break
      case "OperatorListing":
        element.title = props.t("operatorMang")
        break
      case "Report":
        element.title = props.t("dataReports")
        break
      case "FSTPReport":
        element.title = props.t("FSTP Reports")
        break
      case "UnknownDisposal":
        element.title = props.t("Unknown Disposal")
        break
      case "login":
        element.title = props.t("login")
        break
      case "Citizen":
        element.title = props.t("CitizenRequest")
        break
      case "History":
        element.title = props.t("History")
        break
      default:
        break
    }
  })
  return (
    <Layout menuData={navigation} {...props}>
      <Outlet />
    </Layout>
  )
}

export default (withTranslation()(VerticalLayout))
