import { Directive, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * WebOtp Directive
 * @description Verify phone numbers on the web with the WebOTP API
 * @param {boolean} abortOtpMessage In case the user manually enters an OTP and submits the form.
 * @param otpChange: EventEmitter<string>;
 * @param otpError: EventEmitter<any>;
 *
 * @example
 * <input type="text" formControlName="myOtp" appWebOtp>
 */

@Directive({
  selector: '[appWebOtp]'
})
export class WebOtpDirective implements OnChanges, OnDestroy, OnInit {
  @HostBinding('attr.autocomplete') autocomplete!: string;
  @HostBinding('attr.inputmode') inputmode!: string;
  @Input() abortOtpMessage = false;
  @Output() otpChange = new EventEmitter<string>();
  @Output() otpError = new EventEmitter();
  private webOtpSupport = false;
  private ac!: AbortController;

  constructor(private ngControl: NgControl) {
  }

  ngOnChanges({ abortOtpMessage }: SimpleChanges) {
    if (this.ac && abortOtpMessage && abortOtpMessage.currentValue !== abortOtpMessage.previousValue) {
      this.ac.abort();
    }
  }

  async ngOnInit() {
    this.webOtpSupport = ('OTPCredential' in window);

    if (this.webOtpSupport) {
      try {
        this.autocomplete = 'one-time-code';
        this.inputmode = 'numeric';
        this.ac = new AbortController();
        const otp: any = await navigator.credentials.get(<any>{ otp: { transport: ['sms'] }, signal: this.ac.signal });
        if (otp?.code) {
          if (this.ngControl?.control) {
            this.ngControl.control.patchValue(otp.code);
          }
          this.otpChange.emit(otp.code);
        }
        this.ac.abort();
      } catch (e) {
        this.otpError.emit(e);
      }
    }
  }

  ngOnDestroy() {
    if (this.ac) {
      this.ac.abort();
    }
  }

}