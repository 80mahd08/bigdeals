import { OrdersService } from '../../../../core/services/orders.service';
import { ClientActionsService } from '../../../../core/services/client-actions.service';
import { Commande } from '../../../../core/models';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: false
})
export class DetailsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  order$: Observable<Commande | null>;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private clientActions: ClientActionsService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.order$ = this.ordersService.getOrderById(id).pipe(map(res => res.data || null));
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Marketplace' },
      { label: 'Mes Commandes', link: '/client/orders' },
      { label: 'Détails Commande', active: true }
    ];
  }

  async submitReview(idAnnonce: number) {
    const { value: text } = await Swal.fire({
      title: 'Laisser un avis',
      input: 'textarea',
      inputLabel: 'Votre commentaire',
      inputPlaceholder: 'Qu\'avez-vous pensé de cet article ?',
      showCancelButton: true,
      confirmButtonText: 'Envoyer',
      cancelButtonText: 'Annuler',
      inputValidator: (value) => {
        if (!value) return 'Vous devez écrire quelque chose !';
        return null;
      }
    });

    if (text) {
      const { value: rating } = await Swal.fire({
        title: 'Note',
        input: 'select',
        inputOptions: {
          '5': '⭐⭐⭐⭐⭐ (Excellent)',
          '4': '⭐⭐⭐⭐ (Très bien)',
          '3': '⭐⭐⭐ (Moyen)',
          '2': '⭐⭐ (Mauvais)',
          '1': '⭐ (Très mauvais)'
        },
        inputPlaceholder: 'Choisissez une note',
        showCancelButton: true,
        confirmButtonText: 'Valider'
      });

      if (rating) {
        this.clientActions.createAvis(idAnnonce, Number(rating), text).subscribe(() => {
          Swal.fire('Merci !', 'Votre avis a été enregistré.', 'success');
        });
      }
    }
  }

  printInvoice() {
    window.print();
  }
}
