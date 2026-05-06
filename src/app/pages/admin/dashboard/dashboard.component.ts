import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexTooltip,
  ApexYAxis,
  ApexLegend
} from 'ng-apexcharts';
import { AdminDashboardService, AdminDashboardStats } from '../../../core/services/admin-dashboard.service';
import { AdminDemandesAnnonceurService } from '../../../core/services/admin-demandes-annonceur.service';
import { ApiResponse } from '../../../core/types/api.types';

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  grid?: ApexGrid;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  yaxis?: ApexYAxis;
  legend?: ApexLegend;
  colors?: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  @ViewChild('chart') chart!: ChartComponent;

  stats: any[] = [];
  announcerRequests: any[] = [];
  topSellers: any[] = [];
  recentCustomers: any[] = [];
  activities: any[] = [];
  loading = true;

  revenueChartOptions: ChartOptions = {
    series: [
      {
        name: 'Revenue',
        data: [4200, 5800, 5100, 7300, 6900, 8400, 9200, 8700, 10100, 11200, 9800, 12500]
      },
      {
        name: 'Ads Posted',
        data: [310, 420, 390, 510, 480, 590, 640, 610, 700, 780, 690, 850]
      }
    ],
    chart: { type: 'area', height: 250, toolbar: { show: false } },
    colors: ['#0ab39c', '#405189'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 95, 100] } },
    stroke: { width: [2, 2], curve: 'smooth' },
    xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 3, borderColor: '#e9ebec' },
    legend: { show: true, position: 'top' },
    tooltip: { shared: true, intersect: false }
  };

  constructor(
    private dashboardService: AdminDashboardService,
    private demandesService: AdminDemandesAnnonceurService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Fetch stats
    this.dashboardService.getStats().subscribe({
      next: (data: AdminDashboardStats) => {
        this.stats = data.stats;
        this.activities = data.recentActivities;
        this.topSellers = data.topSellers;
      },
      error: (err) => console.error('Error fetching dashboard stats', err)
    });

    this.demandesService.getAllRequests().subscribe({
      next: (res: ApiResponse<any[]>) => {
        if (res.success && res.data) {
          // Filter only pending requests for the dashboard summary
          this.announcerRequests = res.data
            .filter((r: any) => r.statut === 'EN_ATTENTE' || r.statut === 0)
            .map((r: any) => ({
              id: r.idDemandeAnnonceur || r.id,
              avatar: r.photoProfilUrl || 'assets/images/users/user-dummy-img.jpg',
              userName: r.nomUtilisateur || 'Utilisateur',
              storeName: r.nomBoutique || 'Boutique',
              date: new Date(r.dateDemande).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
            }))
            .slice(0, 5); // Show only top 5
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching demandes', err);
        this.loading = false;
      }
    });
  }

  approveRequest(req: any) {
    if (confirm(`Approuver la demande de ${req.userName} ?`)) {
      this.demandesService.approveRequest(req.id).subscribe({
        next: () => {
          this.announcerRequests = this.announcerRequests.filter(r => r.id !== req.id);
          // Refresh stats
          this.loadData();
        },
        error: (err: any) => alert('Erreur lors de l\'approbation')
      });
    }
  }

  rejectRequest(req: any) {
    const reason = prompt('Motif du rejet :');
    if (reason) {
      this.demandesService.rejectRequest(req.id, reason).subscribe({
        next: () => {
          this.announcerRequests = this.announcerRequests.filter(r => r.id !== req.id);
          this.loadData();
        },
        error: (err: any) => alert('Erreur lors du rejet')
      });
    }
  }

  validateCustomer(customer: any) {
    customer.status = 'Validated';
    this.recentCustomers = this.recentCustomers.filter(c => c !== customer);
  }

  blockCustomer(customer: any) {
    customer.status = 'Blocked';
    this.recentCustomers = this.recentCustomers.filter(c => c !== customer);
  }
}
