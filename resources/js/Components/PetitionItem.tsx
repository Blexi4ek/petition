import React, { FC, useEffect, useState } from 'react'
import style from '../../css/PetitionItem.module.css'
import axios from 'axios';
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import cn from 'classnames';
import petitionStatuses from '../consts/petitionStatuses';

interface IPetition {
    name: string;
    author: number;
    created_at: Date;
    updated_at: number;
    userName: string;
    status: number;
}

export const PetitionItem: FC<IPetition> = ({name, author, created_at, updated_at, userName, status}) => {
    

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
                    </div>

                </div>
            </div>
        </div>
    )
}
