import axios from 'axios';
import { resolve } from 'path';
import React from 'react'
import AsyncSelect from 'react-select/async';

interface UserResponse {
  name: string
}

interface UserOption {
  label: string;
  value: string;
}

const fetchUsers = async (inputValue: string) => {
  console.log('inputValue', inputValue)
    const response = await axios.get('/api/v1/petitions/searchUser', {params: {input:inputValue}})
    let users: UserResponse[] = response.data
    let optionUsers: UserOption[] = []
    users.map(item => optionUsers.push({label: item.name, value: item.name}))
    console.log('users', optionUsers)
    return optionUsers
}

const loadOptions = (inputValue: string, callback: (options: UserOption[]) => void) => {
    fetchUsers(inputValue).then(callback)
    }
;


export const SearchMultiSelect = () => {
  return (
    <div>
        <AsyncSelect cacheOptions isMulti loadOptions={loadOptions} />
    </div>
  )
}
