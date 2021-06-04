import { LightningElement, track, wire } from 'lwc';
import getAvaliableProductsByContractId from '@salesforce/apex/OrderService.getAvaliableProductsByContractId';

import { publish, MessageContext, subscribe } from 'lightning/messageService';
import CONTRACT_MESSAGE from '@salesforce/messageChannel/Contract_Message__c';
import PRODUCT_MESSAGE from '@salesforce/messageChannel/Product_Message__c';


export default class ContractPicker extends LightningElement {

    @track products;

    @wire(MessageContext)
    messageContext;

    subscription = null;

    columns = [
        { label: 'Product Name', fieldName: 'ProdName' },
        { label: 'Price', fieldName: 'UnitPrice' },
        { label: 'Quantity', fieldName: 'Quantity', type: 'number', editable: true},
        { label: 'Product Id', fieldName: 'ProductId', fixedWidth: 1}
    ];



    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            CONTRACT_MESSAGE,
            (message) => this.handleContractMessage(message)
        );
    }
//    Id, Product2.Name, UnitPrice, Pricebook2Id , Product2.Id


    handleContractMessage(message) {
        getAvaliableProductsByContractId({contractId:  message.contractId})
            .then((result) => {
                this.products = result.map(c => { 
                    return {
                        ProductId : c.Product2.Id,
                        ProdName : c.Product2.Name,
                        UnitPrice : c.UnitPrice,
                        Quantity : 0,
                        PricebookEntryId: c.Id,
                        Pricebook2Id: c.Pricebook2Id
                    }
                });

                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
            });
    }
//TODO отправлять месседж с продуктами сборщику ордера
    handleSave(event){
        try{
            let newValues = event.detail.draftValues;
            let orderData = [];
            for (let i = 0; i < newValues.length; i++) {
    
                let tmpVal = this.products.find(element => element.ProductId === newValues[i].ProductId);
                if(tmpVal){
                    tmpVal.Quantity = newValues[i].Quantity;

                    orderData.push({
                        ProductId : tmpVal.ProductId,
                        ProdName : tmpVal.ProdName,
                        UnitPrice : tmpVal.UnitPrice,
                        Quantity : newValues[i].Quantity,
                        PricebookEntryId: tmpVal.PricebookEntryId,
                        Pricebook2Id: tmpVal.Pricebook2Id
                    });
                }
             }
             if(orderData.length > 0){
                 this.publishProducts(orderData);
             }else{
                 console.log("Не сохранилось!");
             }    
        }catch(e){
            console.log("Error:");
            console.log(e);
        }
    }

    publishProducts(productsForOrder){
        const data = {productsData : productsForOrder};
        console.log('product data:');
        console.log(data);
        publish(this.messageContext, PRODUCT_MESSAGE, data);
    }



    connectedCallback() {
        this.subscribeToMessageChannel();
    }


}