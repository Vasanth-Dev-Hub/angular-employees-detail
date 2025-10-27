import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmpService } from '../employeesData/emp-service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirmation',
  imports: [HttpClientModule,CommonModule, MatSnackBarModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {
  @Output() confirmationStatus = new EventEmitter<any>();
  @Input() selectedId: any;  
  isLoading = false;
  constructor(private service: EmpService) {
   
  }

  confirmation(status: boolean) {
    if (!!status) {
      this.isLoading = true;
      this.service.deleteEmployee(this.selectedId).pipe(
        finalize(() => { 
          this.isLoading = false;
        })
      ).subscribe((res) => {
        this.service.showSuccess('Employee deleted successfully');
        this.closeModal()
        this.confirmationStatus.emit(status);
      },
        (error) => {
          this.service.showError('unable to delete the employee');
        });
    }else{
      this.confirmationStatus.emit(status);
    }
  }

  closeModal() {
    const closeButton: any = document.getElementById("closeConfirmationModal");
    closeButton.click();
  }
}
