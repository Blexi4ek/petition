import React, { FC } from 'react'

interface IStatusButtonProp {
    status: {
        label: string,
        value: number,
        
    }
}

export const StatusButton: FC<IStatusButtonProp> = (status) => {

  return (
    <button>
        StatusButton
    </button>
  )
}
