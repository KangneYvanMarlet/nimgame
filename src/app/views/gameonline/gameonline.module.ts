import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameonlinePageRoutingModule } from './gameonline-routing.module';

import { GameonlinePage } from './gameonline.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameonlinePageRoutingModule
  ],
  declarations: [GameonlinePage]
})
export class GameonlinePageModule {}
