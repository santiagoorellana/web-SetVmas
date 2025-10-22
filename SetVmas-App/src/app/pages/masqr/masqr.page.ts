import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AnuncioService } from '../../services/anuncio.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-masqr',
  templateUrl: './masqr.page.html',
  styleUrls: ['./masqr.page.scss'],
})
export class MasqrPage {

  referido: string;

  constructor(
    private modal: PopoverController,
    private service: AnuncioService,
  ) { }

  ionViewWillEnter() {
    this.service.currentUser.subscribe(user => this.referido = environment.refUrl + user.Codigo);
  }

  async cancel() {
    const modal = await this.modal.getTop();
    modal.dismiss();
  }
}
