import { LightningElement, track, wire } from 'lwc';
import getAllLeads from '@salesforce/apex/LeadService.getAllLeads';
import convertLead from '@salesforce/apex/LeadService.convertLead';


import { publish, MessageContext, subscribe } from 'lightning/messageService';
import ACCOUNT_MESSAGE from '@salesforce/messageChannel/Account_Message__c';

export default class LeadConverter extends LightningElement {
    @track leads;

    @wire(MessageContext)
    messageContext;

    @track newAccount;


    connectedCallback() {
        this.renderList();
    }

    handleConvertClick(event){
        let Id = event.target.title;

        convertLead({leadId: Id})
            .then(result =>{
                //TODO MAKE IT WORK!
                if(result){
                    this.renderList();
                }
                Location.reload();
            })
            .catch((error) => {
                this.error = error;
            });
        
    }
//    Id, Name, Industry, Phone
    handleShowAccClick(event){
        const data = {accountId : event.target.title};
        console.log('published account data:');
        console.log(data);
        publish(this.messageContext, ACCOUNT_MESSAGE, data);
    }


    renderList(){
        getAllLeads()
        .then((result) => {
            this.leads = result;
            })
        .catch((error) => {
            console.log(error);
        });
    }
}