import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ConfiguracionesService} from '../configuration/configuration.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AnunciosModel} from '../../models/anuncios.model';

@Injectable({
  providedIn: 'root'
})
export class BuscarAnunciosService {

  public resultadoAnunciosObserver = new BehaviorSubject<AnunciosModel[]>([]);
  public ListaAnunciosObservable = this.resultadoAnunciosObserver.asObservable();
  public CantidadTotalAnunciosObserver = new BehaviorSubject<number>(0);
  public CantiadAnunciosTotalObservable = this.CantidadTotalAnunciosObserver.asObservable();
  public textoBuscarObserver = new BehaviorSubject<string>('');
  public textoBuscarObservable = this.textoBuscarObserver.asObservable();
  ListaAnuncios: AnunciosModel[];


  // ***************************Para carcgar id de anuncio a ver en detalle***************************************************
  public updateAnuncioReciente = new BehaviorSubject<boolean>(false);
  public reciente$ = this.updateAnuncioReciente.asObservable();

  // ************************************************************************************************



  readonly rootURL = this.servConfiguracion.getRootURLApi();
  constructor(private http: HttpClient,
              private servConfiguracion: ConfiguracionesService,
              private router: Router,
              private toastr: ToastrService) { }

    ngOnDestroy(): void {
        this.updateAnuncioReciente.unsubscribe();

    }


}
