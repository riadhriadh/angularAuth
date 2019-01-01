import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  private email: string;
  private password: string;
  private color = 'accent';
  private mode = 'indeterminate';
  private value = 50;
  private isSubmitted: boolean = false;
  private errors = {
    email: {
      required: 'L\'email ne doit pas être vide.',
      email: 'Format email invalide'
    },
    password: {
      required: 'Le mot de passe ne doit pas être vide'
    },
    server: null,
    badCredentials: null
  };
  private formGroup: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    document.body.className = 'app';
    this.formGroup = this.formBuilder.group({
      email: new FormControl(this.email, [Validators.required, Validators.minLength(2), Validators.email]),
      password: new FormControl(this.password, [Validators.required])
    });
  }

  login() {
    this.isSubmitted = true;
    const data = {
      email: this.formGroup.get('email').value,
      password: this.formGroup.get('password').value
    };
    this.authService.login(data).subscribe((response) => {
      this.isSubmitted = false;
      localStorage.setItem('@user:token', response.accessToken);
      localStorage.setItem('@user:data', JSON.stringify(response.user));
      this.router.navigate(['home']);
    }, (error) => {
      this.isSubmitted = false;
      if (error.status === 403) {
        this.errors.badCredentials = 'Email ou mot de passe erroné';
        console.log({ error: this.errors.badCredentials });
      }
      if (error.status === 500) {
        console.log({ error });
      }
    });
  }

  validateItem(item): boolean {
    if (this.formGroup.get(item).invalid && (this.formGroup.get(item).dirty || this.formGroup.get(item).touched)) {
      return true;
    }
    return false;
  }

  getFormErrors(item) {
    return this.formGroup.get(item).errors;
  }

  clearCredentialsErrors() {
    this.errors.badCredentials = null;
  }
}
