import React, { FC } from 'react'
import style from './Button.module.css'

interface IPetitionButtonProp {
    text: string;
    onClick: () => void
}

export const PetitionButton: FC<IPetitionButtonProp> = ({text, onClick}) => {
    return (
        <button className={style.button} onClick={onClick}>
            {text}
        </button>
  )
}
