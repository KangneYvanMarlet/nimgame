import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    public fireAuth: AngularFireAuth,
    public firestore: AngularFirestore,
  ) { }

  async registerUser(matricule: string, password: string) {
    return await this.fireAuth.createUserWithEmailAndPassword(matricule, password)
  }

  async loginUser(matricule: string, password: string) {
    return await this.fireAuth.signInWithEmailAndPassword(matricule, password)
  }

  async signOut() {
    return await this.fireAuth.signOut()
  }

  async getProfile() {
    return await this.fireAuth.currentUser
  }

  docRef(path: string) {
    return this.firestore.doc(path).ref;
  }

  setDocument(path: string, data: DocumentData) {
    const dataRef = this.docRef(path);
    return dataRef.set(data);
  }

  getData(collection: string, docId: string) {
    return this.firestore.collection(collection).doc(docId).get()
  }

  cleanDataByDocId(collection: string, docId: string) {
    return this.firestore.collection(collection).doc(docId).delete()
  }

  cleanDataByCollectionId(collection: string) {
    let collectionRef = this.firestore.collection(collection);
    collectionRef.get().subscribe((querySnapshot) => {
      let firestore = firebase.firestore();
      let batch = firestore.batch();
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    });
  }

}

