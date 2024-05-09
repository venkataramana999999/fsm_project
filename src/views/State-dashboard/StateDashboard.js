import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Row, Col, Button, Label, Input, Table, CardSubtitle, Modal, ModalHeader, ModalBody } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import { useRTL } from '@hooks/useRTL'
import '@styles/react/libs/noui-slider/noui-slider.scss'
import { Fragment, useState, useEffect, useContext } from "react"
import { useSkin } from "@hooks/useSkin"
import Chart from 'react-apexcharts'
import moment from "moment"
import { MoreVertical, Edit, FileText, Archive, Trash, X, ChevronDown, ChevronUp, Plus } from 'react-feather'
// import ReactPaginate from 'react-paginate'
import { getStateDashTable, getStateDashGraph, getStateViewHistorGraph } from '../../redux/StateDashboardRedux'
import { useDispatch, useSelector } from "react-redux"
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { withTranslation } from 'react-i18next'

const StateDashboard = ({ t }) => {
  const { colors } = useContext(ThemeColors)
  const [isRtl] = useRTL()
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const [selectDays, setSelectDays] = useState("Current Day")
  const [selectCategory, setSelectCategory] = useState(1)
  const [startDate, setStateDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(new Date())
  const [currentSortId, setCurrentSortId] = useState('')
  const [sortName, setSortName] = useState('')
  const [sortValue, setSortValue] = useState('DESC')
  const [open, setOpen] = useState(false)
  const [ulbIDs, setUlbid] = useState("")
  const handleDaysSelect = (e) => {
    if (e.target.value !== null) {
      let dateChange
      switch (e.target.value) {
        case '7 Days':
          dateChange = moment().subtract(7, 'd').format('YYYY-MM-DD')
          localStorage.setItem('sdFilterDate', moment().subtract(7, 'd').format('YYYY-MM-DD'))
          break
        case '30 Days':
          dateChange = moment().subtract(30, 'd').format('YYYY-MM-DD')
          localStorage.setItem('sdFilterDate', moment().subtract(30, 'd').format('YYYY-MM-DD'))
          break
        case '1 Year':
          dateChange = moment().subtract(365, 'd').format('YYYY-MM-DD')
          localStorage.setItem('sdFilterDate', moment().subtract(365, 'd').format('YYYY-MM-DD'))
          break
        case 'Till Date':
          dateChange = moment().subtract(5, 'year').format('YYYY-MM-DD')
          localStorage.setItem('sdFilterDate', moment().subtract(5, 'year').format('YYYY-MM-DD'))
          break
        default:
          dateChange = moment(new Date()).format('YYYY-MM-DD')
          localStorage.setItem('sdFilterDate', moment(new Date()).format('YYYY-MM-DD'))
      }
      setStateDate(moment(localStorage.getItem('sdFilterDate')))
      setEndDate(moment(new Date()).format('YYYY-MM-DD'))
      setSelectDays(e.target.value)
      const payload = {
        interval: e.target.value,
        startDate: dateChange,
        endDate: moment(new Date()).format('YYYY-MM-DD'),
        category: selectCategory,
        sliderValue: [0, 100],
        endutilizationRateIn: 100,
        startutilizationRateIn: 0,
        sortColumnName: sortName,
        sortType: sortValue
      }
      dispatch(getStateDashTable(payload))
      dispatch(getStateDashGraph(payload))
    }


  }
  const handleSelectCategory = (e) => {
    setSelectCategory(e.target.value)
    const payload = {
      interval: selectDays,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      category: e.target.value,
      sliderValue: [0, 100],
      endutilizationRateIn: 100,
      startutilizationRateIn: 0,
      sortColumnName: sortName,
      sortType: sortValue
    }
    dispatch(getStateDashTable(payload))
    dispatch(getStateDashGraph(payload))
  }

  const handleSort = (e, sortBy) => {
    let value
    if (sortName === sortBy.id) {
      value = (sortValue === 'DESC') ? 'ASC' : 'DESC'
      setSortName(sortBy.id)
      setSortValue(value)
    } else {
      setSortName(sortBy.id)
      setSortValue('DESC')
      value = 'DESC'
    }
    setCurrentSortId(sortBy.id)
    const payload = {
      interval: selectDays,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      category: selectCategory,
      sliderValue: [0, 100],
      endutilizationRateIn: 100,
      startutilizationRateIn: 0,
      sortColumnName: sortBy.id,
      sortType: value
    }
    dispatch(getStateDashTable(payload))
  }
  const handleModal = (ulbID) => {
    setOpen(!open)
    setUlbid(ulbID)
    const payload = {
      interval: selectDays,
      ulbId: ulbID
    }
    dispatch(getStateViewHistorGraph(payload))
  }
  useEffect(() => {
    const payload = {
      interval: selectDays,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      category: selectCategory,
      sliderValue: [0, 100],
      endutilizationRateIn: 100,
      startutilizationRateIn: 0,
      sortColumnName: sortName,
      sortType: sortValue
    }
    dispatch(getStateDashTable(payload))
    dispatch(getStateDashGraph(payload))

  }, [])
  const store = useSelector((state) => state.StateDashboardRedux)
  const columns = store.StateDashTable.dashboard_data ? store.StateDashTable.dashboard_data[0].table_data.headers : []
  const sdStore = store.StateDashTable.dashboard_data ? store.StateDashTable.dashboard_data[0].table_data.body : []
  const graphData = store.StateDashGraph.dashboard_data ? store.StateDashGraph.dashboard_data[0].table_data.body : []
  const ViewGraphData = store.StateViewHistorGraph.dashboard_data ? store.StateViewHistorGraph.dashboard_data[0].date_wise_loads : []

  //  const count = 1
  const utilizationRateIn = []
  const ulbName = []
  const LoadsCount = []
  const LoadsDate = []
  graphData.forEach(element => {
    utilizationRateIn.push(element.utilizationRateIn)
    ulbName.push(element.ulbName)
  })
  ViewGraphData.forEach(element => {
    LoadsCount.push(element.Count)
    LoadsDate.push(element.DateTime)
  })
  const optionsGraph = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      foreColor: skin === "dark" ? 'red' : "black"
    },
    plotOptions: {
      bar: {
        horizontal: false,
        vertical: true,
        barHeight: '30%',
        borderRadius: [10],
        // label: "Utilization %"
        calculatePercent: true

      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    colors: "rgb(255, 161, 161)",
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ulbName
    },
    yaxis: {
      opposite: isRtl === 'rtl'
    },
    legend: {
      showForSingleSeries: true,
      position: 'top'
    }
  }

  // ** Chart Series
  const seriesGraph = [
    {
      name: "Utilization %",
      data: utilizationRateIn
    }
  ]


  // Load
  const optionsLoad = {
    chart: {
      zoom: {
        enabled: false
      },
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      foreColor: skin === "dark" ? 'red' : "black"
    },

    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      strokeColors: ['#fff'],
      colors: [colors.warning.main]
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: undefined,
      formatter: (val) => {
        return val
      }
    },
    stroke: {
      curve: 'straight'
    },
    colors: [colors.warning.main],
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    tooltip: {
      custom(data) {

        return `<div class='px-1 py-50'>
              <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
            </div>`
      }
    },
    xaxis: {
      categories: LoadsDate
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    yaxis: {
      opposite: isRtl === 'rtl'
    },
    legend: {
      showForSingleSeries: true,
      position: 'top'
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1.5rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  // ** Chart Series
  const seriesLoad = [
    {
      name: 'Collected Loads',
      data: LoadsCount
    }

  ]
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={() => handleModal(ulbIDs)} />
  return <div>
    <Fragment>
      <Breadcrumbs title={t('stateDashBoard')} data={[{ title: `${t('stateDashBoard')}` }, { title: `${t('stateDashBoard')}` }]} />
    </Fragment>

    <Row className="align-items-center">
      <Col sm={4}>
        <Card>
          <CardHeader className="fw-900">{t('FilterBy')}</CardHeader>
          <CardBody className='d-flex'>
            <div className='d-flex flex-column'>
              <Label for='sort-select align-items-start fw-bolder'>{t('days')}</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                style={{ width: "180px" }}
                value={selectDays}
                onChange={e => handleDaysSelect(e)}
              >
                <option value={"Current Day"}>{t('CurrentDate')}</option>
                <option value={"7 Days"}>7 {t('days')}</option>
                <option value={"30 Days"}>30 {t('days')}</option>
                <option value={"1 Year"}>1 {t('Year')}</option>
                <option value={"Till Date"}>{t('TillDate')}</option>

              </Input>
            </div>
            <div className="ms-2"></div>
            <div className='d-flex flex-column'>
              <Label className='form-label required' for='date'>
                {t('Date')}
              </Label>
              <Input
                id='date'
                name='date'
                value={localStorage.getItem('sdFilterDate')}
                disabled={true}
                required
              />

            </div>

          </CardBody>
        </Card>
      </Col>
      <Col sm={4}>
        <Card>
          <CardHeader > {t('FilterByCategory')}</CardHeader>
          <CardBody>
            <div className='d-flex flex-column'>
              <Label for='sort-select align-items-start fw-bolder'></Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                // style={{width:"180px"}}
                value={selectCategory}
                onChange={e => handleSelectCategory(e)}>
                <option value={1}>FSTP</option>
                <option value={2}>STP</option>
              </Input>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col sm={4}>
      </Col>
    </Row>

    {utilizationRateIn.length !== 0 && ulbName.length ? <>
      <Row>
        <Col md={12} sm={12} lg={12}>
          <Card>
            <CardBody>
              <Chart className="apex-charts" options={optionsGraph} series={seriesGraph} type='bar' height={370} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12} sm={12} lg={12}>
          <Card>
            <CardBody>
              <div className='react-dataTable'>
                <Table responsive>
                  <thead>
                    <tr>
                      {columns.length !== 0 ? columns.map((item, index) => {

                        return <th key={index} scope='col' className='text-nowrap'
                        >
                          {item.label}
                          {item.label === "Action" ? "" : <> {currentSortId === item.label && sortValue === "ASC" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)}</>}
                        </th>
                      }) : []}
                    </tr>

                  </thead>
                  <tbody>
                    {!!sdStore && sdStore.length !== 0 ? sdStore.map((val, i) => {
                      return <tr key={i}>{
                        columns.map((accesser, h) => {
                          switch (accesser.id) {
                            case "action":
                              return <td key={h}> <Button className='ms-2' color='primary' onClick={() => handleModal(val.ULBId)}>
                                <span className='align-items-center'>{t('viewHist')}</span>
                              </Button></td>
                            default:
                              return <td key={h} className='text-nowrap'>{val[accesser.id] === null ? "_" : val[accesser.id]}</td>
                          }
                        })
                      }
                      </tr>
                    }) : []}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </> : ""}


    <Modal
      isOpen={open}
      toggle={() => handleModal(ulbIDs)}
      className='modal-dialog-centered modal-lg'
      backdrop="static"
    >
      <ModalHeader toggle={() => handleModal(ulbIDs)} close={CloseBtn} tag='div' className='bg-transparent'>
        {t('History')}
      </ModalHeader>
      <ModalBody className='px-sm-5 mx-50 pb-5'>
        <Row>
          <Col className='px-2' lg='12' sm='12'>
            <h4 className="text-center">{t('DayswiseLoads')}</h4>

            <Chart options={optionsLoad} series={seriesLoad} type='line' height={400} />

          </Col>
          <h6 className="text-center text-primary">{t('days')}</h6>

        </Row>
      </ModalBody>
    </Modal>

  </div>
}

export default (withTranslation()(StateDashboard))