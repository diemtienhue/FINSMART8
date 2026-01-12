/**
 * SUPABASE SERVICE
 * Service layer cho các thao tác với Supabase Database và Storage
 */

import { supabase } from '../lib/supabase';
import { Project, ProjectType } from '../types';

// ============================================
// TYPES - định nghĩa local để tránh lỗi type strict
// ============================================

interface ProjectRow {
    id: string;
    name: string;
    type: 'LOAN' | 'CREDIT_CARD';
    logo: string;
    cover_image: string;
    limit: string;  // Changed from limit_amount
    interest_rate: string;
    interest_free_period: string | null;
    description: string;
    advantages: any;  // Changed from string[] to JSONB
    promo: string;
    affiliate_link: string;
    referral_code: string | null;
    tutorial_video_url: string | null;
    tutorial_file_url: string | null;
    eligibility: any;  // Changed from string[] to JSONB
    bank_phone: string | null;
    bank_website: string | null;
    bank_intro: string | null;
    payment_channels: any | null;  // JSONB
    steps: {
        title: string;
        description: string;
        image: string;
    }[];
    status: 'Published' | 'Draft';
    order: number;  // Changed from order_index
    rating: number | null;
    user_count: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================
// HELPER FUNCTIONS - Chuyển đổi dữ liệu
// ============================================

/**
 * Chuyển đổi từ Database Row sang Project interface
 */
const mapRowToProject = (row: ProjectRow): Project => ({
    id: row.id,
    name: row.name,
    type: row.type as ProjectType,
    logo: row.logo,
    coverImage: row.cover_image,
    limit: row.limit,  // Changed
    interestRate: row.interest_rate,
    interestFreePeriod: row.interest_free_period || undefined,
    description: row.description,
    advantages: Array.isArray(row.advantages) ? row.advantages : [],  // Handle JSONB
    promo: row.promo,
    affiliateLink: row.affiliate_link,
    referralCode: row.referral_code || undefined,
    tutorialVideoUrl: row.tutorial_video_url || undefined,
    tutorialFileUrl: row.tutorial_file_url || undefined,
    eligibility: Array.isArray(row.eligibility) ? row.eligibility : [],  // Handle JSONB
    bankPhone: row.bank_phone || undefined,
    bankWebsite: row.bank_website || undefined,
    bankIntro: row.bank_intro || undefined,
    paymentChannels: row.payment_channels || undefined,
    steps: row.steps,
    status: row.status,
    order: row.order,  // Changed
    rating: row.rating || undefined,
    userCount: row.user_count || undefined,
});

/**
 * Chuyển đổi từ Project interface sang Database format
 */
const mapProjectToRow = (project: Project): Record<string, unknown> => ({
    id: project.id,
    name: project.name,
    type: project.type,
    logo: project.logo,
    cover_image: project.coverImage,
    limit: project.limit,  // Changed
    interest_rate: project.interestRate,
    interest_free_period: project.interestFreePeriod || null,
    description: project.description,
    advantages: project.advantages,  // JSONB
    promo: project.promo,
    affiliate_link: project.affiliateLink,
    referral_code: project.referralCode || null,
    tutorial_video_url: project.tutorialVideoUrl || null,
    tutorial_file_url: project.tutorialFileUrl || null,
    eligibility: project.eligibility,  // JSONB
    bank_phone: project.bankPhone || null,
    bank_website: project.bankWebsite || null,
    bank_intro: project.bankIntro || null,
    payment_channels: project.paymentChannels || null,
    steps: project.steps,
    status: project.status,
    order: project.order,  // Changed
    rating: project.rating || null,
    user_count: project.userCount || null,
});

// ============================================
// PROJECT SERVICES
// ============================================

/**
 * Lấy tất cả sản phẩm (projects)
 */
export const getAllProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }

    return (data || []).map((row) => mapRowToProject(row as unknown as ProjectRow));
};

/**
 * Lấy sản phẩm theo loại (LOAN hoặc CREDIT_CARD)
 */
export const getProjectsByType = async (type: ProjectType): Promise<Project[]> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('type', type)
        .eq('status', 'Published')
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching projects by type:', error);
        throw error;
    }

    return (data || []).map((row) => mapRowToProject(row as unknown as ProjectRow));
};

/**
 * Lấy sản phẩm theo ID
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching project:', error);
        throw error;
    }

    return data ? mapRowToProject(data as unknown as ProjectRow) : null;
};

/**
 * Tạo sản phẩm mới
 */
export const createProject = async (project: Project): Promise<Project> => {
    const { data, error } = await supabase
        .from('projects')
        .insert(mapProjectToRow(project) as never)
        .select()
        .single();

    if (error) {
        console.error('Error creating project:', error);
        throw error;
    }

    return mapRowToProject(data as unknown as ProjectRow);
};

/**
 * Cập nhật sản phẩm
 */
export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
    const updateData: Record<string, unknown> = {};

    if (project.name !== undefined) updateData.name = project.name;
    if (project.type !== undefined) updateData.type = project.type;
    if (project.logo !== undefined) updateData.logo = project.logo;
    if (project.coverImage !== undefined) updateData.cover_image = project.coverImage;
    if (project.limit !== undefined) updateData.limit = project.limit;  // Changed
    if (project.interestRate !== undefined) updateData.interest_rate = project.interestRate;
    if (project.interestFreePeriod !== undefined) updateData.interest_free_period = project.interestFreePeriod;
    if (project.description !== undefined) updateData.description = project.description;
    if (project.advantages !== undefined) updateData.advantages = project.advantages;
    if (project.promo !== undefined) updateData.promo = project.promo;
    if (project.affiliateLink !== undefined) updateData.affiliate_link = project.affiliateLink;
    if (project.referralCode !== undefined) updateData.referral_code = project.referralCode;
    if (project.tutorialVideoUrl !== undefined) updateData.tutorial_video_url = project.tutorialVideoUrl;
    if (project.tutorialFileUrl !== undefined) updateData.tutorial_file_url = project.tutorialFileUrl;
    if (project.eligibility !== undefined) updateData.eligibility = project.eligibility;
    if (project.bankPhone !== undefined) updateData.bank_phone = project.bankPhone;
    if (project.bankWebsite !== undefined) updateData.bank_website = project.bankWebsite;
    if (project.bankIntro !== undefined) updateData.bank_intro = project.bankIntro;
    if (project.paymentChannels !== undefined) updateData.payment_channels = project.paymentChannels;
    if (project.steps !== undefined) updateData.steps = project.steps;
    if (project.status !== undefined) updateData.status = project.status;
    if (project.order !== undefined) updateData.order = project.order;  // Changed
    if (project.rating !== undefined) updateData.rating = project.rating;
    if (project.userCount !== undefined) updateData.user_count = project.userCount;

    const { data, error } = await supabase
        .from('projects')
        .update(updateData as never)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating project:', error);
        throw error;
    }

    return mapRowToProject(data as unknown as ProjectRow);
};

/**
 * Xóa sản phẩm
 */
export const deleteProject = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

// ============================================
// APP SETTINGS SERVICES
// ============================================

interface AppSettingRow {
    id: string;
    key: string;
    value: unknown;
    created_at: string;
    updated_at: string;
}

/**
 * Lấy cài đặt hệ thống theo key
 */
export const getAppSetting = async <T>(key: string): Promise<T | null> => {
    const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching app setting:', error);
        throw error;
    }

    return (data as AppSettingRow | null)?.value as T ?? null;
};

/**
 * Cập nhật hoặc tạo mới cài đặt hệ thống
 */
export const upsertAppSetting = async <T>(key: string, value: T): Promise<void> => {
    const { error } = await supabase
        .from('app_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() } as never, { onConflict: 'key' });

    if (error) {
        console.error('Error upserting app setting:', error);
        throw error;
    }
};

/**
 * Lấy tất cả cài đặt Hero Slide
 */
export const getHeroSettings = async () => {
    return getAppSetting<{
        heroTitle: string;
        heroSubtitle: string;
        heroImage: string;
        zaloSupport: string;
    }>('hero_settings');
};

/**
 * Cập nhật cài đặt Hero Slide
 */
export const updateHeroSettings = async (settings: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    zaloSupport: string;
}) => {
    return upsertAppSetting('hero_settings', settings);
};

// ============================================
// STORAGE SERVICES - Upload ảnh
// ============================================

/**
 * Upload ảnh lên Supabase Storage
 * @param file - File ảnh cần upload
 * @param bucket - Tên bucket (mặc định: 'images')
 * @param folder - Thư mục trong bucket (mặc định: 'projects')
 * @returns URL công khai của ảnh
 */
export const uploadImage = async (
    file: File,
    bucket: string = 'images',
    folder: string = 'projects'
): Promise<string> => {
    // Tạo tên file unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload file
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    // Lấy URL công khai
    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
};

/**
 * Xóa ảnh khỏi Supabase Storage
 * @param url - URL của ảnh cần xóa
 * @param bucket - Tên bucket
 */
export const deleteImage = async (url: string, bucket: string = 'images'): Promise<void> => {
    // Trích xuất path từ URL
    const urlParts = url.split(`${bucket}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

    if (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

// ============================================
// PARTNER LOGOS SERVICES
// ============================================

interface PartnerLogoRow {
    id: string;
    name: string;
    logo_url: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
}

/**
 * Lấy tất cả logo đối tác
 */
export const getPartnerLogos = async (): Promise<PartnerLogoRow[]> => {
    const { data, error } = await supabase
        .from('partner_logos')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching partner logos:', error);
        throw error;
    }

    return (data || []) as PartnerLogoRow[];
};

// ============================================
// SYNC ALL DATA (Bulk operations)
// ============================================

/**
 * Đồng bộ tất cả sản phẩm (upsert)
 */
export const syncAllProjects = async (projects: Project[]): Promise<void> => {
    // Remove id field to let database auto-generate UUIDs
    const rows = projects.map(project => {
        const row = mapProjectToRow(project);
        delete row.id;  // Let database generate UUID
        return row;
    });

    const { error } = await supabase
        .from('projects')
        .upsert(rows as never[], { onConflict: 'name' });  // Use name as unique key

    if (error) {
        console.error('Error syncing projects:', error);
        throw error;
    }
};

