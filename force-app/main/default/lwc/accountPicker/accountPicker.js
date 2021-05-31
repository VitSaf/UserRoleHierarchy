import { LightningElement, track, wire } from 'lwc';
import getAllAccounts from '@salesforce/apex/OrderService.getAllAccounts';

import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_MESSAGE from '@salesforce/messageChannel/Account_Message__c';

export default class AccountPicker extends LightningElement {

    @track accounts;

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        getAllAccounts()
        .then(result => {
            this.accounts = result.map(a => { 
                return {
                    label : a.Name,
                    value : a.Id
                }
            });
        })
        .catch((error) => {
            this.error = error;
        });

    }

    handleAccountChange(event){
        const data = {accountId : event.detail.value};
        console.log('data:');
        console.log(data);
        publish(this.messageContext, ACCOUNT_MESSAGE, data);
    }
    
}