import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EmpService } from '../emp-service';
import { CommonModule } from '@angular/common';
import { EmpForm } from '../emp-form/emp-form';
import { Confirmation } from '../../confirmation/confirmation';
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-emp-list',
  imports: [CommonModule,MatPaginatorModule, ReactiveFormsModule, EmpForm,Confirmation, HttpClientModule, MatSnackBarModule],
  providers: [EmpService],
  templateUrl: './emp-list.html',
  styleUrl: './emp-list.css',
})
export class EmpList implements OnInit{

  employeesListData: any = {};
  specializationList: any = [];
  action: string = "";
  employeeDetails: any;
  selectedId:any;
  pageNo: number = 0;
  pageSize: number = 10;
  searchForm: FormGroup;
  isloading: boolean = false;

  constructor(private service: EmpService, private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.searchForm = this.fb.group({
      empName: [''],
    })
  }

  ngOnInit() {
    this.getEmployeeList();
  }

  employeeFormSubmit(event: boolean) {
    this.action = "";
    this.employeeDetails = null;
    if (!!event) {
      this.getEmployeeList(this.pageNo);
    }
  }

  getEmployeeList(pageNo?:number) {
    this.isloading = true;
    this.employeesListData = {};
    const employeeName = this.searchForm.get('empName')?.value ? this.searchForm.get('empName')?.value : "";
    this.pageNo = pageNo ? pageNo : 0;
    this.service.getAllEmployeesList(employeeName, this.pageNo, this.pageSize).pipe(
      finalize(() => { 
        this.isloading = false; 
        this.cd.markForCheck();
      })
    ).subscribe((res:any)=>{
      this.employeesListData = res;
    },(error) => {
      console.error('Error fetching employee list', error);
    });
  }

  confirmationStatus(event:any){
    if(!!event){
      this.getEmployeeList(this.pageNo);
    }
    this.selectedId = null;
  }

  pageEvent(pageEvent:any) {
    this.pageNo = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.getEmployeeList(this.pageNo)
  }

}
