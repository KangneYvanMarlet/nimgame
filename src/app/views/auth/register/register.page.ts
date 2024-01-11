import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  prenom = ''
  matricule = ''
  password = ''
  currentUser: any
  currentUserID: string | undefined;

  constructor(
    public modalCtrl: ModalController,
    private service: FirebaseService,
    private loadctrl: LoadingController,
    private route: Router
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  async register() {
    const loading = await this.loadctrl.create()
    await loading.present();
    await this.service.registerUser(this.matricule + '@gmail.com', this.password)
      .then(async (res) => {
        this.currentUser = res
        console.log("Enregistrement reussit : " , res);
        loading.dismiss()
        this.dismiss();
        this.route.navigate(['tabs/home'])
        await this.getId()
        localStorage.setItem('log', 'oui');
        const data = {
          uid: this.currentUserID,
          prenom: this.prenom,
          matricule: this.matricule,
          password: this.password
        }
        this.service.setDocument('users/' + this.currentUserID, data)
        localStorage.setItem('userCurrent', JSON.stringify(data))
      })
      .catch((err) => {
        console.log("Erreur d'enregistrement : " + err);
        loading.dismiss()
      })
  }


  async getId() {
    await this.service.getProfile()
      .then((res) => {
        this.currentUserID = res?.uid
      })
  }
  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
