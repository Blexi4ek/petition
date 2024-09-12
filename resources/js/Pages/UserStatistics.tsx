import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Role, User } from '@/types'
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import style from '../../css/UserStatistic.module.css'
import { PetitionButton } from '@/Components/Button/PetitionButton';
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import ReactPaginate from 'react-paginate';

interface IStats {
    createdCount: number
    moderatedCount: number
    respondedCount: number
    signedCount: number
    user: User
}

export default function UserStatistics ({ auth }: PageProps)  {

    const queryParams = new URLSearchParams(window.location.search)
    const queryId = queryParams.get('id')

    const [stats, setStats] = useState<IStats>()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios('/api/v1/petitions/users/statistics', {params: {id: queryId}})
                setStats(response.data)
            } catch (e) {
                router.get('/petitions')
            }
        }
        fetchStats()
    },[])
    
return (
    <AuthenticatedLayout 
        user={auth.user}
        permissions={auth.permissions}
        header={<h1 className="font-semibold text-xl text-gray-800 leading-tight">{`${stats?.user.name}'s statistic`}</h1>}>

    <Head title = {`User statistic`}/>

    

    <div style={{padding: '50px'}}>
        <div className={style.statisticBox}>
            Created petitions: {stats? stats.createdCount : 0}<br/>
            Signed petitions: {stats? stats.signedCount : 0}<br/>
            Moderated petitions: {stats? stats.moderatedCount : 0}<br/>
            Responsded petitions: {stats? stats.respondedCount : 0}
        </div>
    </div>

    </AuthenticatedLayout>
)
}
