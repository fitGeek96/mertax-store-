import { ORDERS_URL, PAYPAL_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

// THIS IS FOR THE SERVER
const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}`,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ checkoutUrl }) => ({
        url: checkoutUrl,
        method: "POST",
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({ url: PAYPAL_URL }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({ url: `${ORDERS_URL}/myorders` }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({ url: `${ORDERS_URL}` }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useDeleteOrderMutation,
} = ordersApiSlice;

export default ordersApiSlice.reducer;
