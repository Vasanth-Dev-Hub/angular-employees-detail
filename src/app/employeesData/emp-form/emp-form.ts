import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpService } from '../emp-service';
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-emp-form',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, MatSnackBarModule],
  providers: [EmpService],
  templateUrl: './emp-form.html',
  styleUrl: './emp-form.css',
})
export class EmpForm implements OnInit, OnChanges {

  employeeForm: FormGroup;
  @Input() action: string = '';
  @Input() data: any;
  @Output() employeeFormSubmit = new EventEmitter<any>();
  departmentList: any = [];
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private service: EmpService) {
    this.employeeForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      department: [null, [Validators.required]],
      contact: [null, [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^[0-9]+$/)]],
      status: ['true'],
      address: this.fb.group({
        street: [null],
        city: [null],
        pincode: [null]
      }),
    })
  }

  ngOnChanges() {
    if (this.action && this.action != "ADD") {
      this.setForm();
    }
  }

  ngOnInit() {
    this.getDepartmentList();
  }

  getDepartmentList() {
    this.service.getAllDepartmentList().subscribe((data: any) => {
      this.departmentList = data;
    }, (error) => {
      console.error('Error fetching department list', error);
    });
  }

  closeModal(formSave: boolean) {
    this.employeeFormSubmit.emit(formSave);
    this.employeeForm.reset();
    this.employeeForm.get('status')?.setValue('true');
  }

  addEmpDetails() {
    this.isLoading = true;
    this.service.addEmployee(this.employeeForm.value).pipe(
      finalize(() => {
        this.isLoading = false; 
      })
    ).subscribe((res) => {
      this.service.showSuccess('Employee added successfully');
      const closeButton: any = document.getElementById("closeEmpFormModal")
      closeButton.click();
      this.closeModal(true);
    }, (error) => {
      this.service.showError('unable to add employee');
    });
  }

  updateEmpDetails() {
    this.isLoading = true;
    this.service.updateEmployee(this.employeeForm.value, this.data?.id).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((res) => {
      this.service.showSuccess('Employee updated successfully');
      const closeButton: any = document.getElementById("closeEmpFormModal")
      closeButton.click();
      this.closeModal(true);
    }, (error) => {
      this.service.showError('unable to update employee');
    });
  }

  setForm() {
    this.employeeForm.get('name')?.setValue(this.data?.name);
    this.employeeForm.get('email')?.setValue(this.data?.email);
    this.employeeForm.get('department')?.setValue(this.data?.department);
    this.employeeForm.get('contact')?.setValue(this.data?.contact);
    this.employeeForm.get('status')?.setValue(this.data?.status);
    for (let key of Object.keys(this.data?.address)) {
      this.employeeForm.get(`address.${key}`)?.setValue(this.data?.address[key])
    }
  }

}
