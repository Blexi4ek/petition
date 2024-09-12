import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Role, User } from '@/types'
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import style from '../../css/UserList.module.css'
import { PetitionButton } from '@/Components/Button/PetitionButton';
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import ReactPaginate from 'react-paginate';

export default function UserList ({ auth }: PageProps)  {
    
    const [users, setUsers] = useState<User[]>([])
    const [userQ, setUserQ] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [roles, setRoles] = useState<Role[]>([])
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        if(!auth.permissions.map(item => item.name).includes('change role')) {
            router.get('/petitions')
        }
        const fetchRoles = async () => {
            const {data:response} = await axios('/api/v1/petitions/users/roles')
            setRoles(response)
        }
        fetchRoles()
    },[])

    useEffect(() => {
        const fetchUsers = async () => {
            const {data:response} = await axios('/api/v1/petitions/users', {params: {page, userQ}})
            setUsers(response.data)
            setTotalPages(response.last_page)
        }
        fetchUsers()
    },[page,refresh])

    const handleRoleChange = (role: string, id: number) => {
        const response = axios('/api/v1/petitions/users/roleChange', {params: {id, role}})
        setRefresh(!refresh)
    }

    const handleinputUserQChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserQ(e.target.value)
        setRefresh(!refresh)
    }


return (
    <AuthenticatedLayout 
        user={auth.user}
        permissions={auth.permissions}
        header={<h1 className="font-semibold text-xl text-gray-800 leading-tight">User list</h1>}>

    <Head title = 'User list'/>

    <div className={style.outerBox}>
    <h1 className={style.userHeader}>Users:</h1>
    <input value={userQ} onChange={handleinputUserQChange} placeholder='Search by name'/>
        <div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Email</th><th>Creation date</th><th>Roles</th>
                        </tr>
                    </thead>

                    { users?.map((user, index) => 
                        <tbody key={user.id} style={index % 2 === 1 ? {backgroundColor: 'lightgray'} : {backgroundColor: 'white'}}>
                            <tr>
                                <td >{user.id}. </td>
                                <td align='left'>
                                    {user.name}
                                </td>
                                <td align='left'>
                                    {user.email}
                                </td>
                                <td align='right'>{(moment(Number(user.created_at) * 1000)).format(dateFormat)}</td>
                                <td>
                                    {roles.map(role =>
                                        <span key={role.id} style={{marginLeft: '20px'}}>
                                            {role.name}
                                            <input type={'checkbox'} key={role.id} style={{marginLeft: '10px'}}
                                            checked = { user.user_roles?.map(userRole => userRole.id).includes(role.id)  } onChange={() => handleRoleChange(role.name ,user.id)} />
                                        </span> 
                                    )}
                                </td>
                                <td>
                                    <Link style={{marginLeft: '30px'}} href={route(`profile/statistics`, {id: user.id})}>Check user's statistic</Link>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
        </div>

        <div
                style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 20,
                boxSizing: 'border-box',
                width: '100%',
                height: '100%',
            }}>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=" >"
                    onPageChange={e => setPage(e.selected+1)}
                    pageRangeDisplayed={5}
                    pageCount={totalPages || 1}
                    previousLabel="< "
                    renderOnZeroPageCount={null}
                    containerClassName={style.pagination}
                    pageClassName={style.item}
                    activeClassName={style.active}
                    forcePage={(page || 1) - 1}
                />
            </div>
    </div>

    </AuthenticatedLayout>
)
}
