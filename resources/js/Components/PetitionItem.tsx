import React, { FC, useEffect, useState } from 'react'
import style from '../../css/PetitionItem.module.css'
import axios from 'axios';
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import cn from 'classnames';

interface IPetition {
    index: number;
    name: string;
    author: number;
    created_at: Date;
    updated_at: number;
    userName: string;
    status: number;
}

export const PetitionItem: FC<IPetition> = ({name, author, created_at, updated_at, index, userName, status}) => {
    

    const time = moment(Number(created_at) *1000)
    console.log(status)
    let statusName = ''
    let statusClass = ''

    if(status === 1) {
        statusName = 'Draft'
        statusClass = 'style.black'
    }

    if(status === 2) {
        statusName = 'Unmoderated'
        statusClass = 'style.yellow'
    }
    
    if(status === 3) {
        statusName = 'Active'
        statusClass = 'style.blue'
    }

    if(status === 4) {
        statusName = 'Declined'
        statusClass = 'style.red'
    }

    if(status === 5) {
        statusName = 'Supported'
        statusClass = 'style.green'
    }

    if(status === 6) {
        statusName = 'Unsupported'
        statusClass = 'style.red'
    }

    if(status === 7) {
        statusName = 'Awaiting answer'
        statusClass = 'style.yellow'
    }

    if(status === 8) {
        statusName = 'Positive answer'
        statusClass = 'style.green'
    }

    if(status === 9) {
        statusName = 'Negative answer'
        statusClass = 'style.red'
    }


    // switch(status) {
    //     case 1:
    //         statusName = 'Draft'
    //         statusClass = 'style.black'
    //     case 2:
    //         statusName = 'Unmoderated'
    //         statusClass = 'style.yellow'
    //     case 3:
    //         statusName = 'Active'
    //         statusClass = 'style.black'
    //     default:
    //         statusName = 'Default'
    // }
 
  return (
    <div className="py-3">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className={style.petitionBox}> 

                        <div className={style.petitionInnerBox}>
                            <span className={style.petitionText}>{index-1}. {name}</span>
                            <span className={eval(statusClass)}>{statusName}</span>
                        </div>
                        
                        
                        <div className={style.petitionInnerBox}>
                            <span className={style.petitionText}>Created: {time.format(dateFormat)}</span>
                            <span className={style.petitionText}>Created by: {userName}</span>
                        </div>
                            
                       
                    </div>
                </div>
            </div>
  )
}
