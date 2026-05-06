import { environment } from "src/environments/environment";

export const GlobalComponent = {
    // Api Calling
    API_URL : environment.apiUrl + '/',
    
    // Auth Api
    AUTH_API: environment.apiUrl + '/auth/',

    
    // Products Api
    product:'apps/product',
    productDelete:'apps/product/',

    // Orders Api
    order:'apps/order',
    orderId:'apps/order/',

    // Customers Api
    customer:'apps/customer',
}