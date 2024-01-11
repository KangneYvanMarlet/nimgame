import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  matricule = ''
  password = ''
  currentUser: any

  constructor(
    public modalCtrl: ModalController,
    private service: FirebaseService,
    private loadctrl: LoadingController,
    private route: Router
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  async login() {
    const loading = await this.loadctrl.create()
    await loading.present();
    await this.service.loginUser(this.matricule + '@gmail.com', this.password)
      .then((res) => {
        this.currentUser = res
        // console.log("Connexion reussit : ", res.user);
        this.route.navigate(['tabs/home'])
        localStorage.setItem('log', 'oui');
        let userdata = ''
        this.service.getData('users', res.user?.uid || '').subscribe((doc: any) => {
          userdata = doc.data();
          localStorage.setItem('userCurrent', JSON.stringify(userdata))
          loading.dismiss()
          this.modalCtrl.dismiss();
        });
      })
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }



}
