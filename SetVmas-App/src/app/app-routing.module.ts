import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'add-announce', loadChildren: './pages/add-announce/add-announce.module#AddAnnouncePageModule' },
  { path: 'edit-announce', loadChildren: './pages/edit-announce/edit-announce.module#EditAnnouncePageModule' },
  { path: 'virtual-office', loadChildren: './pages/virtual-office/virtual-office.module#VirtualOfficePageModule' },
  { path: 'contact', loadChildren: './pages/contact/contact.module#ContactPageModule' },
  { path: 'help', loadChildren: './pages/help/help.module#HelpPageModule' },
  { path: 'buy-point', loadChildren: './pages/buy-point/buy-point.module#BuyPointPageModule' },
  { path: 'details', loadChildren: './pages/details/details.module#DetailsPageModule' },
  { path: 'mas-sell-point', loadChildren: './pages/mas-sell-point/mas-sell-point.module#MasSellPointPageModule' },
  { path: 'signin', loadChildren: './pages/signin/signin.module#SigninPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'restore-account', loadChildren: './pages/restore-account/restore-account.module#RestoreAccountPageModule' },
  { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule' },
  {
    path: 'confirm-account',
    loadChildren: () => import('./pages/confirm-account/confirm-account.module').then( m => m.ConfirmAccountPageModule)
  },
  {
    path: 'edit-announce',
    loadChildren: () => import('./pages/edit-announce/edit-announce.module').then( m => m.EditAnnouncePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
