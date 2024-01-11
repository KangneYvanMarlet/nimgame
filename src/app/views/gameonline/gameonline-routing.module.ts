import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameonlinePage } from './gameonline.page';

const routes: Routes = [
  {
    path: '',
    component: GameonlinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameonlinePageRoutingModule {}
