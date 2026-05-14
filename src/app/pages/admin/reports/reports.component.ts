import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  template: `
    <app-breadcrumbs title="Signalements" [breadcrumbItems]="breadCrumbItems"></app-breadcrumbs>
    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body text-center py-5">
                    <div class="avatar-lg mx-auto mb-4">
                        <div class="avatar-title bg-light text-primary display-4 rounded-circle">
                            <i class="ri-flag-line"></i>
                        </div>
                    </div>
                    <h5>Gestion des Signalements</h5>
                    <p class="text-muted">Cette fonctionnalité est en cours de développement.</p>
                    <div class="mt-4">
                        <button class="btn btn-primary shadow-none" routerLink="/admin/dashboard">Retour au tableau de bord</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
  standalone: false
})
export class ReportsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: 'Signalements', active: true }
    ];
  }
}
