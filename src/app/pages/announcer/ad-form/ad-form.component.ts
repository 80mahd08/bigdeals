import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ad-form',
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.scss'],
  standalone: false
})
export class AdFormComponent implements OnInit {

  isEdit = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
    }
  }

  saveAd() {
    alert(this.isEdit ? 'Annonce mise à jour !' : 'Annonce publiée avec succès !');
    this.router.navigate(['/announcer/dashboard']);
  }

  cancel() {
    this.router.navigate(['/announcer/dashboard']);
  }

}
