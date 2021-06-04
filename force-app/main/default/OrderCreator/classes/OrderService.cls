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
    public static Order createOrder(Id accountId, Id contractId, Id priceBookEntryId, Double unitPrice, List<List<String>>  products){
        try{
            Order newOrder =  new Order(AccountId = accountId, OwnerId = [SELECT Id, OwnerId FROM Account WHERE Id = :accountId].OwnerId,  Status='Draft', ContractId = contractId, EffectiveDate = Date.today());
            insert newOrder;
    
            System.debug(OrderService.createOrderItem(priceBookEntryId, newOrder.Id, products));
    
            return newOrder;
        }catch(Exception e){
            throw e;
        }

    }
    @AuraEnabled
    public static List<OrderItem> createOrderItem(Id priceBookEntryId, Id orderId, List<List<String>> products){//Map<Id, List<Double>> products){
        try {
            List<OrderItem> newOrderitemList = new List<Orderitem>();
            System.debug('Map;');
            System.debug(products);
            //System.System.debug(products.values());
            for(List<String> l1: products){
               newOrderitemList.add(new OrderItem(
                   PricebookEntryId = priceBookEntryId, 
                   Product2Id =  l1[0], 
                   OrderId = orderId, 
                   Quantity = Double.valueOf(l1[1]),//products.get(prodId)[0], 
                   UnitPrice = Double.valueOf(l1[2])
                   ));
            }
            insert newOrderItemList;
            return newOrderItemList;

        } catch (Exception e) {
            throw e;
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getAllOrderItems(Id orderId){
        try {
            return [SELECT Id,  TotalPrice, UnitPrice, Quantity FROM OrderItem WHERE OrderId= :orderId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
