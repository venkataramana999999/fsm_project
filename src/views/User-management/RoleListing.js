// ** React Imports
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useForm, Controller } from 'react-hook-form'
// import { useForm, Controller } from 'react-hook-form'
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Row, Col, FormFeedback, Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
// ** Styles
import { MoreVertical, Edit, FileText, Archive, Trash, X } from 'react-feather'
// ** Reactstrap Imports
import moment from "moment"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { getRoleList, getRoleDelete } from "../../redux/UserRedx"
import { withTranslation } from 'react-i18next'

const RoleListing = ({ open, handleModal, t }) => {
    // ** State
    const [modal, setModal] = useState(false)
    const [roleAccessEdit, setRoleAccessEdit] = useState("")
    const [RoleName, setRoleName] = useState("")
    // const handleModal = () => setModal(!modal)
    const handleEditRole = (rooleId, accessData, role) => {
        console.log(rooleId)
        switch ((accessData !== undefined && accessData === true) || (accessData !== null && accessData === true)) {

            case !!accessData && accessData["IsMobileAppAccess"] === true && accessData["IsWebAppAccess"] === false:
                setRoleAccessEdit("app")
                setRoleName(role)
                setModal(!modal)
                break
            case accessData["IsWebAppAccess"] === true && accessData["IsMobileAppAccess"] === false:
                setRoleAccessEdit("web")
                setRoleName(role)
                setModal(!modal)
                break

            case accessData["IsWebAppAccess"] === true && accessData["IsMobileAppAccess"] === true:
                setRoleAccessEdit("both")
                setModal(!modal)
                setRoleName(role)

                break
            default:
                setRoleAccessEdit("")
                setRoleName("")
                break
        }
    }
    const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />
    const CloseBtnRoleEdit = <X className='cursor-pointer' size={15} onClick={handleEditRole} />
    const dispatch = useDispatch()

    const headers = [
        { id: 1, header: 'Sr No', accessor: 'id' },
        { id: 2, header: 'Role', accessor: 'name' },
        { id: 3, header: "Access Mode", accessor: "accessMode" },
        // { id: 4, header: "Access Modules", accessor: "accessModules" },
        { id: 5, header: 'Updated Date', accessor: 'updatedAt' },
        { id: 6, header: 'Action', accessor: 'actionButton' }

    ]
    const handleDelete = (roleId) => {
        // console.log(roleId, "idddd")
        const payload = {
            id: roleId
        }
        dispatch(getRoleDelete(payload))
    }
    const changeRoleAccess = (e) => {
        switch (e.target.value) {
            case "web":
                setRoleAccessEdit(e.target.value)
                break
            case "app":
                setRoleAccessEdit(e.target.value)
                break
            case "both":
                setRoleAccessEdit(e.target.value)
                break
            default:
                break
        }
    }
    const defaultValues = {
        RoleName: ''
    }
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues })
    const onSubmit = data => {
        console.log(data, "datarole")
        console.log(roleAccessEdit, "roleAccessEdit")
    }

    useEffect(() => {
        const payload = {
            field: "all",
            query: "",
            sortingName: "",
            sortingValue: "",
            page: 1,
            limit: 10
        }
        dispatch(getRoleList(payload))
    }, [])

    const store = useSelector((state) => state)
    const RoleStore = store.UserRedx.RoleList ? store.UserRedx.RoleList.data ? store.UserRedx.RoleList.data.data : [] : []
    return (
        <div>
            <Modal
                isOpen={open}
                toggle={handleModal}
                className='modal-dialog-centered modal-xl'
                backdrop="static"
            >
                <ModalHeader toggle={handleModal} close={CloseBtn} tag='div' className='bg-transparent'>
                </ModalHeader>
                <ModalBody className=''>
                    <div className='text-center mb-2'>
                        <h3 className='mb-1'>{t('RoleManagement')}</h3>
                        <div className='react-dataTable'>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        {headers.length !== 0 ? headers.map((item, index) => {
                                            return <th key={index} scope='col' className='text-nowrap'>
                                                {item.header}
                                                {/* {currentSortId === item.accessor && sortValue === "asc" ? (<ChevronUp onClick={(e) => handleSort(e, item)} />) : (<ChevronDown onClick={(e) => handleSort(e, item)} />)} */}

                                            </th>
                                        }) : []}
                                    </tr>

                                </thead>
                                <tbody>
                                    {!!RoleStore && RoleStore.length !== 0 ? RoleStore.map((val, i) => {
                                        return <tr key={i}>{
                                            headers.map((accesser, h) => {
                                                // console.log(accesser.accessor, "accesser.accessor")
                                                switch (accesser.accessor) {
                                                    case "updatedAt":
                                                        return val["updatedAt"] === null ? "_" : <td key={h}>{moment(val["updatedAt"]).format("DD-MMM-YYYY hh:mm a")}</td>
                                                    case "accessMode":
                                                        switch (true) {
                                                            case val.isRoleAccess.IsWebAppAccess === true && val.isRoleAccess.IsMobileAppAccess === true:
                                                                return <td key={h} className='text-nowrap'> Web | App</td>
                                                            case val.isRoleAccess.IsWebAppAccess:
                                                                return <td key={h} className='text-nowrap'> Web</td>
                                                            case val.isRoleAccess.IsMobileAppAccess:
                                                                return <td key={h} className='text-nowrap'> App</td>

                                                            default:
                                                                return <td key={h} className='text-nowrap'>Both </td>

                                                        }
                                                    // case "accessModules":
                                                    //     return <td></td>

                                                    case "actionButton":
                                                        return <div className='d-flex align-items-center justify-content-center'>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle className='pe-1' tag='span'>
                                                                    <MoreVertical size={15} />
                                                                </DropdownToggle>
                                                                <DropdownMenu end>
                                                                    <DropdownItem>
                                                                        <FileText size={15} />
                                                                        <span className='align-middle ms-50' onClick={() => handleEditRole(val.roleId, val.isRoleAccess, val.name)}>{t('edit')}</span>
                                                                    </DropdownItem>
                                                                    <DropdownItem>
                                                                        <Trash size={15} />
                                                                        <span className='align-middle ms-50' onClick={() => handleDelete(val.roleId)}>{t('delete')}</span>
                                                                    </DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                            {/* <Edit size={15} /> */}
                                                        </div>
                                                    default:
                                                        return <td key={h} className='text-nowrap'>{val[accesser.accessor] === null || val[accesser.accessor] === "null" ? "_" : val[accesser.accessor]}</td>
                                                }
                                            })
                                        }
                                        </tr>
                                    }) : []}
                                </tbody>
                            </Table>
                        </div>

                    </div>

                </ModalBody>
            </Modal>


            <Modal
                isOpen={modal}
                toggle={handleEditRole}
                className='modal-dialog-centered modal-md'
                backdrop="static"
            >
                <ModalHeader toggle={handleEditRole} close={CloseBtnRoleEdit} tag='div' className='bg-transparent'>
                </ModalHeader>
                <ModalBody className=''>
                    <div className='text-center mb-2'>
                        <h3 className='mb-1'>{t('editRole')}</h3>
                    </div>

                    <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='RoleName'>
                                {t('roleName')}
                            </Label>
                            <Controller
                                control={control}
                                name='RoleName'
                                render={({ field }) => {
                                    if (field.value === "") {
                                        field.value = RoleName
                                    }
                                    return (
                                        <Input
                                            {...field}
                                            id='RoleName'
                                            placeholder='Enter role name'
                                            value={field.value}
                                            invalid={errors.RoleName && true}
                                        />
                                    )
                                }}
                            />
                            {errors.RoleName && <FormFeedback>{t('EnterRoleName')} </FormFeedback>}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className='form-label' for='roleAccessEdit'>
                               {t('accessMode')}
                            </Label>
                            <Input type='select' name='roleAccessEdit' id='roleAccessEdit' onChange={e => changeRoleAccess(e)}>
                                <option value={"web"}>{"Web"}</option>
                                <option value={"app"}>{"Mobile Application"}</option>
                                <option value={"both"}>{"Both"}</option>

                            </Input>
                        </Col>


                        <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='reset' className='me-1'  color='secondary' outline onClick={handleEditRole}>
                                {t('cancel')}
                            </Button>
                            <Button type='submit' color='primary'>
                                {t('saveChange')}
                            </Button>
                           
                        </Col>
                    </Row>

                </ModalBody>
            </Modal>
        </div>

    )
}

export default (withTranslation()(RoleListing))