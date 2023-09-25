import { Mail, Home, User, Users, FileText, Monitor, File, Calendar, Truck, Circle } from "react-feather"
const user = localStorage.getItem("role")
const role = !!user && user !== null ? user : null
const loginCitizen = localStorage.getItem("citizen")
const modules = []
if (role === "Admin") {
  modules.push(
    {
      id: "StateDashboard",
      title: "State Dashboard",
      icon: <Monitor size={20} />,
      navLink: "/state-dashboard"
    }, {
    id: "ulbManagement",
    title: "ULB Management",
    icon: <Home size={20} />,
    navLink: "/ulb-management"
  },
    {
      id: "userListing",
      title: "User/Role ",
      icon: <Users size={20} />,
      navLink: "/user-management"
    })
}

if (role === "ULB Admin") {
  modules.push(
    {
      id: 'dashboards',
      title: 'Dashboards',
      icon: <Monitor size={20} />,
      badge: 'light-warning',
      badgeText: '2',
      children: [
      {
          id: 'dashboard',
          title: 'Dashboard',
          icon: <Circle size={12} />,
          navLink:  "/dasboard-ulb"
        },
        {
          id: 'map',
          title: 'Map View',
          icon: <Circle size={12} />,
          navLink: "/dasboard-map"
        }
      ]
    },
   {
    id: "Property",
    title: "Property",
    icon: <FileText size={20} />,
    navLink: "/property-management"
  },
    {
      id: "Scheduled",
      title: "Scheduler",
      icon: <Calendar size={20} />,
      navLink: "/scheduled-properties"
    },
    {
      id: "DisposalFacility",
      title: "Disposal",
      icon: <Mail size={20} />,
      navLink: "/disposal"
    },
    {
      id: "ClusterManagement",
      title: "Cluster",
      icon: <Users size={20} />,
      navLink: "/cluster-management"
    },
    {
      id: "OperatorListing",
      title: "Operator",
      icon: <Truck size={20} />,
      navLink: "/operater-management"
    },
    {
      id: "Report",
      title: "Data-Reports",
      icon: <File size={20} />,
      navLink: "/data-reports"
    },
    {
      id: "FSTPReport",
      title: "FSTP-Reports",
      icon: <File size={20} />,
      navLink: "/fstp-reports"
    },
    {
      id: "UnknownDisposal",
      title: "Unknown-Disposal",
      icon: <File size={20} />,
      navLink: "/unknown-disposal"
    }
  )
}
if (role === "Scheduler") {
  modules.push({
    id: "Scheduled",
    title: "Scheduler",
    icon: <Calendar size={20} />,
    navLink: "/scheduled-properties"
  }, {
    id: "Property",
    title: "Property",
    icon: <FileText size={20} />,
    navLink: "/property-management"
  },
    {
      id: "Report",
      title: "Data-Reports",
      icon: <File size={20} />,
      navLink: "/data-reports"
    })
}
if (loginCitizen === 'true' && role === null) {
  modules.push({
    id: "Citizen",
    title: "Citizen Request",
    icon: <Mail size={20} />,
    navLink: "/citizen"
  }, {
    id: "History",
    title: "History",
    icon: <FileText size={20} />,
    navLink: "/citizen-history"
  })
}
// if (role === null) {
//   modules.push({
//     id: "login",
//     title: "Login",
//     icon: <Mail size={20} />,
//     navLink: "/login"
//   })
// }

export default modules
