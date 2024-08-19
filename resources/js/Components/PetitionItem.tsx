import React, { FC, useEffect, useState } from 'react'
import style from '../../css/PetitionItem.module.css'
import axios from 'axios';

interface IPetition {
    index: number;
    name: string;
    author: number;
    created_at: Date;
    updated_at: number;
    userName: string;
}

export const PetitionItem: FC<IPetition> = ({name, author, created_at, updated_at, index, userName}) => {

    
  return (
    <div className="py-3">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className={style.petitionBox}> 
                        <span className={style.petitionText}>{index-1}. {name}</span>
                        
                        <div>
                            <span className={style.petitionText}>Created at: {created_at.toString()}</span>
                            <span className={style.petitionText}>Created by: {userName}</span>
                        </div>
                            
                       
                    </div>
                </div>
            </div>
  )
}
