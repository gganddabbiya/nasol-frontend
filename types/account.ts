export interface AccountResponse {
    session_id: string;
    oauth_id: string;
    oauth_type: string;
    nickname: string;
    name: string;
    profile_image: string | null;
    email: string;
    phone_number: string | null;
    active_status: boolean;
    updated_at: string;
    created_at: string;
    role_id: number;
}

