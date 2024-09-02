import axios from 'axios';
import { resolve } from 'path';
import React, { FC, useEffect, useState } from 'react'
import { ActionMeta, PropsValue } from 'react-select';
import AsyncSelect from 'react-select/async';

interface ISearchMultiSelectProp {
  onChange: (option: readonly UserOption[], actionMeta: ActionMeta<UserOption>) => void
}

const fetchUsers = async (inputValue: string) => {
    const response = await axios.get('/api/v1/petitions/searchUser', {params: {input:inputValue}})
    let users: UserResponse[] = response.data
    let optionUsers: UserOption[] = []
    users.map(item => optionUsers.push({label: item.name, value: item.id}))

    return optionUsers
}

const loadOptions = (inputValue: string, callback: (options: UserOption[]) => void) => {
    fetchUsers(inputValue).then(options => {
      callback(options)
    })
}


export const SearchMultiSelect: FC<ISearchMultiSelectProp> = ({onChange}) => {

  return (
    <div>
        <AsyncSelect cacheOptions isMulti loadOptions={loadOptions} onChange={onChange}/>
    </div>
  )
}
