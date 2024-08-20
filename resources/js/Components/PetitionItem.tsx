import React, { FC, useEffect, useState } from 'react'
import style from '../../css/PetitionItem.module.css'
import axios from 'axios';
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import cn from 'classnames';
import petitionStatuses from '../consts/petitionStatuses';
import { router } from '@inertiajs/react';

interface IPetition {
    id: number;
    name: string;
    author: number;
    created_at: Date;
    updated_at: number;
    userName: string;
    status: number;
    refresh: () => void;
}

export const PetitionItem: FC<IPetition> = ({name, author, created_at, updated_at, userName, status, id, refresh}) => {

    const openPetition = () => {
        console.log(id)
        router.get('petitions/view', {id})
    }

    const deletePetition = async () => {
        let answer = confirm(`Are you sure you want to delete petition "${name}"?`);
        let response
        if (answer) response = await axios({method: 'delete', url: '/api/v1/petitions/delete', params: { id }})
        if (response) 
        {
            alert('petition was deleted')
            refresh()
        }
    }
    

    const time = moment(Number(created_at) * 1000)
    let statusName = ''
    let statusClass = ''
    return (
        <div className="py-3">
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className={style.petitionBox}> 

                    <div className={style.petitionInnerBox}>
                        <span className={style.petitionText}>{name}</span>
                        <span className={eval(petitionStatuses.find(o => o.value === status)?.statusClass || '')}>{petitionStatuses.find(o => o.value === status)?.label}</span>
                    </div>                        
                        
                    <div className={style.petitionInnerBox}>
                        <span className={style.petitionText}>{time.format(dateFormat)}</span>
                        <span className={style.petitionText}>Author: {userName}</span>
                        <button className={style.petitionButton} onClick={e => openPetition()}>Open</button>
                        <button className={style.petitionButtonRed} onClick={e => deletePetition()}>Delete</button>
                    </div>

                    

                </div>
            </div>
        </div>
    )
}
