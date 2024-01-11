import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimationController, IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { GamePage } from '../game/game.page';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GameonlinePage } from '../gameonline/gameonline.page';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule, ReactiveFormsModule],

})
export class HomePage implements OnInit {

  modalIsOpen: boolean = false;
  bat: number = 20;
  pile: number = 20;
  matricule = '';
  currentUser: any
  currentUserID: any

  constructor(
    private animationCtrl: AnimationController,
    private modale: ModalController,
    private loadctrl: LoadingController,
    public service: FirebaseService,
    private appcmpt: AppComponent
  ) {
    this.getId();
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
  }


  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.appcmpt.Rafraichit(event)
      event.target.complete();
    }, 2000);
  }

  async goToGame(elt: number) {
    if (elt == 0) {
      const modale = await this.modale.create({
        component: GamePage
      });
      await modale.present();
    }
    else {
      this.modalIsOpen = true
    }
  }

  async nouveauJeu() {
    const loading = await this.loadctrl.create()
    await loading.present();
    this.sendInvitation(this.currentUser.uid, this.matricule, this.pile)
    loading.dismiss();
    this.modalIsOpen = false
  }

  generateUniqueId(date: Date) {
    const randomId = Math.random().toString(30).substring(1, 9).toUpperCase();
    const formattedDate = date.getFullYear().toString()
    return formattedDate + randomId
  }



  sendInvitation(idUser: string, matricule: string, pile: number) {
    let date = new Date();
    const data = {
      idAutor: idUser,
      prenom: this.currentUser.prenom,
      matriculeInvited: matricule,
      batonet: pile,
      joueur: this.currentUser.prenom,
    }
    const batonet = {
      idAutor: idUser,
      autor: this.currentUser.prenom,
      matriculeInvited: matricule,
      batonet: pile,
      joueur: this.currentUser.prenom,
    }
    this.service.setDocument('invitations/' + 'invitation' + idUser, data)
    this.service.setDocument('GamePartys/' + 'GameParty', batonet)
    localStorage.setItem('invitationSend', JSON.stringify(data))
  }

  async getId() {
    await this.service.getProfile()
      .then((res) => {
        this.currentUserID = res?.uid
      })
  }


  closeModal() {
    this.modale.dismiss();
    this.modalIsOpen = false
  }


  nbBatSubs() {
    if (this.pile > 20) {
      this.pile--
    }
  }

  nbBatAdd() {
    this.pile++
  }

  openModal() {
    this.pile = 20;
    this.modalIsOpen = true
  }


  //======================= ANIMATION ========================

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };


}
