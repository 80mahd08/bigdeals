import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/store/Authentication/auth.models';

/**
 * @deprecated THIS SERVICE IS LEGACY/ORPHANED. 
 * Kept only for reference. New code should use UtilisateursService.
 */
@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }
    /***
     * Get All User
     */
    getAll() {
        return this.http.get<User[]>(`api/users`);
    }

    /***
     * Facked User Register
     */
    register(user: User) {
        return this.http.post(`/users/register`, user);
    }
}
