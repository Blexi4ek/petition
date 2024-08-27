import React, { FC } from 'react'
import style from './StatusButton.module.css'

interface IStatusButtonProp {
    status: {
        label: string,
        value: number,
        buttonClass: string,
        activeButtonClass: string
    }
    clickEvent: (statusId: number) => void
    activeStatus: number[] | undefined
    first: boolean
    last: boolean
}

export const StatusButton: FC<IStatusButtonProp> = ({status, clickEvent, activeStatus, first, last}) => {

  return (
    <span className={style.box}>
        <button className={`${style.button} ${eval(status.buttonClass)}  ${activeStatus?.includes(status.value)? eval(status.activeButtonClass) : ''}
        ${first ? style.first : ''} ${last ? style.last : ''}`}
        onClick={() => clickEvent(status.value)}>
            {status.label}
        </button>
    </span>
    
  )
}
