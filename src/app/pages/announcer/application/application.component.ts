import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
  standalone: false
})
export class ApplicationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  submitApplication() {
    alert('Demande envoyée ! Nous examinerons votre dossier sous 24-48h.');
    this.router.navigate(['/']);
  }

}
