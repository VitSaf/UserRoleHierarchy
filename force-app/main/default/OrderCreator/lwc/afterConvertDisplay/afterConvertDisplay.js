import { LightningElement, track, wire } from 'lwc';

import { publish, MessageContext, subscribe } from 'lightning/messageService';
import ACCOUNT_MESSAGE from '@salesforce/messageChannel/Account_Message__c';
import getAccountById from '@salesforce/apex/LeadService.getAccountById';
import getUserById from '@salesforce/apex/LeadService.getUserById';


import qustionMark from '@salesforce/resourceUrl/qustion_mark';



export default class AfterConvertDisplay extends LightningElement {

    @track newAccount;
    @track user;

    @wire(MessageContext)
    messageContext;

    qustionMarkUrl = qustionMark;

    subscription = null;



    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            ACCOUNT_MESSAGE,
            (message) => this.handleAccountMessage(message)
        );
    }

    handleAccountMessage(message) {
        getAccountById({accountId:message.accountId})
            .then(result => {
            this.newAccount = result;
        });
    
        getUserById({accountId:message.accountId})
            .then(result => {
                this.user = result;
                console.log(result);
            });
        
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    get backgroundStyle() {
        return `background-image:url(${this.qustionMarkUrl})`;
    }


}