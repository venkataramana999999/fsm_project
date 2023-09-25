import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  Row,
  Col,
  Button,
  Label,
  Input,
  CardSubtitle
} from "reactstrap"
import { useState, useContext } from 'react'
import Flatpickr from 'react-flatpickr'
import { useSkin } from "@hooks/useSkin"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Chart from 'react-apexcharts'
// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'
// import classnames from 'classnames'
// import Flatpickr from 'react-flatpickr'

import { ThemeColors } from '@src/utility/context/ThemeColors'
import { withTranslation } from 'react-i18next'

const Dashboard = ({t}) => {
  const { colors } = useContext(ThemeColors)
  const [isRtl] = useRTL()
  const { skin } = useSkin() 
  const [visibility, setVisibility] = useState(false)
  const [ulbName, setUlbName] = useState(true)
  const [dueDate, setDueDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())


  const changeUlbName = e => {
    const value = e.target.value
    setUlbName(JSON.parse(value))
  }
  console.log(ulbName, dueDate, toDate)

  // const handleCustom = () => {
  // setVisibility(true)
  // }

  const changeDateSelection = (e) => {
    if (e.target.value === "Month") {
      setVisibility(false)

    }
    if (e.target.value === "Day") {
      setVisibility(false)

    }
    if (e.target.value === "customDate") {
      setVisibility(true)
    }
    if (e.target.value === "week") {
      setVisibility(false)

    }

  }
  // ** Chart color
  const donutColors = {
    series1: '#ffe700',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#2b9bf4',
    series5: '#FFA1A1'
  }
  const ScheduleColors = {
    series1: '#ffe700',
    series2: '#ea5455'
    
  }

  // ** Chart Options
  const options = {
    chart: {
      foreColor: skin === "dark" ? '#fff' : "black"
    },
    legend: {
      show: true,
      position: 'bottom'
    },
    labels: [`${t('ULBAdmin')}`, `${t('scheduler')}`, `${t('TruckOperator')}`, `${t('Citizen')}`],

    colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '2rem',
              fontFamily: 'Montserrat'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'Montserrat',
              formatter(val) {
                return `${parseInt(val)}%`
              }
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              label: '',
              formatter() {
                return '31%'
              }
            }
          }
        }
      }
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
  const series = [85, 16, 50, 50]

  const optionsProperty = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      foreColor: skin === "dark" ? '#fff' : "black"
    },
    plotOptions: {
      bar: {
        horizontal: false,
        vertical: true,
        barHeight: '30%',
        borderRadius: [10]

      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    colors: colors.info.main,
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [`${t('Pit')}`, `${t('Hotel')}`, `${t('Apartment')}`, `${t('Building')}`, `${t('School')}`]
    },
    yaxis: {
      opposite: isRtl === 'rtl'
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
  const seriesProperty = [
    {
      data: [700, 350, 480, 600, 210]
    }
  ]
// trips
 // ** Chart Series

 const optionsTrips = {
   chart: {
     parentHeightOffset: 0,
     toolbar: {
       show: false
     },
     foreColor: skin === "dark" ? '#fff' : "black"
   },
   plotOptions: {
     bar: {
       horizontal: false,
       vertical: true,
       barHeight: '30%',
       borderRadius: [10]

     }
   },
   grid: {
     xaxis: {
       lines: {
         show: false
       }
     }
   },
   colors: "#7367f0",
   dataLabels: {
     enabled: false
   },
   xaxis: {
    categories: [
      '7/9/2022',
      '8/9/2022',
      '9/9/2022',
      '10/9/2022',
      '20/9/2022'
    ]
   },
   yaxis: {
     opposite: isRtl === 'rtl'
   }
 }

 // ** Chart Series
 const seriesTrips = [
   {
     data: [700, 350, 480, 600, 210]
   }
 ]
//end trips
// trips
 // ** Chart Series

 const optionsCollected = {
  chart: {
    parentHeightOffset: 0,
    toolbar: {
      show: false
    },
    foreColor: skin === "dark" ? '#fff' : "black"
  },
  plotOptions: {
    bar: {
      horizontal: false,
      vertical: true,
      barHeight: '30%',
      borderRadius: [10]

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
   categories: [
     '7/9/2022',
     '8/9/2022',
     '9/9/2022',
     '10/9/2022',
     '20/9/2022'
   ]
  },
  yaxis: {
    opposite: isRtl === 'rtl'
  }
}

// ** Chart Series
const seriesCollected = [
  {
    data: [1700, 350, 480, 600, 210]
  }
]
//end trips
  const optionsSchedulerVsEm = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      foreColor: skin === "dark" ? '#fff' : "black"
    },
    plotOptions: {
      bar: {
        distributed: true, // this line is mandatory
        horizontal: true,
        barHeight: '30%',
        borderRadius: [10]

      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    colors: [ScheduleColors.series1, ScheduleColors.series2],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [`${t('Scheduled')}`, `${t('Emergency')}`]
    },
    yaxis: {
      opposite: isRtl === 'rtl'
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
  const seriesSchedulerVsEm = [
    {
      data: [700, 350]
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
      foreColor: skin === "dark" ? '#fff' : "black"
    },

    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      strokeColors: ['#fff'],
      colors: [colors.warning.main]
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    colors: [colors.warning.main],
    grid: {
      xaxis: {
        lines: {
          show: true
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
      categories: [
        '7/9/2022',
        '8/9/2022',
        '9/9/2022',
        '10/9/2022',
        '11/9/2022',
        '12/9/2022'
      ]
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    tooltip: {
      shared: false
    },
    yaxis: {
      opposite: isRtl === 'rtl'
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
      name: 'Loads',
      data: [100, 120, 90, 170, 130, 160]
    }
 
  ]
  return (
    <div>
      <Card>
        <CardBody>
          <Row>
            <Col className='px-2' lg='3' sm='3' >
              <Card className="bg-primary">
                <CardHeader className="flex-column">
                  <h4 className="text-white" style={{fontSize:'0.9rem', fontWeight:'bolder'}}>Total Properties</h4>
                  <h5 className="text-white">10</h5>
                </CardHeader>
              </Card>
            </Col>
            <Col className='px-2' lg='3' sm='3' >
              <Card className="bg-primary">
                <CardHeader className="flex-column">
                  <h4 className="text-white" style={{fontSize:'0.9rem', fontWeight:'bolder'}}>Scheduled Properties</h4>
                  <h5 className="text-white">8</h5>
                </CardHeader>
              </Card>
            </Col>
            <Col className='px-2' lg='3' sm='3' >
              <Card className="bg-primary">
                <CardHeader className="flex-column">
                  <h4 className="text-white" style={{fontSize:'0.9rem', fontWeight:'bolder'}}>Desludged Properties</h4>
                  <h5 className="text-white">2</h5>
                </CardHeader>
              </Card>
            </Col>

            <Col className='px-2' lg='3' sm='3' >
              <Card className="bg-primary">
                <CardHeader className="flex-column">
                  <h4 className="text-white" style={{fontSize:'0.9rem', fontWeight:'bolder'}}>Remaining Properties</h4>
                  <h5 className="text-white">6</h5>
                </CardHeader>
              </Card>
            </Col>

          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col className='mb-sm-0 mb-1' sm='3' md='3' lg='3'>
              <CardTitle className="mb-sm-0 mb-lg-0">{t('ulbName')}</CardTitle>
              <Input type='select' name='ulbName' id='ulbName' onChange={e => changeUlbName(e)}>
                <option value='true'>{t('true')}</option>
                <option value='false'>{t('false')}</option>
              </Input>
            </Col>

            <Col className='mb-sm-0 mb-1' sm='3' md='3' lg='3'>
              <CardTitle className="mb-sm-0 mb-lg-0">{t('DateSelection')}</CardTitle>
              <Input type='select' name='Date' id='date' onChange={e => changeDateSelection(e)}>
                <option value={"Month"}>{t('Currentmonth')}</option>
                <option value={"week"}>{t('CurrentWeek')}</option>
                <option value={"Day"}>{t('CurrentDay')}</option>
                <option value={"customDate"}>{t('CustomDate')}</option>
              </Input>
            </Col>


            {visibility ? <>
              <Col className='mb-sm-0 mb-1' sm='2' md='2' lg='2'>
                <CardTitle className="mb-sm-0 mb-lg-0">{t('FromDate')}</CardTitle>
                <Flatpickr
                  id='due-date'
                  name='due-date'
                  className='form-control'
                  onChange={date => setDueDate(date[0])}
                  value={dueDate}
                  options={{ dateFormat: 'Y-m-d' }}
                />
              </Col>

              <Col className='mb-sm-0 mb-1' sm='2' md='2' lg='2'>
                <CardTitle className="mb-sm-0 mb-lg-0">{t('ToDate')}</CardTitle>
                <Flatpickr
                  id='to-date'
                  name='to-Date'
                  className='form-control'
                  onChange={date => setToDate(date[0])}
                  value={toDate}
                  options={{ dateFormat: 'Y-m-d' }}
                />
              </Col>
            </> : <>

            </>}

            <Col className='mt-2' sm='2' md='2' lg='2'>
              <Button color="primary" className="w-100" outline>{t('search')}</Button>
            </Col>
          </Row>

        </CardBody>
      </Card>
      {/* chart */}
      <Row>
        <Col className='px-2' lg='6' sm='6' >
          <Card>
            <CardHeader>
              <div>
                <CardTitle className='mb-100' tag='h4'>
                  {t('PropertyScheduled')}
                </CardTitle>
                {/* <CardSubtitle className='text-muted'>Spending on various categories</CardSubtitle> */}
              </div>
            </CardHeader>
            <CardBody>
              <Chart options={options} series={series} type='donut' height={400} />
            </CardBody>
          </Card>
        </Col>
        <Col className='px-2' lg='6' sm='6'>
          <Card>
            <CardHeader >
              <div>
                <CardTitle className='' tag='h4'>
                  {t('propType')}
                </CardTitle>        
                </div>

            </CardHeader>
            <CardBody>
              <Chart   className="apex-charts" options={optionsProperty} series={seriesProperty} type='bar' height={370} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
      <Col className='px-2' lg='6' sm='6'>
          <Card>
            <CardHeader >
              <div>
                <CardTitle className='' tag='h4'>
                  {t('Scheduled_Emergency')}
                </CardTitle>        
                </div>

            </CardHeader>
            <CardBody>
              <Chart className="apex-charts" options={optionsSchedulerVsEm} series={seriesSchedulerVsEm} type='bar' height={400} />
            </CardBody>
          </Card>
        </Col>
        
        <Col className='px-2' lg='6' sm='6'>
        <Card>
      <CardHeader >
        <div>
          <CardTitle className='' tag='h4'>
          {t('LoadsDash')}
          </CardTitle>
        </div>
       
      </CardHeader>
      <CardBody>
        <Chart options={optionsLoad} series={seriesLoad} type='line' height={400} />
      </CardBody>
    </Card>
        </Col>
      </Row>
      <Row>
      <Col className='px-2' lg='6' sm='6'>
          <Card>
            <CardHeader >
              <div>
                <CardTitle className='' tag='h4'>
                  {t('Collected')}
                </CardTitle>        
                </div>

            </CardHeader>
            <CardBody>
              <Chart   className="apex-charts" options={optionsCollected} series={seriesCollected} type='bar' height={370} />
            </CardBody>
          </Card>
        </Col>

        <Col className='px-2' lg='6' sm='6'>
          <Card>
            <CardHeader >
              <div>
                <CardTitle className='' tag='h4'>
                  {t('Trips')}
                </CardTitle>        
                </div>

            </CardHeader>
            <CardBody>
              <Chart   className="apex-charts" options={optionsTrips} series={seriesTrips} type='bar' height={370} />
            </CardBody>
          </Card>
        </Col>
      </Row>

    </div>
  )
}

export default (withTranslation()(Dashboard))
