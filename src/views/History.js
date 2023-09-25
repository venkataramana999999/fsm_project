// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Button, UncontrolledCollapse, ListGroup, ListGroupItem, Badge, Row, Col, Card, CardBody, Table, Label, Input } from 'reactstrap'
import { getCitizenHistory } from '../redux/auth'
import { Share2, MessageSquare, PhoneCall, PenTool, User, FileText, MapPin, ShoppingBag, Server } from 'react-feather'
// ** Custom Components
// import moment from 'moment'
import { withTranslation } from 'react-i18next'
import BreadCrumbs from '@components/breadcrumbs'
import { useDispatch, useSelector } from "react-redux"
const History = ({ t }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [parPage, setParPage] = useState(1)
  const dispatch = useDispatch()
  const store = useSelector((state) => state.auth)
  useEffect(() => {
    const phno = (localStorage.getItem("PhoneNumber"))
    const payload = {
      phoneNumber: phno,
      page: parPage,
      limit: rowsPerPage
    }
    dispatch(getCitizenHistory(payload))
  }, [])

  // ** Function to handle per page
  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
    const phno = (localStorage.getItem("PhoneNumber"))
    const payload = {
      phoneNumber: phno,
      page: parPage,
      limit: e.target.value
    }
    dispatch(getCitizenHistory(payload))
  }
  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page.selected)
    setParPage(page.selected + 1)
    const phno = (localStorage.getItem("PhoneNumber"))
    const payload = {
      phoneNumber: phno,
      page: page.selected + 1,
      limit: rowsPerPage
    }
    dispatch(getCitizenHistory(payload))
  }
  const historyState = store.historyDetailList ? store.historyDetailList.data : []
  const count = Math.ceil(store.historyDetailList.totalCount / rowsPerPage)

  const historyHeaders = [
    {
      accessor: "ReqId",
      filter: "false",
      header: "Request Id",
      sortable: "false"
    },
    {
      accessor: "OWNER_DOORNO",
      filter: "false",
      header: "House No",
      sortable: "false"
    },
    {
      accessor: "ASSESSMENT_NO",
      filter: "false",
      header: "Tax Ass. no.",
      sortable: "false"
    },

    {
      accessor: "OwnerName",
      filter: "false",
      header: "Owner Name",
      sortable: "false"
    },
    {
      accessor: "Locality",
      filter: "false",
      header: "Locality",
      sortable: "false"
    },
    {
      accessor: "DateTime",
      filter: "false",
      header: "PROPERTY ADDED ON",
      sortable: "false"
    },
    {
      accessor: "DateTime",
      filter: "false",
      header: "Scheduled Date/Time",
      sortable: "false"
    },
    {
      accessor: "collectionDate",
      filter: "false",
      header: "Collected Date/Time",
      sortable: "false"
    },
    {
      accessor: "disposedDate",
      filter: "false",
      header: "Disposed Date/Time",
      sortable: "false"
    },
    {
      header: "Rejected Date/Time",
      accessor: "refusedDate",
      filter: "false",
      sortable: "false"
    }

  ]
  return (
    <Fragment>
      <BreadCrumbs title={t('History')} data={[{ title: 'Components' }, { title: t('History') }]} />
      <Row>
        <Col lg='12' >
          <Card>
            <div className='react-dataTable'>
              <Table responsive>
                <thead>
                  <tr>
                    {historyHeaders.length !== 0 ? historyHeaders.map((item, index) => {
                      return <th key={index} scope='col' className='text-nowrap'>
                        {item.header}
                        {/* {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)} */}

                      </th>
                    }) : []}
                  </tr>

                </thead>
                <tbody>
                  {!!historyState && historyState.length !== 0 ? historyState.map((val, i) => {
                    return <tr key={i}>{
                      historyHeaders.map((accesser, h) => {
                        switch (accesser.accessor) {
                          case "disposedDate":
                            return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null || val[accesser.accessor] === "" || val[accesser.accessor] === undefined ? "_" : `${val[accesser.accessor]} ${ val["disposedTime"]}`}</td>
                          case "refusedDate":
                            return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null || val[accesser.accessor] === "" || val[accesser.accessor] === undefined ? "_" : `${val[accesser.accessor]}  ${val["refusedTime"]}`}</td>
                          case "collectionDate":
                            return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null || val[accesser.accessor] === "" || val[accesser.accessor] === undefined ? "_" : `${val[accesser.accessor]}  ${val["collectionTime"]}`}</td>
                          default:
                            return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null ? "_" : val[accesser.accessor]}</td>
                        }

                      })
                    }
                    </tr>
                  }) : []}
                </tbody>

              </Table>
              <div className="d-flex float-end">
                  <div className='d-flex align-items-center'>
                    <Label for='sort-select'>{t('Page')}</Label>
                    <Input
                      className='dataTable-select'
                      type='select'
                      id='sort-select'
                      style={{width:"90px"}}
                      value={rowsPerPage}
                      onChange={e => handlePerPage(e)}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={75}>75</option>
                      <option value={100}>100</option>
                    </Input>

                    <ReactPaginate
                      previousLabel={''}
                      nextLabel={''}
                      breakLabel='...'
                      pageCount={count}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={2}
                      activeClassName='active'
                      forcePage={currentPage}
                      onPageChange={page => handlePagination(page)}
                      pageClassName='page-item'
                      breakClassName='page-item'
                      nextLinkClassName='page-link'
                      pageLinkClassName='page-link'
                      breakLinkClassName='page-link'
                      previousLinkClassName='page-link'
                      nextClassName='page-item next-item'
                      previousClassName='page-item prev-item'
                      containerClassName={
                        'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
                      }
                    />
                  </div>
              </div>

            </div>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default (withTranslation()(History))
