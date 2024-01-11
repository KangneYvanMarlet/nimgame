import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./views/game/game.module').then( m => m.GamePageModule)
  },
  {
    path: 'gameonline',
    loadChildren: () => import('./views/gameonline/gameonline.module').then( m => m.GameonlinePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./views/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./views/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'firstpage',
    loadChildren: () => import('./views/auth/firstpage/firstpage.module').then( m => m.FirstpagePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
