import { Component, OnInit } from '@angular/core';
import { AnimationController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  tabDisplay: any[] = []
  pile: number = 20;
  joueur: string = '';
  nameGamer: string = '';
  message: string = '';
  modalIsOpen: boolean = false;
  nombreDuJoueurCourant = 0;
  displayNbSystem = false

  constructor(
    private animationCtrl: AnimationController,
    private modale: ModalController,
  ) {
    this.openModal();
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  nouveauJeu() {
    this.joueur = 'humain'; // Le joueur humain commence
    this.message = 'À vous de jouer!';
    this.tabDisplay = []
    for (let index = 0; index < this.pile; index++) {
      this.tabDisplay.push(index)
    }
    this.modalIsOpen = false
  }

  // Retirer un nombre d'objets de la pile
  
  retirer(nombre: number) {
    // Vérifier que le coup est valide
    if (this.pile >= nombre && nombre > 0 && nombre <= 3) {
      // Mettre à jour la pile
      this.pile -= nombre;
      this.nombreDuJoueurCourant = nombre
      for (let index = 0; index < this.nombreDuJoueurCourant; index++) {
        this.tabDisplay.pop()
      }
      // Changer de joueur
      if (this.joueur === 'humain') {
        this.joueur = 'systeme'
      } else {
        this.joueur = 'humain'
      }
      // Vérifier si le jeu est terminé
      if (this.estTermine()) {
        // Afficher le message de victoire
        this.message = this.joueur === 'humain' ? 'Vous avez gagné!' : 'Vous avez perdu!';
      } else {
        // Afficher le message de tour
        this.message = this.joueur === 'humain' ? 'À vous de jouer!' : 'Au système de jouer!';
        this.nameGamer = this.joueur === 'humain' ? 'App a rétiré' : 'Vous avez rétiré';
        // Si c'est au système de jouer, appeler la fonction qui calcule le meilleur coup
        if (this.joueur === 'systeme') {
          setTimeout(() => this.jouerSysteme(), 3000)
        }
      }
    }
  }

  estTermine() {
    // Le jeu est terminé si la pile est vide
    return this.pile === 0;
  }

  jouerSysteme() {
    let nim = this.pile;
    // Si la position est gagnante, chercher un coup optimal
    if (nim % 2 == 0) {
      switch (this.nombreDuJoueurCourant) {
        case 1:
          this.retirer(3);
          this.nombreDuJoueurCourant = 3
          break;
        case 2:
          this.retirer(2);
          this.nombreDuJoueurCourant = 2
          break;
        case 3:
          this.retirer(1);
          this.nombreDuJoueurCourant = 1
          break;
        default:
          break;
      }
    } else {
      let nombre = Math.floor(Math.random() * 3) + 1;
      this.retirer(nombre);
    }
    this.displayNbSystem = true

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
    this.pile = 0;
    this.pile = 20;
    this.modalIsOpen = true
  }

  closeModal() {
    this.modale.dismiss();
    this.modalIsOpen = false
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
