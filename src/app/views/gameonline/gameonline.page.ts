/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, AnimationController, LoadingController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-gameonline',
  templateUrl: './gameonline.page.html',
  styleUrls: ['./gameonline.page.scss'],
})

export class GameonlinePage implements OnInit {

  tabDisplay: any[] = []
  pile: number = 20;
  joueur: string = '';
  nameGamer: string = '';
  message: string = '';
  modalIsOpen: boolean = false;
  nombreDuJoueurCourant = 0;
  displayNbOfCurrentMove = false;
  matricule = '';
  currentUserID: any
  currentUser: any
  displayNbSystem = false
  invitation: any
  invitationRecue: any
  invitationSend: any
  responseInvited = false;
  GameParty: any
  response: any

  constructor(
    private animationCtrl: AnimationController,
    public service: FirebaseService,
    private loadctrl: LoadingController,
    public firestore: AngularFirestore,
    private modale: ModalController,
    private alertCtrl: AlertController,
  ) {
    this.getId();
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
    this.invitationRecue = localStorage.getItem('invitationRecue')
    this.invitationSend = localStorage.getItem('invitationSend')
    this.invitationRecue ? this.invitation = JSON.parse(this.invitationRecue) : this.invitation = JSON.parse(this.invitationSend)
    // console.log('Invitation : ', this.invitation);
    this.pile = this.invitation.batonet
    for (let index = 0; index < this.pile; index++) {
      this.tabDisplay.push(index)
    }
    this.getGameParty()
    this.response = JSON.parse(localStorage.getItem('response') || '0')
  }

  getGameParty() {
    this.service.getData('GamePartys', 'GameParty').subscribe((doc: any) => {
      this.GameParty = doc.data();
      this.joueur = doc.data().joueur
      // this.pile = doc.data().batonet;
      console.log('this.GameParty == ', this.GameParty);
    });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
    this.getGameParty()

  }

  async getId() {
    await this.service.getProfile()
      .then((res) => {
        this.currentUserID = res?.uid
      })
  }

  generateUniqueId(date: Date) {
    const randomId = Math.random().toString(30).substring(1, 9).toUpperCase();
    const formattedDate = date.getFullYear().toString()
    return formattedDate + randomId
  }

  // Retirer un nombre d'objets de la pile
  retirer(nombre: number) {
    // Vérifier que le coup est valide
    if (this.pile >= nombre && nombre > 0 && nombre <= 3) {
      // Mettre à jour la pile
      if (this.GameParty.joueur === this.invitation.prenom) {
        let date = new Date();
        let batonet = {
          idAutor: this.currentUser.uid,
          autor: this.currentUser.prenom,
          matriculeInvited: this.invitation.matriculeInvited,
          batonet: this.pile - nombre,
          joueur: this.response.nameUser,
        }
        this.service.setDocument('GamePartys/' + 'GameParty', batonet)
      } else {
        let date = new Date();
        let batonet = {
          idAutor: this.currentUser.uid,
          autor: this.currentUser.prenom,
          matriculeInvited: this.invitation.matriculeInvited,
          batonet: this.pile - nombre,
          joueur: this.invitation.prenom,
        }
        this.service.setDocument('GamePartys/' + 'GameParty', batonet)
      }

      // let Pile = this.firestore.collection('GamePartys').doc(this.currentUser.matricule + this.invitation.matriculeInvited);
      // let pileChange = Pile.ref.onSnapshot(async (docSnapshot: any) => {
      //   this.pile = docSnapshot.data()?.batonet
      //   console.log('New value Pile : ', docSnapshot.data()?.batonet);
      // }, (err: any) => {
      //   console.log(`Erreur de mise a jour de la pile : ${err}`);
      // });
      // pileChange
      // this.nombreDuJoueurCourant = nombre
      // for (let index = 0; index < this.nombreDuJoueurCourant; index++) {
      //   this.tabDisplay.pop()
      // }

      // Vérifier si le jeu est terminé
      if (this.estTermine()) {
        // Afficher le message de victoire
        this.message = this.joueur === this.invitation.prenom ? 'Vous avez gagné!' : 'Vous avez perdu!';
      } else {
        // Afficher le message de tour
        this.message = this.joueur === this.invitation.prenom ? 'À vous de jouer!' : '';
        this.nameGamer = this.joueur === this.invitation.prenom ? 'Votre ami a rétiré' : 'Vous avez rétiré';
      }
    }
  }

  estTermine() {
    if (this.pile === 0) {
      localStorage.removeItem('invitationRecue')
      localStorage.removeItem('invitationSend')
      this.service.cleanDataByDocId('GamePartys', 'GameParty')
      this.service.cleanDataByCollectionId('invitations')
      return true;
    }
    return false
  }


  // ====================== Attente de la modification de la pile ===============================
  Piles = this.firestore.collection('GamePartys').doc('GameParty');
  pileChange = this.Piles.ref.onSnapshot((docSnapshot: any) => {
    console.log("Changement de la pile : ", docSnapshot.data());
    this.pile = docSnapshot.data()?.batonet
    this.GameParty = docSnapshot.data()
    this.joueur = docSnapshot.data().joueur
    this.tabDisplay = []
    for (let index = 0; index < this.pile; index++) {
      this.tabDisplay.push(index)
    }
  })



  nbBatSubs() {
    if (this.pile > 20) {
      this.pile--
    }
  }

  nbBatAdd() {
    this.pile++
  }


  async confirmGameAlertCtrl() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      subHeader: 'Voulez vous vraiment quitter la partie ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Oui',
          role: 'confirm',
          handler: async () => {
            this.closeModal()
          }
        }
      ]
    })
    await alert.present()
  }


  closeModal() {
    this.modale.dismiss()
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
