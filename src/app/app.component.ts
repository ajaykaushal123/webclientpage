import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  [x: string]: any;
 
  signupForm!: FormGroup;
  otpSent = false;
  otpVerified = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      otp: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendOtp() {
    if (this.signupForm.controls['mobileNumber'].valid) {
      const mobileNumber = this.signupForm.controls['mobileNumber'].value;
      
      // Replace this URL with your SMS API endpoint
      this.http.post('https://your-sms-api.com/send-otp', { mobileNumber })
        .subscribe(response => {
          console.log('OTP sent', response);
          this.otpSent = true;
        });
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;

      // First verify the OTP
      this.http.post('https://your-sms-api.com/verify-otp', { mobileNumber: signupData.mobileNumber, otp: signupData.otp })
        .subscribe((response :any)=> {
          if (response['verified']) {
            this.otpVerified = true;

            // Now, submit the signup form
            this.http.post('https://your-backend-api.com/signup', signupData)
              .subscribe(res => {
                console.log('Signup successful', res);
              });
          } else {
            console.error('OTP verification failed');
          }
        });
    }
  }


}
