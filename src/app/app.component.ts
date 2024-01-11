import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { GameonlinePage } from './views/gameonline/gameonline.page';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  currentUser: any
  invitation: any
  invitationSend: any
  response: any;

  constructor(
    private navctrl: NavController,
    public firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private modale: ModalController,
    private service: FirebaseService,
  ) {
    this.redirect()
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
  }

  Rafraichit(event: any) {
    setTimeout(() => {
      // ====================== Attente de la reponse des invitations ===============================
      let response = this.firestore.collection('Responses').doc('Response');
      let ResponseRecue = response.ref.onSnapshot(async (docSnapshot: any) => {
        this.invitationSend = JSON.parse(localStorage.getItem('invitationSend') || '1')
        console.log('===== La response a changer ==== ', docSnapshot.data());
        if (docSnapshot.data()?.matricule === this.invitationSend?.matriculeInvited) {
          console.log('===== Il a repondu a mon invitation ==== ');
          if (docSnapshot.data()?.response === 'oui') {
            this.response = docSnapshot.data()
            console.log('===== Ca reponse est OUI ==== ');
            this.confirmGameAlertCtrl(this.invitationSend)
          }
        }
      }, (err: any) => {
        console.log(`Erreur d'invitation : ${err}`);
      });
      ResponseRecue
      event.target.complete();
    }, 2000);
  }

  redirect() {
    if (!this.isLogger()) {
      this.navctrl.navigateRoot('firstpage')
    }
  }

  isLogger() {
    let login = localStorage.getItem("log") || ''
    return true && login === 'oui'
  }

  // ====================== Attente des invitations ===============================
  inv = this.firestore.collection('invitations');
  InvitationRecu = this.inv.ref.onSnapshot((docSnapshot: any) => {
    docSnapshot.forEach((element: any) => {
      if (element.data().matriculeInvited === this.currentUser?.matricule) {
        this.invitation = element.data();
        localStorage.setItem('invitationRecue', JSON.stringify(this.invitation))
        console.log(" Invitation Recue", element.data());
        this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '')
        this.showAlertCtrl()
      }
    });
  }, (err: any) => {
    console.log(`Erreur d'invitation : ${err}`);
  });

  async showAlertCtrl() {
    const alert = await this.alertCtrl.create({
      header: 'Invitation',
      subHeader: this.invitation.prenom + ' vous invite a jouer une partie de NIM avec ' + this.invitation.batonet + ' batônets',
      buttons: [
        {
          text: 'Refuser',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Accepter',
          role: 'confirm',
          handler: async () => {
            const data = {
              idUser: this.currentUser.uid,
              nameUser: this.currentUser.prenom,
              matricule: this.currentUser.matricule,
              response: 'oui'
            }
            this.service.setDocument('Responses/' + 'Response', data)
            const modale = await this.modale.create({
              component: GameonlinePage
            });
            await modale.present();
          }
        }
      ]
    })
    await alert.present()
  }


  async confirmGameAlertCtrl(invitation: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      subHeader: invitation.matriculeInvited + ' a accepté votre invitation\n Voulez vous commencer a jouer ? ',
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
            localStorage.setItem('response', JSON.stringify(this.response))
            const modale = await this.modale.create({
              component: GameonlinePage
            });
            await modale.present();
          }
        }
      ]
    })
    await alert.present()
  }


  // ====================== Attente de la reponse des invitations ===============================
  res = this.firestore.collection('Responses').doc('Response');
  ResponseRecue = this.res.ref.onSnapshot(async (docSnapshot: any) => {
    this.invitationSend = JSON.parse(localStorage.getItem('invitationSend') || '1')
    console.log('===== La response a changer ==== ');
    if (docSnapshot.data()?.matricule === this.invitationSend?.matriculeInvited) {
      console.log('===== Il a repondu a mon invitation ==== ');
      if (docSnapshot.data()?.response === 'oui') {
        this.response = docSnapshot.data()
        console.log('===== Ca reponse est OUI ==== ');
        this.confirmGameAlertCtrl(this.invitationSend)
      }
    }
  }, (err: any) => {
    console.log(`Erreur d'invitation : ${err}`);
  });


  // ====================== Ecoute des modifications du user ===============================
  user = this.firestore.collection('users');
  userEcoute = this.user.ref.onSnapshot((docSnapshot: any) => {
    docSnapshot.forEach((element: any) => {
      if (element.data().matricule === this.currentUser?.matricule) {
        if (element.data().nbGamePartyWin === 3) {
          let data = {
            uid: this.currentUser.uid,
            prenom: this.currentUser.prenom,
            matricule: this.currentUser.matricule,
            password: this.currentUser.password,
            niveau: 'Professionnel',
            nbGameParty: this.currentUser.nbGameParty,
            nbGamePartyWin: this.currentUser.nbGamePartyWin,
            nbGamePartyLoss: this.currentUser.nbGamePartyLoss,
          }
          this.service.setDocument('users/' + this.currentUser.uid, data)
          localStorage.setItem('userCurrent', JSON.stringify(data))
        }
      }
    });
  }, (err: any) => {
    console.log(`Erreur d'invitation : ${err}`);
  });


}
