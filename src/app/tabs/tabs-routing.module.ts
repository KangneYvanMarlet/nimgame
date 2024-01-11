import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../views/home/home.page').then( m => m.HomePage)
      },
      {
        path: 'historic',
        loadChildren: () => import('../views/historic/historic.module').then( m => m.HistoricPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../views/about/about.module').then( m => m.AboutPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
