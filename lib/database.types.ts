/**
 * SUPABASE DATABASE TYPES
 * Type definitions cho các bảng trong Supabase Database
 * Matching với Project interface trong types.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: string;
                    name: string;
                    type: 'LOAN' | 'CREDIT_CARD';
                    logo: string;
                    cover_image: string;
                    limit_amount: string;
                    interest_rate: string;
                    interest_free_period: string | null;
                    description: string;
                    advantages: string[];
                    promo: string;
                    affiliate_link: string;
                    referral_code: string | null;
                    tutorial_video_url: string | null;
                    tutorial_file_url: string | null;
                    eligibility: string[];
                    bank_phone: string | null;
                    bank_website: string | null;
                    bank_intro: string | null;
                    payment_channels: string[] | null;
                    steps: {
                        title: string;
                        description: string;
                        image: string;
                    }[];
                    status: 'Published' | 'Draft';
                    order_index: number;
                    rating: number | null;
                    user_count: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    type: 'LOAN' | 'CREDIT_CARD';
                    logo: string;
                    cover_image: string;
                    limit_amount: string;
                    interest_rate: string;
                    interest_free_period?: string | null;
                    description: string;
                    advantages: string[];
                    promo: string;
                    affiliate_link: string;
                    referral_code?: string | null;
                    tutorial_video_url?: string | null;
                    tutorial_file_url?: string | null;
                    eligibility: string[];
                    bank_phone?: string | null;
                    bank_website?: string | null;
                    bank_intro?: string | null;
                    payment_channels?: string[] | null;
                    steps: {
                        title: string;
                        description: string;
                        image: string;
                    }[];
                    status?: 'Published' | 'Draft';
                    order_index?: number;
                    rating?: number | null;
                    user_count?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    type?: 'LOAN' | 'CREDIT_CARD';
                    logo?: string;
                    cover_image?: string;
                    limit_amount?: string;
                    interest_rate?: string;
                    interest_free_period?: string | null;
                    description?: string;
                    advantages?: string[];
                    promo?: string;
                    affiliate_link?: string;
                    referral_code?: string | null;
                    tutorial_video_url?: string | null;
                    tutorial_file_url?: string | null;
                    eligibility?: string[];
                    bank_phone?: string | null;
                    bank_website?: string | null;
                    bank_intro?: string | null;
                    payment_channels?: string[] | null;
                    steps?: {
                        title: string;
                        description: string;
                        image: string;
                    }[];
                    status?: 'Published' | 'Draft';
                    order_index?: number;
                    rating?: number | null;
                    user_count?: string | null;
                    updated_at?: string;
                };
            };
            app_settings: {
                Row: {
                    id: string;
                    key: string;
                    value: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    key: string;
                    value: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    key?: string;
                    value?: Json;
                    updated_at?: string;
                };
            };
            partner_logos: {
                Row: {
                    id: string;
                    name: string;
                    logo_url: string;
                    order_index: number;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    logo_url: string;
                    order_index?: number;
                    is_active?: boolean;
                    created_at?: string;
                };
                Update: {
                    name?: string;
                    logo_url?: string;
                    order_index?: number;
                    is_active?: boolean;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}

// Helper type để chuyển đổi từ Database Row sang Project interface
export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
export type AppSettingRow = Database['public']['Tables']['app_settings']['Row'];
export type PartnerLogoRow = Database['public']['Tables']['partner_logos']['Row'];
