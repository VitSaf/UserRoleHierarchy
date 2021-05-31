import { LightningElement, track } from 'lwc';
import getNumber from '@salesforce/apex/Changer.getNumber';


export default class ChangerDemonstrator extends LightningElement {
    @track num;

    connectedCallback(){
        getNumber()
            .then(result => {
                console.log('res'+result);
                this.num = result;
                console.log('num'+this.num);
            })
            .catch(error => {
                this.error = error;
            });
            
    }
}