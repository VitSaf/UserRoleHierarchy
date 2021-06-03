import { LightningElement, track, wire } from 'lwc';
import getAllOrderItems from '@salesforce/apex/OrderService.getAllOrderItems';
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

    @track orderItems;

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


    //                             priceBookEntryId:  this.productsData[i].PricebookEntryId,
    //                             product2Id: this.productsData[i].ProductId,
    //                             quantity: this.productsData[i].Quantity,
    //                             orderId: this.currentOrder.Id,
    //                             unitPrice: this.productsData[i].UnitPrice
    //                         }

//(Id accountId, Id contractId, Id priceBookEntryId, Double unitPrice, Map<Id, List<Double>> products)
    createNewOrder = function(prods){
        try{
            let argsO = {
                accountId:  this.accountId,
                contractId: this.contractId,
                priceBookEntryId:  this.productsData[0].PricebookEntryId,
                product2Id: this.productsData[0].ProductId,
                unitPrice: this.productsData[0].UnitPrice,
                products: prods
            };
            console.log('argsO');
            console.log(argsO);
            createOrder(argsO)
                .then((result) => {
                    this.currentOrder = result;
                    console.log('createOrder:');
                    console.log(result);
                    }).then( () => {
                        console.log('Hello!' + this.currentOrder.Id);
                        getAllOrderItems({orderId : this.currentOrder.Id}).then( (result) => {
                            console.log('HelloResult');
                            console.log(result);
                            this.orderItems = result;
                        })
                    })
                .catch((error) => {
                    console.log(error);
                });
        }catch(e){
            console.log(e);
        }

    }

//(Id priceBookEntryId, Id product2Id, Double quantity, Id orderId, Double unitPrice)


    subscribeToProductsMessageChannel() {
        this.productsSubscription = subscribe(
            this.messageContext,
            PRODUCT_MESSAGE,
            (message) => this.handleProductsMessage(message)
        );
    }

    handleProductsMessage(message) {
        this.productsData = message.productsData;
        let prods = [];//new Map();
        for(let i = 0; i < this.productsData.length; i++){
            prods.push([this.productsData[i].ProductId, parseFloat(this.productsData[i].Quantity), parseFloat(this.productsData[i].UnitPrice)]);
        }
        console.log('Map');
        console.log(prods);
        this.createNewOrder(prods);
         //setTimeout(() => { this.orderItems = this.createItemsForOrder();}, 500);  
    }

    connectedCallback() {
        this.subscribeToAccountMessageChannel();
        this.subscribeToContractMessageChannel();
        this.subscribeToProductsMessageChannel();
    }

}