import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from "../../global-component";


// Static httpOptions removed to avoid stale tokens.


/**
 * @deprecated THIS SERVICE IS LEGACY.
 * It is used by the original BigDeals store/effects. 
 * Please do not use for new Marketplace features.
 */
@Injectable({
  providedIn: 'root'
})
export class restApiService {
  constructor(private http: HttpClient) { }

  /**
  * Product Rest Api
  */
  // Get
  getData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.product, { headers: headerToken, responseType: 'text' });
  }

  // Delete 
  deleteData(id: any): Observable<any> {
    return this.http.delete(GlobalComponent.API_URL + GlobalComponent.productDelete + id, { responseType: 'text' });
  }

  /**
  * Order Rest Api
  */

  // Get
  getOrderData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.order, { headers: headerToken, responseType: 'text' });
  }

  // POST
  postOrderData(employee: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.order, JSON.stringify(employee), options);
  }

  // Single
  getSingleOrderData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.orderId + id, { headers: headerToken, responseType: 'text' });
  }

  //Order Patch
  patchOrderData(employee: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.patch(GlobalComponent.API_URL + GlobalComponent.orderId + employee.ids, JSON.stringify(employee), options);
  }

  // Order Delete
  deleteOrder(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.delete(GlobalComponent.API_URL + GlobalComponent.orderId + id, { headers: headerToken, responseType: 'text' });
  }


  getSellerData(): Observable<any[]> {
    return this.http.get<any[]>('/app/seller');
  }

  getProjectData(): Observable<any[]> {
    return this.http.get<any[]>('/app/project');
  }

  /**
  * Customers Rest Api
  */
  // Get
  getCustomerData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + GlobalComponent.customer, { headers: headerToken, responseType: 'text' });
  }

  // POST
  postCustomerData(customers: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.post(GlobalComponent.API_URL + GlobalComponent.customer, JSON.stringify(customers), options);
  }

  // Single
  getSingleCustomerData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/customer/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchCustomerData(customers: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.patch(GlobalComponent.API_URL + 'apps/customer/' + customers.ids, JSON.stringify(customers), options);
  }

  // Delete
  deleteCustomer(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.delete(GlobalComponent.API_URL + 'apps/customer/' + id, { headers: headerToken, responseType: 'text' });
  }

  /**
   * Task List Rest Api
   */
  // Get
  getTaskData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/task', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postTaskData(task: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.post(GlobalComponent.API_URL + 'apps/task', JSON.stringify(task), options);
  }

  // Single
  getSingleTaskData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/task/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchTaskData(tasks: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.patch(GlobalComponent.API_URL + 'apps/task/' + tasks.ids, JSON.stringify(tasks), options);
  }

  // Delete
  deleteTask(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.delete(GlobalComponent.API_URL + 'apps/task/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Kanban
  getKanbanData(): Observable<any[]> {
    return this.http.get<any[]>('/app/kanban');
  }

  // Filemanger Folder
  getFolderData(): Observable<any[]> {
    return this.http.get<any[]>('/app/folder');
  }

  addFolderData(newData: any): Observable<any[]> {
    return this.http.post<any[]>('/app/folder', newData);
  }

  updateFolderData(updatedData: any): Observable<any[]> {
    return this.http.put<any[]>('/app/folder', updatedData);
  }

  deleteFolderData(): Observable<void> {
    return this.http.delete<void>('/app/folder');
  }

  // Filemanger Files
  getFileData(): Observable<any[]> {
    return this.http.get<any[]>('/app/file');
  }

  addFileData(newData: any): Observable<any[]> {
    return this.http.post<any[]>('/app/file', newData);
  }

  updateFileData(updatedData: any): Observable<any[]> {
    return this.http.put<any[]>('/app/file', updatedData);
  }

  deleteFileData(): Observable<void> {
    return this.http.delete<void>('/app/file');
  }

  /**
   * CRM Contect Rest Api
   */
  // Get
  getContactData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/contact', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postContactData(contact: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.post(GlobalComponent.API_URL + 'apps/contact', JSON.stringify(contact), options);
  }

  // Single
  getSingleContactData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/contact/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchContactData(contacts: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.patch(GlobalComponent.API_URL + 'apps/contact/' + contacts.ids, JSON.stringify(contacts), options);
  }

  // Delete
  deleteContact(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.delete(GlobalComponent.API_URL + 'apps/contact/' + id, { headers: headerToken, responseType: 'text' });
  }

  /**
   * CRM Company Rest Api
   */
  // Get
  getCompanyData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/company', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postCompanyData(company: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.post(GlobalComponent.API_URL + 'apps/company', JSON.stringify(company), options);
  }

  // Single
  getSingleCompanyData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/company/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchCompanyData(company: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.patch(GlobalComponent.API_URL + 'apps/company/' + company.ids, JSON.stringify(company), options);
  }

  // Delete
  deleteCompany(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.delete(GlobalComponent.API_URL + 'apps/company/' + id, { headers: headerToken, responseType: 'text' });
  }

  getDealData(): Observable<any[]> {
    return this.http.get<any[]>('/app/deal');
  }

  /* CRM Company Rest Api
  */
  // Get
  getLeadData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/lead', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postLeadData(company: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.post(GlobalComponent.API_URL + 'apps/lead', JSON.stringify(company), options);
  }

  // Single
  getSingLeadData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/lead/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchLeadData(company: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.patch(GlobalComponent.API_URL + 'apps/lead/' + company.ids, JSON.stringify(company), options);
  }

  // Delete
  deletelead(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.delete(GlobalComponent.API_URL + 'apps/lead/' + id, { headers: headerToken, responseType: 'text' });
  }


  // Job Application
  getApplicationData(): Observable<any[]> {
    return this.http.get<any[]>('/app/application');
  }

  addApplicationData(newData: any): Observable<any[]> {
    return this.http.post<any[]>('/app/application', newData);
  }

  updateApplicationData(updatedData: any): Observable<any[]> {
    return this.http.put<any[]>('/app/application', updatedData);
  }

  deleteApplicationData(): Observable<void> {
    return this.http.delete<void>('/app/application');
  }

    // Job Apikey
    getApikeyData(): Observable<any[]> {
      return this.http.get<any[]>('/app/apikey');
    }
  
    addApikeyData(newData: any): Observable<any[]> {
      return this.http.post<any[]>('/app/apikey', newData);
    }
  
    updateApikeyData(updatedData: any): Observable<any[]> {
      return this.http.put<any[]>('/app/apikey', updatedData);
    }
  
    deleteApikeyData(): Observable<void> {
      return this.http.delete<void>('/app/apikey');
    }

  /* Support Ticket Rest Api
  */
  // Get
  getTicketData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/ticket', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postTicketData(ticket: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.post(GlobalComponent.API_URL + 'apps/ticket', JSON.stringify(ticket), options);
  }

  // Single
  getSingTicketData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/ticket/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchTicketData(ticket: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.patch(GlobalComponent.API_URL + 'apps/ticket/' + ticket.ids, JSON.stringify(ticket), options);
  }

  // Delete
  deleteTicket(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.delete(GlobalComponent.API_URL + 'apps/ticket/' + id, { headers: headerToken, responseType: 'text' });
  }

  /**
  * Support Ticket Rest Api
  */
  // Get
  getInvoiceData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/invoice', { headers: headerToken, responseType: 'text' });
  }

  // Delete
  deleteInvoice(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.delete(GlobalComponent.API_URL + 'apps/invoice/' + id, { headers: headerToken, responseType: 'text' });
  }

  /**
  * Todo Rest Api
  */
  // Get
  getTodoData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/todo/', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postTodoData(employee: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.post(GlobalComponent.API_URL + 'apps/todo/', JSON.stringify(employee), options);
  }

  // Single
  getSingleTodoData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/todo/' + id, { headers: headerToken, responseType: 'text' });
  }

  //Patch
  patchTodoData(employee: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }) };
    return this.http.patch(GlobalComponent.API_URL + 'apps/todo/' + employee.ids, JSON.stringify(employee), options);
  }

  // deleteTodo(): Observable<void> {
  //   return this.http.delete<void>('/app/file');
  // }

  /**
  * Calender Rest Api
  */
  // Get
  getCalendarData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + localStorage.getItem('token') };
    return this.http.get(GlobalComponent.API_URL + 'apps/calendar/', { headers: headerToken, responseType: 'text' });
  }


}
