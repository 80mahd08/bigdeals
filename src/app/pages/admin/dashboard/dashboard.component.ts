import { Component, OnInit } from '@angular/core';
import { AdminDashboardService, AdminDashboardStats, AdminGrowthChart, AdminGrowthPoint } from '../../../core/services/admin-dashboard.service';
import { AdminDemandesAnnonceurService } from '../../../core/services/admin-demandes-annonceur.service';
import { ApiResponse } from '../../../core/types/api.types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {

  stats: any[] = [];
  announcerRequests: any[] = [];
  pendingCount: number = 0;
  loading = true;

  // Chart State
  selectedMetric: 'users' | 'annonces' | 'revenue' | 'signalements' = 'users';
  selectedPeriod: '7d' | '30d' | '12m' = '30d';
  growthData: AdminGrowthChart | null = null;
  loadingGrowth: boolean = false;
  public chartOptions: any = {};

  get currentMonthYear(): string {
    const date = new Date();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  }

  constructor(
    private dashboardService: AdminDashboardService,
    private demandesService: AdminDemandesAnnonceurService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadGrowthData();
  }

  loadData() {
    this.loading = true;
    
    // Fetch stats
    this.dashboardService.getStats().subscribe({
      next: (data: AdminDashboardStats) => {
        this.stats = data.stats.map(s => {
          // Map backend labels to our metric keys for click handling
          let metricKey = 'users';
          if (s.label === 'Annonces') metricKey = 'annonces';
          else if (s.label === 'Revenus Plateforme') metricKey = 'revenue';
          else if (s.label === 'Signalements') metricKey = 'signalements';
          return { ...s, metricKey };
        });
        this.pendingCount = data.pendingAnnouncerRequests;
      },
      error: (err) => {
        console.error('Error fetching dashboard stats', err);
      }
    });

    this.demandesService.getAllRequests(1, 10, 1).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Filter only requests awaiting verification for the dashboard summary
          this.announcerRequests = res.data.items
            .map((r: any) => ({
              id: r.idDemandeAnnonceur,
              userName: `${r.prenomUtilisateur} ${r.nomUtilisateur}`,
              date: new Date(r.dateDemande).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
              statut: 1 
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

  loadGrowthData() {
    this.loadingGrowth = true;
    this.dashboardService.getDashboardGrowth(this.selectedMetric, this.selectedPeriod).subscribe({
      next: (data) => {
        this.growthData = data;
        this.initChart(data);
        this.loadingGrowth = false;
      },
      error: (err) => {
        console.error('Error fetching growth data', err);
        this.loadingGrowth = false;
      }
    });
  }

  onMetricSelect(metric: 'users' | 'annonces' | 'revenue' | 'signalements') {
    if (this.selectedMetric !== metric) {
      this.selectedMetric = metric;
      this.loadGrowthData();
    }
  }

  onPeriodSelect(period: '7d' | '30d' | '12m') {
    if (this.selectedPeriod !== period) {
      this.selectedPeriod = period;
      this.loadGrowthData();
    }
  }

  private initChart(data: AdminGrowthChart) {
    if (!data || !data.points || data.points.length === 0) return;

    const categories = data.points.map((p: AdminGrowthPoint) => p.label);
    const seriesData = data.points.map((p: AdminGrowthPoint) => p.value);
    
    let color = '#4b38b3'; // users (primary)
    if (this.selectedMetric === 'annonces') color = '#0ab39c'; // success
    else if (this.selectedMetric === 'revenue') color = '#299cdb'; // info
    else if (this.selectedMetric === 'signalements') color = '#f06548'; // danger

    const chartType = this.selectedMetric === 'revenue' ? 'bar' : 'area';

    this.chartOptions = {
      series: [{
        name: data.title,
        data: seriesData
      }],
      chart: {
        height: 350,
        type: chartType,
        toolbar: { show: false }
      },
      colors: [color],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100]
        }
      },
      xaxis: {
        categories: categories,
        tooltip: { enabled: false }
      },
      yaxis: {
        labels: {
          formatter: (val: number) => {
            return this.selectedMetric === 'revenue' ? val.toString() + ' DT' : val.toString();
          }
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return this.selectedMetric === 'revenue' ? val.toString() + ' DT' : val.toString();
          }
        }
      }
    };
  }
}
