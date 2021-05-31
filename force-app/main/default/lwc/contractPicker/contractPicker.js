import { LightningElement, track, wire } from 'lwc';
import getContractsByAccountId from '@salesforce/apex/OrderService.getContractsByAccountId';

import { publish, MessageContext, subscribe } from 'lightning/messageService';
import ACCOUNT_MESSAGE from '@salesforce/messageChannel/Account_Message__c';
import CONTRACT_MESSAGE from '@salesforce/messageChannel/Contract_Message__c';


export default class ContractPicker extends LightningElement {

    @track contracts;

    @wire(MessageContext)
    messageContext;

    subscription = null;



    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        console.log('BOOM!');
        this.subscription = subscribe(
            this.messageContext,
            ACCOUNT_MESSAGE,
            (message) => this.handleAccountMessage(message)
        );
    }

    handleAccountMessage(message) {
        console.log('msg:');
        console.log(message);
        getContractsByAccountId({accountId:  message.accountId})
            .then((result) => {
                console.log('contracts result:');
                console.log(result);
                this.contracts = result.map(c => { 
                    return {
                        label : c.ContractNumber,
                        value : c.Id
                    }
                });
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
            });
    }

    handleContractChange(event){
        const data = {contractId : event.detail.value};
        console.log('contract data:');
        console.log(data);
        publish(this.messageContext, CONTRACT_MESSAGE, data);
    }
    

    connectedCallback() {
        this.subscribeToMessageChannel();
    }
}