// ** React Imports
import { Fragment, lazy } from "react"
import { Navigate } from "react-router-dom"
// ** Layouts
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import HorizontalLayout from "@src/layouts/HorizontalLayout"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute"

// ** Utils
import { isObjEmpty } from "@utils"
import Property from "../../views/Property-management/Property"
import StateDashboard from "../../views/State-dashboard/StateDashboard"
import Scheduled from "../../views/Schedule Properties/Scheduled"
import DisposalFacility from "../../views/DisposalFacility/DisposalFacility"
import ClusterManagement from "../../views/ClusterManagement/ClusteManagement"
import OperatorListing from "../../views/OperaterManagement/OperaterListing"
import Report from "../../views/DataReport/Report"
import History from "../../views/History"
import AddPropertyForm from "../../views/Property-management/AddPropertyForm"
import FSTP_Report from "../../views/FSTP Report/FSTP_Report"
import Unknown_Disposal from "../../views/Unknown-Disposal/Unknown_Disposal"
import Map_View from "../../views/Dashboard/Map_View"

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}
// ** Document title
const TemplateTitle = "Faecal Sludge Management"
// ** Default Route
const DefaultRoute = "/state-dashboard"
const SchedulerRoute = "/scheduled-properties"
const ULBAdminRoute = "/dasboard-ulb"
const Home = lazy(() => import("../../views/Home"))
const UlbManagement = lazy(() => import('../../views/ULB-management/UlbManagement'))
const UserManagement = lazy(() => import('../../views/User-management/userListing'))
const Dashboard = lazy(() => import("../../views/Dashboard/Dashboard"))
// const SecondPage = lazy(() => import("../../views/SecondPage"))
const Login = lazy(() => import("../../views/Login"))
const Register = lazy(() => import("../../views/Register"))
const Citizen = lazy(() => import("../../views/Citizen"))
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"))
const Error = lazy(() => import("../../views/Error"))
const role = localStorage.getItem("role")
// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={role === "ULB Admin" ? ULBAdminRoute : role === "Admin" ? DefaultRoute : role === "Scheduler" ? SchedulerRoute : '/login'} exact />
  },
  {
    path: "/ulb-management",
    element: <UlbManagement />
  },
  {
    path: "/user-management",
    element: <UserManagement />
  },
  {
    path: "/state-dashboard",
    element: <StateDashboard />
  },
  {
    path: "/dasboard-ulb",
    element: <Dashboard />
  },
  {
    path: "/dasboard-map",
    element: <Map_View />
  },
  {
    path: "/property-management",
    element: <Property />
  },
  {
    path: "/scheduled-properties",
    element: <Scheduled />
  },
  {
    path: "/disposal",
    element: <DisposalFacility />
  },
  {
    path: "/cluster-management",
    element: <ClusterManagement />
  },
  {
    path: "/operater-management",
    element: <OperatorListing />
  },
  {
    path: "/data-reports",
    element: <Report />
  },
  {
    path: "/fstp-reports",
    element: <FSTP_Report />
  },
  {
    path: "/unknown-disposal",
    element: <Unknown_Disposal />
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/citizen",
    element: <Citizen />
    // meta: {
    //   layout: "blank"
    // }
  },
  {
    path: "/citizen-history",
    element: <History />
    // meta: {
    //   layout: "blank"
    // }
  },
  {
    path: "/reset-password",
    element: <Register />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/addProperty",
    element: <AddPropertyForm />
    // meta: 
    //   layout: "blank"
    // }
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank"
    }
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank"
    }
  }
]


const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []
  if (Routes) {
    Routes.filter((route) => {

      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
              LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, ULBAdminRoute, SchedulerRoute, TemplateTitle, Routes, getRoutes }
