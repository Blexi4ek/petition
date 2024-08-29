import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import ReactPaginate from 'react-paginate';

import { PetitionItem } from '@/Components/PetitionItem/PetitionItem';
import style from '../../css/Petition.module.css'
import usePetitionStaticProperties, { getStatusOptions } from '@/api/usePetitionStaticProperties';
import { StatusButton } from '@/Components/StatusButton/StatusButton';
import { PetitionButton } from '@/Components/Button/PetitionButton';
import { SearchMultiSelect } from '@/Components/SearchMultiSelect/SearchMultiSelect';


export default function Petitions({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryPage = queryParams.get('page')
    const queryName = queryParams.get('name')
    const queryCreatedFrom = queryParams.get('createdFrom')
    const queryCreatedTo = queryParams.get('createdTo')
    const queryActivatedFrom = queryParams.get('activatedFrom')
    const queryActivatedTo = queryParams.get('activatedTo')
    const queryAnsweredFrom = queryParams.get('answeredFrom')
    const queryAnsweredTo = queryParams.get('answeredTo')

    let pageName = ''
    switch(window.location.pathname) {
        case '/petitions/my': pageName = 'status_my'; break
        case '/petitions/signs': pageName = 'status_signs'; break
        case '/petitions/moderated': pageName = 'status_moderated'; break
        case '/petitions/response': pageName = 'status_response'; break
        default: pageName = 'status_all'
    }
    

    const [petitions, setPetitions] = useState<IPetition[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [refresh, setRefresh] = useState(false)

    const [petitionOptions, setPetitionOptions] = useState<IPetitionOptions>({
        status: [],
        name: '',
        createdFrom: '',
        createdTo: '',
        activatedFrom: '',
        activatedTo: '',
        answeredFrom: '',
        answeredTo: ''})

    const properties = usePetitionStaticProperties()

    useEffect(()=> {
        if (queryPage) setPage(Number(queryPage))

        let queryStatus:number[] = []
        if (queryParams.getAll('status[0]')) {
            
            queryParams.forEach((value, key) => {
                if (key.includes('status')) queryStatus.push(Number(value))
            })
        }
        
        setPetitionOptions({status: queryStatus, name: queryName || '', createdFrom:queryCreatedFrom || '',
            createdTo:queryCreatedTo || '', activatedFrom:queryActivatedFrom || '', activatedTo:queryActivatedTo || '',
            answeredFrom: queryAnsweredFrom || '', answeredTo: queryAnsweredTo || ''
        })
        setRefresh(!refresh)
    },[])

    useEffect(()=> {
        const fetchPetitions = async () => {
            const {data: response} = await axios(`/api/v1${window.location.pathname}`, {params: {
                page, 
                petitionStatus:petitionOptions.status, 
                petitionQ:petitionOptions.name,
                petitionCreatedAtFrom:petitionOptions.createdFrom,
                petitionCreatedAtTo: petitionOptions.createdTo,
                petitionActivatedAtFrom: petitionOptions.activatedFrom,
                petitionActivatedAtTo: petitionOptions.activatedTo,
                petitionAnsweredFrom: petitionOptions.answeredFrom,
                petitionAnsweredTo: petitionOptions.answeredTo
            }});
            setTotalPages(response.last_page)
            setPetitions(response.data)
        }
        fetchPetitions()
    }, [page,refresh])
        
        const refreshPage = (options = petitionOptions, newPage: number = 1  ) => {
            setPage(newPage)
            if (newPage === 1) setRefresh(!refresh)
            setPetitionOptions(options)

            router.get(window.location.pathname, {page: newPage, status:options.status, name:options.name,
                createdFrom:options.createdFrom, createdTo:options.createdTo, activatedFrom:options.activatedFrom,
                activatedTo:options.activatedTo, answeredFrom:options.answeredFrom, answeredTo:options.answeredTo},
                {preserveState: true, preserveScroll: true})
        }

        const handlePageClick = (e : any) => {   
            refreshPage(petitionOptions, e.selected+1)  
        }

        const handleStatusChange = (statusId: number) => {
            let newArr = petitionOptions.status
            if (petitionOptions.status?.includes(statusId)) newArr = newArr?.filter(item => item !== statusId)
            else newArr?.push(statusId) 
            refreshPage({...petitionOptions ,status: newArr})
        }

        const handleinputPetitionQChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , name: e.target.value})   
        }

        const handleCreatedFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , createdFrom: e.target.value})  
        }

        const handleCreatedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , createdTo: e.target.value})  
        }

        const handleActivatedFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , activatedFrom: e.target.value})  
        }

        const handleActivatedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , activatedTo: e.target.value})    
        }

        const handleAnsweredFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , answeredFrom: e.target.value})  
        }

        const handleAnsweredToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , answeredTo: e.target.value})    
        }

        const clickCheck = () => {
            console.log(auth);
        }

        const handleRefresh = () => {
            setRefresh(!refresh)
        }
    


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <span style={{marginRight: '50px'}}>Petitions</span>
                    <PetitionButton text={'Create new petition'} onClick={() => router.get('/petitions/edit')}/>
                </h2>
            }
        >
            <Head title="Petitions" />

            <div className={style.topBox}>

            <button onClick={()=> clickCheck()}>
                console check
            </button>

            <div className={style.statusBox}>

                <input value={petitionOptions.name} onChange={e => handleinputPetitionQChange(e)} placeholder='Search by name'/>

                <div>
                    {properties?.pages_dropdown[auth.user.role_id][pageName].map((item, index, arr) => <StatusButton status={properties.status[item]} key={index}
                    activeStatus={petitionOptions.status} clickEvent={(statusId) => handleStatusChange(statusId)} 
                    first={index === 0 ? true : false} last={index === arr.length-1 ? true : false}/>)}
                </div>
                
            </div>

            <div className={style.optionBox}>
                <div className={style.chronoBox}>
                    <div className={style.chronoItem}>
                        Created {' '}
                        <input type='datetime-local' value={petitionOptions.createdFrom} onChange={e => handleCreatedFromChange(e)}/>
                        {' to '}
                        <input type='datetime-local' value={petitionOptions.createdTo} onChange={e => handleCreatedToChange(e)}/>
                    </div>

                    <div className={style.chronoItem}>
                        Activated {' '}
                        <input type='datetime-local' value={petitionOptions.activatedFrom} onChange={e => handleActivatedFromChange (e)}/>
                        {' to '}
                        <input type='datetime-local' value={petitionOptions.activatedTo} onChange={e => handleActivatedToChange (e)}/>
                    </div>

                    <div className={style.chronoItem}>
                        Answered {' '}
                        <input type='datetime-local' value={petitionOptions.answeredFrom} onChange={e => handleAnsweredFromChange (e)}/>
                        {' to '}
                        <input type='datetime-local' value={petitionOptions.answeredTo} onChange={e => handleAnsweredToChange (e)}/>
                    </div>

                </div>

                <div className={style.searchMultiSelectBox}>
                    <SearchMultiSelect/>
                </div>

                   

            </div>

            </div>

            {petitions.map((item) => <PetitionItem petition={item} status={properties?.status} properties={properties}
            key={item.id} refresh={() => handleRefresh()}/>)}

            <div
                style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 20,
                boxSizing: 'border-box',
                width: '100%',
                height: '100%',
            }}>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=" >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPages || 1}
                    previousLabel="< "
                    renderOnZeroPageCount={null}
                    containerClassName={style.pagination}
                    pageClassName={style.item}
                    activeClassName={style.active}
                    forcePage={(page || 1) - 1}
                />
            </div>
        </AuthenticatedLayout>
    );
}
