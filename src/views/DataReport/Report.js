import {
    Card, CardHeader, CardBody, InputGroup, InputGroupText, CardTitle, CardText, CardLink, Button, Row, Col, Label, Input, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap"
import { getDataReportHeader, getDataReportsdata, getExportFile } from '../../redux/DataReport'
import { Fragment, useEffect, useState } from "react"
import Flatpickr from 'react-flatpickr'
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { MoreVertical, Edit, FileText, Archive, Trash, X, ChevronDown, ChevronUp, Plus, Search } from 'react-feather'
import Breadcrumbs from '@components/breadcrumbs'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from "moment"
import { withTranslation } from 'react-i18next'
const Reports = ({t}) => {
    const dispatch = useDispatch()
    // const { t } = useTranslation()
    // ** States
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [parPage, setParPage] = useState(1)
    const [searchSelect, setSearchSelect] = useState("selected")
    const [searchValue, setSearchValue] = useState('')
    const [sortName, setSortName] = useState('')
    const [sortValue, setSortValue] = useState('')
    const [currentSortId, setCurrentSortId] = useState('')
    // const [operatorIds, setOperatorIds] = useState('')
    const [dueDate, setDueDate] = useState(new Date('01,01,2020'))
    const [toDate, setToDate] = useState(new Date())
    const [filter, setFilter] = useState({ wardNumber: '', operatorName: '', truckRegistrationNumber: '', propertyTypeName: '' })
    //const [selectedData, setSelectedData] = useState([])
    // const [checkValue, setCheckValue] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    // ** Function to handle Modal toggle
    // const handleModal = () => setModal(!modal)
    // const handleModalRole = () => setModalRole(!modalRole)
    const handleFilter = e => {
        const value = e.target.value
        setSearchValue(value)

        const payload = {
            field: "search",
            query: value,
            page: parPage,
            limit: rowsPerPage,
            sortingName: sortName,
            sortingValue: sortValue,
            sort: `${sortName}${sortValue}`,
            filter: JSON.stringify([filter]),
            fromDate: moment(dueDate).format('MM-DD-YYYY 00:00'),
            toDate: moment(toDate).format('MM-DD-YYYY 23:59'),
            ulbId: localStorage.getItem("ulbid"),
            operatorId: "",
            searchByFields: searchSelect
        }
        dispatch(getDataReportsdata(payload))
    }
    // ** Function to handle per page
    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setParPage(1)
        setCurrentPage(0)
        const payload = {
            field: "all",
            sortingName: sortName,
            sort: `${sortName}${sortValue}`,
            sortingValue: sortValue,
            filter: JSON.stringify([filter]),
            query: searchValue,
            fromDate: moment(dueDate).format('MM-DD-YYYY 00:00'),
            toDate: moment(toDate).format('MM-DD-YYYY 23:59'),
            ulbId: localStorage.getItem("ulbid"),
            operatorId: "",
            searchByFields: searchSelect,
            page: 1,
            limit: parseInt(e.target.value)

        }
        dispatch(getDataReportsdata(payload))
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
        setParPage(page.selected + 1)
        const payload = {
            field: "all",
            sortingName: sortName,
            sort: `${sortName}${sortValue}`,
            sortingValue: sortValue,
            filter: JSON.stringify([filter]),
            query: searchValue,
            fromDate: moment(dueDate).format('MM-DD-YYYY 00:00'),
            toDate: moment(toDate).format('MM-DD-YYYY 23:59'),
            ulbId: localStorage.getItem("ulbid"),
            operatorId: "",
            searchByFields: searchSelect,
            page: page.selected + 1,
            limit: rowsPerPage
        }
        dispatch(getDataReportsdata(payload))
    }
    const handleSort = (sortBy) => {
        let value
        if (sortName === sortBy.accessor) {
            value = (sortValue === '-desc') ? '-asc' : '-desc'
            setSortName(sortBy.accessor)
            setSortValue(value)
        } else {
            setSortName(sortBy.accessor)
            setSortValue('-desc')
            value = '-desc'
        }
        setCurrentSortId(sortBy.accessor)
        const payload = {
            field: "sorting",
            page: parPage,
            limit: rowsPerPage,
            sortingName: sortName,
            sort: `${sortBy.accessor}${value}`,
            sortingValue: sortValue,
            filter: JSON.stringify([filter]),
            query: searchValue,
            fromDate: moment(dueDate).format('MM-DD-YYYY 00:00'),
            toDate: moment(toDate).format('MM-DD-YYYY 23:59'),
            ulbId: localStorage.getItem("ulbid"),
            operatorId: "",
            searchByFields: searchSelect
        }
        dispatch(getDataReportsdata(payload))
    }
    const handleSearchSelect = (e) => {
        setSearchSelect(e.target.value)

    }
    const handleDateFilter = () => {
        const payload = {
            field: "all",
            page: parPage,
            limit: rowsPerPage,
            sortingName: sortName,
            sortingValue: sortValue,
            sort: `${sortName}${sortValue}`,
            filter: JSON.stringify([filter]),
            query: searchValue,
            fromDate: moment(dueDate).format('MM-DD-YYYY 00:00'),
            toDate: moment(toDate).format('MM-DD-YYYY 23:59'),
            ulbId: localStorage.getItem("ulbid"),
            operatorId: "",
            searchByFields: searchSelect
        }
        dispatch(getDataReportsdata(payload))

        setFilter({ wardNumber: '', operatorName: '', truckRegistrationNumber: '', propertyTypeName: '' })
    }
    useEffect(() => {
        dispatch(getDataReportHeader())
        const payload = {
            field: "all",
            page: parPage,
            limit: rowsPerPage,
            sortingName: sortName,
            sort: `${sortName}${sortValue}`,
            sortingValue: sortValue,
            filter: JSON.stringify([filter]),
            query: searchValue,
            fromDate: moment(dueDate).format('MM-DD-YYYY 00:00'),
            toDate: moment(toDate).format('MM-DD-YYYY 23:59'),
            ulbId: localStorage.getItem("ulbid"),
            operatorId: "",
            searchByFields: searchSelect
        }
        dispatch(getDataReportsdata(payload))
    }, [])
    const store = useSelector((state) => state)
    const columns = store.DataReport ? store.DataReport.dataReportHeaderData : []
    const dataReportsStore = store.DataReport.dataRepotsData ? store.DataReport.dataRepotsData.data ? store.DataReport.dataRepotsData.data.data ? store.DataReport.dataRepotsData.data.data.loads : [] : [] : []
    const lengthUlb = store.DataReport.dataRepotsData ? store.DataReport.dataRepotsData.data ? store.DataReport.dataRepotsData.data.totalCount : 0 : 0
    const count = Math.ceil(lengthUlb / rowsPerPage)

    const handleSelect = id => {
        const selectedRowsArr = selectedRows
        if (!selectedRowsArr.includes(id)) {
            selectedRowsArr.push(id)
        } else if (selectedRowsArr.includes(id)) {
            selectedRowsArr.splice(selectedRowsArr.indexOf(id), 1)
        } else {
            return null
        }
        setSelectedRows([...selectedRowsArr])
    }

    const handleSelectAll = () => {
        let selectedRowsArr = selectedRows
        if (selectedRowsArr.length < dataReportsStore.length) {
            const ids = dataReportsStore.map(i => i.id)
            selectedRowsArr = ids
        } else if (selectedRowsArr.length === dataReportsStore.length) {
            selectedRowsArr = []
        } else {
            return null
        }

        setSelectedRows(selectedRowsArr)
    }
    //** Function to handle Export 
    const handleExport = () => {
        const payload = {
            page: parPage,
            limit: rowsPerPage,
            sortingName: sortName,
            sortingValue: sortValue,
            sort: `${sortName}${sortValue}`,
            filter: JSON.stringify([filter]),
            query: searchValue,
            fromDate: moment(dueDate).format('MM-DD-YYYY 00:00'),
            toDate: moment(toDate).format('MM-DD-YYYY 23:59'),
            ulbId: localStorage.getItem("ulbid"),
            selectedLoadId: selectedRows.length === 0 ? "" : JSON.stringify(selectedRows),
            operatorId: "",
            searchByFields: searchSelect
        }
        dispatch(getExportFile(payload))
    }
    return (
        <div>
            <Fragment>
                <Breadcrumbs title={t('dataReport')} data={[{ title: 'DataReports' }, { title: `${t('dataReport')}` }]} />
            </Fragment>

            <Card>
                <CardHeader className='flex flex-column align-items-end border-bottom'>
                    <Row className="align-items-center">
                        <Col className='d-flex align-items-end s-mt-1' sm='4'>
                        <div className='d-flex align-items-center'>
                            <Input
                                className='dataTable-select'
                                type='select'
                                id='sort-select'
                                value={searchSelect}
                                style={{ width: "100px", padding: '5%' }}
                                onChange={e => handleSearchSelect(e)}
                            >
                                <option value={"selected"}>{t('select')}</option>
                                    <option value={"propertySelected"}>{t('ByLandmark')}</option>
                                    <option value={"requestSelected"}>{t('byReqId')}</option>
                            </Input>
                        </div>

                        <InputGroup className=''>
                            <InputGroupText>
                                <Search size={14} />
                            </InputGroupText>
                            <Input
                                className='dataTable-filter mb-40'
                                type='text'
                                bsSize='sm'
                                placeholder={searchSelect === "selected" ? `${t('searchby')}` : searchSelect === "propertySelected" ? `${t('SearchbyLandMark')}` : searchSelect === "propertyTypeSelected" ? `${t("searchbyPropType")}` : searchSelect === "requestSelected" ? `${t('SearchbyRequestId')}` : ""}
                                id='search-input'
                                disabled={searchSelect === "selected"}
                                value={searchValue}
                                onChange={handleFilter}
                            />
                        </InputGroup>
                        </Col>
                        <Col className='d-flex align-items-end' sm='8'>

                        <Flatpickr
                                id='due-date'
                                name='due-date'
                                className='form-control'
                                onChange={date => setDueDate(date[0])}
                                value={dueDate}
                                style={{ width: '50%' }}
                                options={{ dateFormat: 'd M Y' }}
                            />
                            {/* </Col> */}
                            <span className="align-items-center" style={{ marginBottom: "8px" }}>{t('To')}</span>
                       
                            <Flatpickr
                                id='to-date'
                                name='to-Date'
                                className='form-control'
                                onChange={date => setToDate(date[0])}
                                value={toDate}
                                style={{ width: '50%' }}
                                min={moment(new Date()).format("DD MMM YY")}
                                options={{ dateFormat: 'd M Y' }}
                            />
                            {/* </Col> */}
                            {/* <Col className='d-flex align-items-center ' sm='2'> */}
                            <Button className='ms-2' style={{width:"35%"}} color='success' onClick={handleDateFilter}>
                                <span className='align-middle'>{t('filter')}</span>
                            </Button>
                            {/* </Col> */}
                            {/* <Col className='' sm='2'> */}
                            <Button className='ms-2' style={{width:"40%"}}  color='success' onClick={handleExport}>
                                <span className='align-middle'>{t('export')}</span>
                            </Button>
                        </Col>
                    </Row>
                </CardHeader>

                <div className='react-dataTable'>
                    <Table responsive>
                        <thead>
                            <tr>
                                {columns.length !== 0 ? columns.map((item, index) => {
                                    if (item.accessor === "checkbox") {
                                        return <div className="form-check mx-1">
                    
                                            <Input
                                                type='checkbox'
                                                id='select-all'
                                                label=''
                                                checked={!!selectedRows.length}
                                                onChange={() => handleSelectAll()}
                                            /></div>
                                    }
                                    return <th key={index} scope='col' className='text-nowrap'
                                    >
                                        {item.header}
                                        {item.header === "Action" ? "" : <> {currentSortId === item.accessor && sortValue === "-asc" ? (<ChevronUp onClick={() => handleSort(item)} />) : (<ChevronDown onClick={() => handleSort(item)} />)}</>}
                                    </th>
                                }) : []}
                            </tr>

                        </thead>
                        <tbody>

                            {!!dataReportsStore && dataReportsStore.length !== 0 ? dataReportsStore.map((val, i) => {
                                return <tr key={i}>{
                                    columns.map((accesser, h) => {
                                        switch (accesser.accessor) {
                                            case "checkbox":
                                                return <div className="form-check mx-1"> <Input
                                                    id={val.loadId}
                                                    type='checkbox'
                                                    onChange={() => handleSelect(val.id)}
                                                    checked={!!selectedRows.includes(val.id)}
                                                /></div>
                                            case "updatedAt":
                                                return val["updatedAt"] === null ? "_" : <td key={h}>{moment(val["updatedAt"]).format("MMM Do YY")}</td>
                                            case "collectionsPhoto":
                                                return val["collectionsPhoto"] === null || val["collectionsPhoto"] === "null" ? <td>_</td> : <td><a href={`${val["collectionsPhoto"]}`}>{t('View')}</a></td>
                                            default:
                                                return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null || val[accesser.accessor] === "null" ? "_" : val[accesser.accessor]}</td>
                                        }
                                    })
                                }
                                </tr>
                            }) : <div className="d-flex">Data not Exist</div>}
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
            {/* <AddUser open={modal} handleModal={handleModal} />
            <RoleListing open={modalRole} handleModal={handleModalRole} /> */}
        </div>
    )
}

export default (withTranslation()(Reports))
