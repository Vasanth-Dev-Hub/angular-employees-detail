import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpService {
  url = 'https://68ff32a4e02b16d1753cde24.mockapi.io/api/data';

  constructor(private http: HttpClient,private snackBar: MatSnackBar) { }

  getAllDepartmentList(){
    let endpoint = this.url + '/departmentList';
    return this.http.get(endpoint);
  }

  getEmployeeById(id: any){
    let endpoint = this.url + `/employees/${id}`;
    return this.http.get(endpoint);
  }

  addEmployee(data: any){
    let endpoint = this.url + '/employees';
    return this.http.post(endpoint, data);
  }

  updateEmployee(data:any,id:any){
    let endpoint = this.url + `/employees/${id}`;
    return this.http.put(endpoint, data);
  }

  deleteEmployee(id:any){
    let endpoint = this.url + `/employees/${id}`;
    return this.http.delete(endpoint);
  }

  getAllEmployeesList(employeeName: string, pageNo: number, pageSize: number) {
  return this.http.get<any[]>(this.url + '/employees').pipe(
    map((data: any[]) => {
      let filterData = [];
      if (employeeName) {
        filterData = data.filter(res =>
          res?.name.toLowerCase().includes(employeeName.toLowerCase())
        );
      }else{
        filterData = data;
      }

      const totalElements = filterData.length;
      const offset = pageNo * pageSize;
      const empData = filterData.slice(offset, offset + pageSize);

      return {
        data: empData,
        totalElements
      };
    })
  );
}
showSuccess(message:string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  showError(message:string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
