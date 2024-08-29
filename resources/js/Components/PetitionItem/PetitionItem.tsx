import React, { FC, useState } from 'react'
import style from './PetitionItem.module.css'
import axios from 'axios';
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import { router } from '@inertiajs/react';
import { IPetitionStaticProperties, IPetitionStatus } from '@/api/usePetitionStaticProperties';

interface IPetitionProp {
    petition: IPetition
    refresh: () => void;
    status?: IPetitionStatus;
    properties: IPetitionStaticProperties | undefined
}

export const PetitionItem: FC<IPetitionProp> = ({petition, refresh, status, properties}) => {

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

    const handleSignButton = async () => {
        await axios('/api/v1/petitions/sign', {method:'post' ,params: {petition_id: petition.id}})
        refresh()
    }
    

    const time = moment(Number(petition.created_at) * 1000)

    return (
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className={style.petitionBox}> 

                    <div className={style.petitionInnerBox}>
                        <span style={{marginLeft: '20px'}} className={eval(status?.[petition.status]?.statusClass || '')}>{status?.[petition.status]?.label}</span>
                        <span className={style.petitionText}>{petition.name}</span>         
                    </div>                        
                        
                    <div className={style.petitionInnerInfoBox}>

                        <progress max={properties?.minimum_signs} value={petition.user_petitions.length} style={{width: '500px'}}/> ({petition.user_petitions.length})

                        <span className={style.petitionText}>{time.format(dateFormat)}</span>
                        <span className={style.petitionText}>Author: {petition.user_creator.name}</span>

                        <div className={style.petitionButtonBox}>
                            {petition? (petition.signId) ?
                                <button disabled className={style.petitionButtonLightGreen}>
                                    Signed
                                </button> :

                                (properties?.signButton.includes(petition.status)) ?
                                <button className={style.petitionButtonBlue} onClick={handleSignButton}>
                                    Sign
                                </button>                 
                                : '' : ''
                            }

                            <button className={style.petitionButton} onClick={e => openPetition()}>Open</button>
                            <button className={style.petitionButtonRed} onClick={e => deletePetition()}>Delete</button>
                        </div>
                    </div>

                </div>
            </div>
    )
}
