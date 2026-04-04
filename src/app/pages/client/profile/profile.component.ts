import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../store/Authentication/auth.models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {

  currentUser: User | null = null;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  updateProfile() {
    alert('Profil mis à jour avec succès !');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      alert('Photo de profil sélectionnée : ' + file.name);
    }
  }

}
