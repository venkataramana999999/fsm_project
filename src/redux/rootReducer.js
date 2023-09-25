// ** Reducers Imports
import layout from "./layout"
import navbar from "./navbar"
import auth   from './auth'
import ulbManagement from "./ulbManagement"
import UserRedx from "./UserRedx"
import SchedulerRedux from "./SchedulerRedux"
import DisposalFacilityRedux from "./DisposalFacilityRedux"
import ClusterMangament from "./ClusterMangament"
import Operator from "./Operator"
import DataReport from "./DataReport"
import StateDashboardRedux from "./StateDashboardRedux"
import property from "./property"
import FSTP_Report from "./FSTP_Report"
import UnknownDisposal from "./UnknownDisposal"
const rootReducer = { navbar, layout, auth, ulbManagement, UserRedx, SchedulerRedux, DisposalFacilityRedux, ClusterMangament, Operator, DataReport, StateDashboardRedux, property, FSTP_Report, UnknownDisposal}

export default rootReducer
