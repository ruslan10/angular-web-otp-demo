import { Component, OnInit, VERSION } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  form: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      otp: new FormControl(),
    });
  }

  otpChange(e) {
    this.formSubmit();
  }

  formSubmit() {
    alert(`verification ${this.form.value.otp} is send`);
  }
}
