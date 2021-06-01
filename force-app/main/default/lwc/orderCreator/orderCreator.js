import { LightningElement, track, wire } from 'lwc';
import createOrderItem from '@salesforce/apex/OrderService.createOrderItem';
import createOrder from '@salesforce/apex/OrderService.createOrder';

import {MessageContext, subscribe } from 'lightning/messageService';
import ACCOUNT_MESSAGE from '@salesforce/messageChannel/Account_Message__c';
import CONTRACT_MESSAGE from '@salesforce/messageChannel/Contract_Message__c';
import PRODUCT_MESSAGE from '@salesforce/messageChannel/Product_Message__c';

export default class OrderCreator extends LightningElement {

    @track accountId;
    @track contractId;
    @track productsData;

    @track currentOrder;

    @track orderItems = [];

    @wire(MessageContext)
    messageContext;

    accountSubscription = null;
    contractSubscription = null;
    productsSubscription = null;



    subscribeToAccountMessageChannel() {
        this.accountSubscription = subscribe(
            this.messageContext,
            ACCOUNT_MESSAGE,
            (message) => this.handleAccountMessage(message)
        );
    }

    handleAccountMessage(message) {
        this.accountId = message.accountId;
    }

    subscribeToContractMessageChannel() {
        this.contractSubscription = subscribe(
            this.messageContext,
            CONTRACT_MESSAGE,
            (message) => this.handleContractMessage(message)
        );
    }


    handleContractMessage(message) {
        this.contractId = message.contractId;
    }

//(Id accountId, Id contractId)
    createNewOrder = function(){
        createOrder({
            accountId:  this.accountId,
            contractId: this.contractId
        })
            .then((result) => {
                this.currentOrder = result;

                this.orderItems = this.createItemsForOrder();
                })
            .catch((error) => {
                console.log(error);
            });
    }

//(Id priceBookEntryId, Id product2Id, Double quantity, Id orderId, Double unitPrice)
    createItemsForOrder = function(){
        try{
            for(let i = 0; i < this.productsData.length; i++){
                createOrderItem({
                            priceBookEntryId:  this.productsData[i].PricebookEntryId,
                            product2Id: this.productsData[i].ProductId,
                            quantity: this.productsData[i].Quantity,
                            orderId: this.currentOrder.Id,
                            unitPrice: this.productsData[i].UnitPrice
                        })
                        .then((result) => {
                                console.log('result items');
                                console.log(result);
                                items.push(result);
                                })
                            .catch((error) => {
                                console.log(error);
                            });
                        }
        }catch(e){
            console.log(e);
        }
        console.log('items');
        console.log(items);
        return items;
    }

    subscribeToProductsMessageChannel() {
        this.productsSubscription = subscribe(
            this.messageContext,
            PRODUCT_MESSAGE,
            (message) => this.handleProductsMessage(message)
        );
    }

    handleProductsMessage(message) {
        this.productsData = message.productsData;

        this.createNewOrder();

        //setTimeout(() => { this.orderItems = this.createItemsForOrder();}, 500);
       
    }

    connectedCallback() {
        this.subscribeToAccountMessageChannel();
        this.subscribeToContractMessageChannel();
        this.subscribeToProductsMessageChannel();
    }

}