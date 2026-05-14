import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnoncesService } from '../../../core/services/annonces.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { Annonce, Categorie, CategorieSchema } from '../../../core/models';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { TUNISIA_CITIES } from '../../../core/constants/cities';

@Component({
  selector: 'app-ads-listing',
  templateUrl: './ads-listing.component.html',
  styleUrls: ['./ads-listing.component.scss'],
  standalone: false
})
export class AdsListingComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  filterSubject = new Subject<void>();
  searchSubject = new Subject<string>();

  apiUrl = environment.apiUrl;
  
  // State
  adsList: Annonce[] = [];
  categories: Categorie[] = [];
  governorates: string[] = TUNISIA_CITIES;
  
  isLoading = true;
  hasError = false;
  
  // Dynamic Filtering
  categorySchema: CategorieSchema | null = null;
  dynamicFilters: { [key: number]: any } = {}; // Internal state for filter inputs
  
  // Pagination & Filters
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  
  selectedCategoryId: number | null = null;
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedLocation: string = '';
  sortBy: string = 'newest';
  sortDirection: string = 'desc';

  // Translation strings
  textResultsFound = 'annonces trouvées';
  textSearchPlaceholder = 'Rechercher une annonce, un vendeur...';
  textSortBy = 'Trier par :';
  textLatest = 'Plus récents';
  textPriceLowHigh = 'Prix : Croissant';
  textPriceHighLow = 'Prix : Décroissant';
  textTopRated = 'Mieux notés';
  textPrev = 'Précédent';
  textNext = 'Suivant';
  textShowingResults = 'Affichage de';
  textResultsLabel = 'résultats';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annoncesService: AnnoncesService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.fetchCategories();

    this.searchSubject.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.updateUrl();
    });

    this.filterSubject.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(300)
    ).subscribe(() => {
      this.updateUrl();
    });

    this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      const newCatId = params['category'] ? +params['category'] : null;
      
      // We detect change by comparing newCatId from URL with our internal state
      const catChanged = newCatId !== this.selectedCategoryId;
      
      this.selectedCategoryId = newCatId;
      this.searchQuery = params['q'] || params['search'] || '';
      this.minPrice = params['minPrice'] ? +params['minPrice'] : null;
      this.maxPrice = params['maxPrice'] ? +params['maxPrice'] : null;
      this.selectedLocation = params['location'] || '';
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.sortBy = params['sortBy'] || 'newest';
      this.sortDirection = params['sortDirection'] || 'desc';
      
      if (this.selectedCategoryId === null) {
        // Explicitly clear when no category is selected
        this.categorySchema = null;
        this.dynamicFilters = {};
        this.fetchAds();
      } else if (catChanged) {
        // Category changed to a specific one
        this.categorySchema = null; 
        this.fetchCategorySchema(this.selectedCategoryId, () => {
          this.loadDynamicFiltersFromUrl(params);
          this.fetchAds();
        });
      } else {
        // Same category, just update dynamic filters from URL
        this.loadDynamicFiltersFromUrl(params);
        this.fetchAds();
      }
    });
  }

  private loadDynamicFiltersFromUrl(params: any) {
    if (!this.categorySchema) return;
    
    // Clear current if not present in URL or reset
    const newFilters: any = {};
    
    this.categorySchema.attributs.forEach(attr => {
      const id = attr.idAttributCategorie;
      const key = `attr_${id}`;
      const val = params[key];

      if (val !== undefined && val !== null && val !== '') {
        if ((attr.typeDonnee === 'NOMBRE' || attr.typeDonnee === 'DATE') && attr.estPlage) {
          const min = params[`attr_${id}_min`];
          const max = params[`attr_${id}_max`];
          newFilters[id] = { min: min || null, max: max || null };
        } else if (attr.typeDonnee === 'BOOLEAN') {
          newFilters[id] = val === 'true';
        } else {
          newFilters[id] = val;
        }
      } else if ((attr.typeDonnee === 'NOMBRE' || attr.typeDonnee === 'DATE') && attr.estPlage) {
          // Initialize for ranges even if empty in URL
          newFilters[id] = { min: null, max: null };
      }
    });

    this.dynamicFilters = newFilters;
  }

  fetchCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories = res.data;
        }
      },
      error: () => {
        console.error('Failed to load categories');
      }
    });
  }

  fetchAds() {
    this.isLoading = true;
    this.hasError = false;

    // Convert internal dynamic filters to DTO format
    const filtresDynamiques: any[] = [];
    
    if (this.selectedCategoryId && this.categorySchema) {
        Object.keys(this.dynamicFilters).forEach(key => {
            const attrId = +key;
            const val = this.dynamicFilters[attrId];
            const attr = this.categorySchema?.attributs.find(a => a.idAttributCategorie === attrId);
            
            if (val !== null && val !== undefined && val !== '') {
                const filter: any = { idAttributCategorie: attrId };
                let hasValue = false;
                
                switch (attr?.typeDonnee) {
                    case 'LISTE': 
                        filter.idOptionAttributCategorie = +val; 
                        hasValue = true;
                        break;
                    case 'TEXTE': 
                        filter.valeurTexte = val?.trim(); 
                        hasValue = !!filter.valeurTexte;
                        break;
                    case 'BOOLEAN': 
                        // Only filter if the user explicitly checked the switch
                        if (val === true) {
                            filter.valeurBooleen = true; 
                            hasValue = true;
                        }
                        break;
                    case 'NOMBRE': 
                    case 'DATE': 
                        if (attr.estPlage) {
                            if (val.min !== null && val.min !== undefined && val.min !== '') {
                                if (attr.typeDonnee === 'NOMBRE') filter.valeurNombreMin = +val.min;
                                else filter.valeurDateMin = val.min;
                                hasValue = true;
                            }
                            if (val.max !== null && val.max !== undefined && val.max !== '') {
                                if (attr.typeDonnee === 'NOMBRE') filter.valeurNombreMax = +val.max;
                                else filter.valeurDateMax = val.max;
                                hasValue = true;
                            }
                        } else {
                            // Single value mode
                            if (val !== null && val !== undefined && val !== '') {
                                if (attr.typeDonnee === 'NOMBRE') {
                                    filter.valeurNombreMin = +val;
                                    filter.valeurNombreMax = +val;
                                } else {
                                    filter.valeurDateMin = val;
                                    filter.valeurDateMax = val;
                                }
                                hasValue = true;
                            }
                        }
                        break;
                }
                
                if (hasValue) {
                    filtresDynamiques.push(filter);
                }
            }
        });
    }

    const trimmedSearch = this.searchQuery?.trim();
    const trimmedLocation = this.selectedLocation?.trim();

    this.annoncesService.getAnnonces(
        trimmedSearch || undefined,
        this.selectedCategoryId || undefined,
        this.minPrice || undefined,
        this.maxPrice || undefined,
        trimmedLocation || undefined,
        this.currentPage,
        this.pageSize,
        filtresDynamiques,
        this.sortBy === 'newest' ? 'newest' : (this.sortBy === 'price_asc' || this.sortBy === 'price_desc' ? 'price' : 'title'),
        this.sortBy === 'price_asc' ? 'asc' : (this.sortBy === 'price_desc' ? 'desc' : (this.sortBy === 'newest' ? 'desc' : 'asc'))
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.adsList = res.data.items || [];
          this.totalItems = res.data.totalCount || 0;
        } else {
          this.hasError = true;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching ads', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  fetchCategorySchema(id: number, callback?: () => void) {
    this.categoriesService.getCategorySchema(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const data = res.data as any;
          // Robustly handle casing: prefer 'attributs', fallback to 'Attributs'
          const attributes = data.attributs || data.Attributs || [];
          
          this.categorySchema = {
            ...data,
            attributs: attributes
          };

          this.dynamicFilters = {}; 
          this.categorySchema?.attributs.forEach((attr: any) => {
            if ((attr.typeDonnee === 'NOMBRE' || attr.typeDonnee === 'DATE') && attr.estPlage) {
              this.dynamicFilters[attr.idAttributCategorie] = { min: null, max: null };
            }
          });
        }
        if (callback) callback();
      },
      error: () => {
        if (callback) callback();
      }
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchQuery);
  }

  onFilterChange() {
    this.filterSubject.next();
  }

  updateUrl() {
    const queryParams: any = {
      category: this.selectedCategoryId || null,
      q: this.searchQuery?.trim() || null,
      minPrice: this.minPrice || null,
      maxPrice: this.maxPrice || null,
      location: this.selectedLocation || null,
      sortBy: this.sortBy !== 'newest' ? this.sortBy : null,
      page: 1
    };

    // Initialize all potential attributes to null to clear them from URL if not active
    this.categorySchema?.attributs.forEach(attr => {
      const id = attr.idAttributCategorie;
      queryParams[`attr_${id}`] = null;
      if ((attr.typeDonnee === 'NOMBRE' || attr.typeDonnee === 'DATE') && attr.estPlage) {
        queryParams[`attr_${id}_min`] = null;
        queryParams[`attr_${id}_max`] = null;
      }
    });

    // Serialize active dynamic filters
    Object.keys(this.dynamicFilters).forEach(key => {
      const id = +key;
      const val = this.dynamicFilters[id];
      const attr = this.categorySchema?.attributs.find(a => a.idAttributCategorie === id);

      if (val !== null && val !== undefined && val !== '') {
        if ((attr?.typeDonnee === 'NOMBRE' || attr?.typeDonnee === 'DATE') && attr?.estPlage) {
          const hasMin = val.min !== null && val.min !== undefined && val.min !== '';
          const hasMax = val.max !== null && val.max !== undefined && val.max !== '';
          
          if (hasMin) queryParams[`attr_${id}_min`] = val.min;
          if (hasMax) queryParams[`attr_${id}_max`] = val.max;
          // Mark presence if either is set
          if (hasMin || hasMax) queryParams[`attr_${id}`] = '1';
        } else {
          queryParams[`attr_${id}`] = val;
        }
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onLocationSelect(location: string) {
    this.selectedLocation = location;
    this.onFilterChange();
  }

  onLocationChange(event: any) {
    this.selectedLocation = event.target.value;
    this.onFilterChange();
  }

  onPriceChange() {
    this.onFilterChange();
  }

  onCategorySelect(id: number | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        category: id,
        page: 1 
      },
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(page: number) {
    if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  resetFilters() {
    this.router.navigate(['/ads']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
