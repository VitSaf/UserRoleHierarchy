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
        return [SELECT Product2.Name, UnitPrice FROM PricebookEntry WHERE Pricebook2Id = :pricebookIdTmp];
    }


    //SELECT Product2Id, Pricebook2Id, Id, Product2.Name FROM PricebookEntry WHERE Pricebook2Id = '01s0900000DYlkjAAD'
}