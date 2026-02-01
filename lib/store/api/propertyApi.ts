import { apiSlice } from './apiSlice';

export interface ApiProperty {
    id: string;
    title: string;
    location: string;
    price: string;
    currency: string;
    status: 'rent' | 'sale';
    type: string;
    area?: number;
    guests?: number;
    bedrooms: number;
    bathrooms: number;
    living_rooms: number;
    garages?: number;
    units?: number;
    description: string;
    amenities: string[] | string; // Handle both array and JSON string if needed, ideally array
    entity?: string;
    agent: {
        id: number;
        name: string;
        phone: string;
        mobile: string;
        email: string;
        skype?: string;
    };
    featured: boolean;
    is_active: boolean;
    available_from?: string;
    is_available: boolean;
    images: {
        id: number;
        image: string;
        category: string;
        is_primary: boolean;
        order: number;
    }[] | string[]; // Backend currently returns list of strings or objects? client.ts said string[] but typically it's objects. client.ts had string[]. I'll stick to what client.ts had but usually backend returns objects.
    categorized_images?: {
        category: string;
        images: string[];
    }[];
    primary_image?: string;
    created_at: string;
    updated_at: string;
}

export interface PropertyFilters {
    status?: 'rent' | 'sale';
    type?: string;
    entity?: string;
    featured?: boolean;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    bathrooms?: number;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}

export interface ApiPaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface AvailabilityResponse {
    available: boolean;
    property_id: string;
    check_in: string;
    check_out: string;
}

export const propertyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProperties: builder.query<ApiPaginatedResponse<ApiProperty>, PropertyFilters | void>({
            query: (filters) => {
                const params = new URLSearchParams();
                if (filters) {
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value !== undefined) {
                            params.append(key, String(value));
                        }
                    });
                }
                return {
                    url: `/properties/?${params.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.results.map(({ id }) => ({ type: 'Property' as const, id })),
                        { type: 'Property', id: 'LIST' },
                    ]
                    : [{ type: 'Property', id: 'LIST' }],
        }),
        getProperty: builder.query<ApiProperty, string>({
            query: (id) => `/properties/${id}/`,
            providesTags: (result, error, id) => [{ type: 'Property', id }],
        }),
        createProperty: builder.mutation<ApiProperty, FormData>({
            query: (formData) => ({
                url: '/properties/',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Property', id: 'LIST' }],
        }),
        updateProperty: builder.mutation<ApiProperty, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/properties/${id}/`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Property', id },
                { type: 'Property', id: 'LIST' },
            ],
        }),
        deleteProperty: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/properties/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Property', id: 'LIST' }],
        }),
        checkAvailability: builder.query<AvailabilityResponse, { propertyId: string; checkIn: string; checkOut: string }>({
            query: ({ propertyId, checkIn, checkOut }) => ({
                url: `/properties/${propertyId}/availability/`,
                params: { check_in: checkIn, check_out: checkOut },
            }),
        }),
        getBookedDates: builder.query<{ start: string; end: string }[], string>({
            query: (propertyId) => `/properties/${propertyId}/booked_dates/`,
        }),
    }),
});

export const {
    useGetPropertiesQuery,
    useGetPropertyQuery,
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useDeletePropertyMutation,
    useCheckAvailabilityQuery,
    useGetBookedDatesQuery,
} = propertyApi;
