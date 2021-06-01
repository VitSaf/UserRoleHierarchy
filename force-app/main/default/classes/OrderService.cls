public with sharing class OrderService {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAllAccounts(){
        return [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contract> getContractsByAccountId(Id accountId){
        return[SELECT Id, ContractNumber FROM Contract WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
    }

    @AuraEnabled(cacheable=true)
    public static List<PricebookEntry> getAvaliableProductsByContractId(Id contractId){
        Id pricebookIdTmp = [SELECT Pricebook2Id FROM Contract WHERE Id = :contractId][0].Pricebook2Id;
        return [SELECT Id, Product2.Name, UnitPrice
        , Pricebook2Id , Product2.Id
        FROM PricebookEntry WHERE Pricebook2Id = :pricebookIdTmp];
    }

    @AuraEnabled
    public static Order createOrder(Id accountId, Id contractId){
        Order newOrder =  new Order(AccountId = accountId, OwnerId = [SELECT Id, OwnerId FROM Account WHERE Id = :accountId].OwnerId,  Status='Draft', ContractId = contractId, EffectiveDate = Date.today());
        insert newOrder;
        return newOrder;
    }

    @AuraEnabled
    public static OrderItem createOrderItem(Id priceBookEntryId, Id product2Id, Double quantity, Id orderId, Double unitPrice){
        OrderItem newOrderItem = new OrderItem(PricebookEntryId = priceBookEntryId, Product2Id = product2Id, Quantity = quantity, OrderId = orderId, UnitPrice = unitPrice);
        insert newOrderItem;
        return newOrderItem;
    }
    //SELECT Product2Id, Pricebook2Id, Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id = '01s0900000DYlkjAAD'
}