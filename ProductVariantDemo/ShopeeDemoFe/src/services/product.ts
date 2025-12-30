import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ProductForm } from '../schema';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5176/api/' }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        createProduct: builder.mutation<any, ProductForm>({
            query: (newProduct) => ({
                url: 'products',
                method: 'POST',
                body: newProduct,
            }),
            invalidatesTags: ['Product'],
        }),
        getProducts: builder.query<any[], void>({
            query: () => 'products',
            providesTags: ['Product'],
        }),
    }),
});

export const { useCreateProductMutation, useGetProductsQuery } = productApi;
