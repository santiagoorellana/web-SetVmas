import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {

  constructor() { }

  showMe = false;

  showLoading(show) {
    const loading = document.getElementById('loading');
    const loader = document.getElementById('loader');

    if (show) {
      loader.style.visibility = "visible";
      loading.classList.remove('hide-spinner');
    } else {
      loader.style.visibility = "none";
      loading.classList.add('hide-spinner');
    }
  }

}
