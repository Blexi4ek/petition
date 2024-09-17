export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role_id: number
    customer_id: string
    payment_method_id: string
    created_at: Date
    user_roles: Role[]
}

export interface Role {
    id: number
    name: string
}

export interface IPetitionStatus {
    [key: string]: {
        label: string,
        button: string,
        value: number,
        statusClass: string,
        buttonClass: string,
        activeButtonClass: string,
        children: number[],
        childrenAdmin: number[]
    }
}

export interface IPetitionStaticProperties {
    status: IPetitionStatus,
    userSearch:  {
        label: string,
        button: string,
        value: number,
        statusClass: string,
        buttonClass: string,
        activeButtonClass: string,
        children: number[],
        childrenAdmin: number[]
    } [],
    userSearchCondition: IPetitionStatus,
    pages_dropdown: {
        [key: number]: {
            [key: string]: number[];
        }
    }
    answer: number[],
    signButton: number[],
    editButton: number[],
    hasSigns: number[],
    minimum_signs: number,
    payment: {
        [key: number]: {
            label: string,
            value: number,
            class: string
        }
    }
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        permissions: {
            name: string
        } []
    };
    petitionSSR: IPetition,
    properties: IPetitionStaticProperties
};

