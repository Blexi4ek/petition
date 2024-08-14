import React, { FC } from 'react'
import style from '../../css/PetitionItem.module.css'

interface IPetition {
    name: string;
    author: number;
    created_at: number;
    updated_at: number;
}

export const PetitionItem: FC<IPetition> = ({name, author, created_at, updated_at}) => {
    
  return (
    <div className="py-5">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className={style.petitionBox}> 
                        <span className="p-6 text-gray-900">{name}</span>
                        <span className="p-6 text-gray-900">Created by id: {author}</span>
                    </div>
                </div>
            </div>
  )
}
