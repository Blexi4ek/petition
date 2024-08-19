interface IPetition {      
    id: number;
    created_by: number;
    moderated_by: number;
    answered_by: number;
    title: string;
    description: string;
    status: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    moderating_started_at: Date;
    activated_at: Date;
    declined_at: Date;
    supported_at: Date;
    answering_started_at: Date;
    answered_at: Date;
    userName: string;
}

