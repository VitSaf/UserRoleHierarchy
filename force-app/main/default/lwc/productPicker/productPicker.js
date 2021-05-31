import { LightningElement, track, wire } from 'lwc';
import getAvaliableProductsByContractId from '@salesforce/apex/OrderService.getAvaliableProductsByContractId';

import { publish, MessageContext, subscribe } from 'lightning/messageService';
import CONTRACT_MESSAGE from '@salesforce/messageChannel/Contract_Message__c';

export default class ContractPicker extends LightningElement {

    @track products;

    @wire(MessageContext)
    messageContext;

    subscription = null;



    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        console.log('BOOMC!');
        this.subscription = subscribe(
            this.messageContext,
            CONTRACT_MESSAGE,
            (message) => this.handleContractMessage(message)
        );
    }

    handleContractMessage(message) {
        console.log('contract msg:');
        console.log(message);
        getAvaliableProductsByContractId({contractId:  message.contractId})
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


    connectedCallback() {
        this.subscribeToMessageChannel();
    }
}