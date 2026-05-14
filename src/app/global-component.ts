import { environment } from "src/environments/environment";

export const GlobalComponent = {
    // Api Calling
    API_URL : environment.apiUrl + '/',
    
    // Auth Api
    AUTH_API: environment.apiUrl + '/auth/',
}