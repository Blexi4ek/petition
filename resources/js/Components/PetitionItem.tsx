import React, { FC, useState } from 'react'
import style from '../../css/PetitionItem.module.css'
import axios from 'axios';
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import { router } from '@inertiajs/react';
import { IPetitionStatus } from '@/api/usePetitionStaticProperties';

interface IPetitionProp {
    petition: IPetition
    refresh: () => void;
    status?: IPetitionStatus;
}

export const PetitionItem: FC<IPetitionProp> = ({petition, refresh, status}) => {

    const openPetition = () => {
        if (window.location.pathname.length <= 10) router.get('/petitions/view', {id: petition.id})
        else router.get('view', {id: petition.id})
    }

    const deletePetition = async () => {
        let answer = confirm(`Are you sure you want to delete petition "${petition.name}"?`);
        let response
        if (answer) response = await axios({method: 'delete', url: '/api/v1/petitions/delete', params: { id: petition.id }})
        if (response) 
        {
            alert('petition was deleted')
            refresh()
        }
    }
    

    const time = moment(Number(petition.created_at) * 1000)

    return (
        <div className="py-3">
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className={style.petitionBox}> 

                    <div className={style.petitionInnerBox}>
                        <span className={style.petitionText}>{petition.name}</span>
                        <span className={eval(status?.[petition.status]?.statusClass || '')}>{status?.[petition.status]?.label}</span>
                    </div>                        
                        
                    <div className={style.petitionInnerBox}>
                        <span className={style.petitionText}>{time.format(dateFormat)}</span>
                        <span className={style.petitionText}>Author: {petition.user_creator.name}</span>
                        <button className={style.petitionButton} onClick={e => openPetition()}>Open</button>
                        <button className={style.petitionButtonRed} onClick={e => deletePetition()}>Delete</button>
                    </div>

                </div>
            </div>
        </div>
    )
}
