import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { CardElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import style from '../../css/Dashboard.module.css'
import { PetitionButton } from '@/Components/Button/PetitionButton';
import axios from 'axios';

export default function Dashboard({ auth }: PageProps) {
    
    const elements = useElements()
    const stripe = useStripe()

    const handleSubmit = async (e:any) => {
        e.preventDefault()
        let paymentMethod
        const cardElement = elements?.getElement(CardElement);
        if (cardElement) {
            paymentMethod = await stripe?.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
        }

        const response =  axios({method: 'post', url: '/api/v1/dashboard/create', params: { card:paymentMethod?.paymentMethod?.id }})
        console.log(response)

    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div> <br />
                    <form id="add-card-form" className={style.cardBox} onSubmit={handleSubmit}>
                        <CardElement />
                        <br />
                        <button>Add card</button>
                    </form>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
