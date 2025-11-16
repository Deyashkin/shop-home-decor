import {Component, inject,} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgStyle} from '@angular/common';
import {
  PasswordRepeatDirective
} from '../../../shared/directives/password-repeat.directive';
import type {LoginResponseType} from '../../../../types/login-response.type';
import type {HttpErrorResponse} from '@angular/common/http';
import type {
  DefaultResponseType
} from '../../../../types/default-response.type';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgStyle, PasswordRepeatDirective,],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {

  private _snackBar = inject(MatSnackBar);
  signupForm!: FormGroup;


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
      passwordRepeat: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
      agree: [false, [Validators.required]],
    });
  }

  signup() {
    if (this.signupForm.valid
      && this.signupForm.value.email
      && this.signupForm.value.password
      && this.signupForm.value.passwordRepeat
      && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.passwordRepeat)
        .subscribe({
        next: (data: LoginResponseType | DefaultResponseType) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = data as LoginResponseType
          if (!(loginResponse).accessToken || !(loginResponse).refreshToken || !(loginResponse).userId) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;

          this._snackBar.open('Вы успешно зарегистрировались');
          this.router.navigate(['/']);
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка регистрации');
          }
        }
      })
    }
  }

}
