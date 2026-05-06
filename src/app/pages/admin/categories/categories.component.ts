import { Component, OnInit } from '@angular/core';
import { jobcategories } from 'src/app/core/data/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: false
})
export class CategoriesComponent implements OnInit {

  breadCrumbItems!: Array<{ label: string; active?: boolean }>;
  categories: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Gestion du Marché' },
      { label: 'Gérer catégories', active: true }
    ];

    // Load mock data for now
    this.categories = jobcategories;
  }

  // Placeholder for real actions
  onEdit(id: number) {
    console.log('Editing category', id);
  }

  onDelete(id: number) {
    console.log('Deleting category', id);
    this.categories = this.categories.filter(c => c.id !== id);
  }
}
