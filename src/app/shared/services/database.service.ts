import { Injectable, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { AuthenticationService } from './authentication.service';
import { Patient } from '../patient/patient';
import { Notes } from '../patient/notes';
import { Address } from '../patient/address';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DatabaseService {
  private _listSubscription: Subscription;
  private _patients: BehaviorSubject<Patient[]>;

  constructor(private _af: AngularFire, private _auth: AuthenticationService) {
    this._patients = new BehaviorSubject(<Patient[]>[]);
    this._af.auth.subscribe(auth => {
      if (auth) {
        this._listSubscription = this._af.database.list(auth.uid + '/patients').subscribe(patients => {
          this._patients.next(patients);
        })
      } else {
        if (this._listSubscription) { this._listSubscription.unsubscribe(); }
        this._patients.next(<Patient[]>[]);
      }
    });
  }

  private cleanUp<T>(item: T): T {
    for (let key in item) {
      if (key[0] == '$') { delete item[key]; }
      else if (typeof item[key] === 'undefined' || item[key] === null) { item[key] = ''; }
    }
    return item;
  }

  public get patients(): Observable<Patient[]> {
    return this._patients.asObservable();
  }

  public getPatient(id: String): Observable<Patient> {
    if (this._auth.authenticated) {
      return this._af.database.object(this._auth.uid + '/patients/' + id);
    }
    else {
      throw 'Error: Not Authenticated';
    }
  }

  public setPatient(id: string, patient: Patient = null) {
    if (this._auth.authenticated) {
      this.cleanUp(patient);
      let firebaseObject: FirebaseObjectObservable<Patient> = this._af.database.object(this._auth.uid + '/patients/' + id);
      firebaseObject.set(patient);
    }
    else {
      throw 'Error: Not Authenticated';
    }
  }

  public getPatientNotes(id: String): Observable<Notes> {
    if (this._auth.authenticated) {
      return this._af.database.object(this._auth.uid + '/patient-notes/' + id);
    }
    else {
      throw 'Error: Not Authenticated';
    }
  }

  public setPatientNotes(id: string, notes: Notes = null) {
    if (this._auth.authenticated) {
      this.cleanUp(notes);
      let firebaseObject: FirebaseObjectObservable<Patient> = this._af.database.object(this._auth.uid + '/patient-notes/' + id);
      firebaseObject.set(notes);
    }
    else {
      throw 'Error: Not Authenticated';
    }
  }

  public getPatientAddress(id: String): Observable<Address> {
    if (this._auth.authenticated) {
      return this._af.database.object(this._auth.uid + '/patient-address/' + id);
    }
    else {
      throw 'Error: Not Authenticated';
    }
  }

  public setPatientAddress(id: string, address: Address = null) {
    if (this._auth.authenticated) {
      this.cleanUp(address);
      let firebaseObject: FirebaseObjectObservable<Patient> = this._af.database.object(this._auth.uid + '/patient-address/' + id);
      firebaseObject.set(address);
    }
    else {
      throw 'Error: Not Authenticated';
    }
  }
}
