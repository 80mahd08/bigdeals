import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnoncesService } from '../../../core/services/annonces.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { Annonce, Categorie } from '../../../core/models';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from 'src/app/store/Authentication/auth.models';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: false
})
export class LandingComponent implements OnInit {

  categories: Categorie[] = [];
  featuredAds: Annonce[] = [];
  currentUser: User | null = null;

  constructor(
    private annoncesService: AnnoncesService,
    private categoriesService: CategoriesService,
    private authService: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    this.categoriesService.getCategories().subscribe(res => {
      if (res.success && res.data) {
        this.categories = res.data.slice(0, 8);
      }
    });

    this.annoncesService.getAnnonces(undefined, undefined, undefined, undefined, undefined, 1, 4).subscribe(res => {
      if (res.success && res.data) {
        this.featuredAds = res.data.items;
      }
    });
  }

}
