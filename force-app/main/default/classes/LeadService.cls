public with sharing class LeadService {
    @AuraEnabled(cacheable=true)
    public static List<Lead> getAllLeads(){
        try {
            return[SELECT Id, Name, Company, Status, Rating, IsConverted, ConvertedAccountId, ConvertedContactId, ConvertedOpportunityId FROM Lead WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

/**
 * return generated [AccountId, ContactId, OpportunityId] for this Lead
 */
    @AuraEnabled
    public static Boolean convertLead(Id leadId){
        try {
            Database.LeadConvert convert = new Database.LeadConvert();
            convert.setLeadId(leadId);
            convert.setConvertedStatus('Closed - Converted');
            Database.LeadConvertResult convertResult = Database.convertLead(convert);

            System.debug(convertResult.isSuccess());
            return convertResult.isSuccess();

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static Account getAccountById(Id accountId){
        return [SELECT Id, Name, Industry, Phone  FROM Account WHERE Id = :accountId WITH SECURITY_ENFORCED LIMIT 1][0];
    }

    @AuraEnabled(cacheable=true)
    public static User getUserById(Id accountId){
        Id userId = [SELECT CreatedById FROM Account WHERE Id= :accountId][0].CreatedById;
        return [SELECT Id, Name, LastConvertedDate__c FROM User WHERE Id= :userId][0];
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, sObject> getConnectedObjects(Id leadId){
        try {
            Map<String, sObject> mObj = new Map<String, sObject>();

            Lead lead = [SELECT Id, IsConverted, ConvertedAccountId, ConvertedContactId, ConvertedOpportunityId FROM Lead WHERE Id = :leadId WITH SECURITY_ENFORCED];
            if(lead.IsConverted){
                mObj.put('Account',[SELECT Id, Name FROM Account WHERE Id = :lead.ConvertedAccountId WITH SECURITY_ENFORCED LIMIT 1][0]);
                mObj.put('Contact',[SELECT Id, Name FROM Contact WHERE Id = :lead.ConvertedContactId WITH SECURITY_ENFORCED LIMIT 1][0]);
                mObj.put('Opportunity',[SELECT Id, Name FROM Opportunity WHERE Id = :lead.ConvertedOpportunityId WITH SECURITY_ENFORCED LIMIT 1][0]);
            }
            return mObj;
            

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static void example(){
        Lead goodGuyEddy = [SELECT Id, Name, OwnerId FROM Lead WHERE Id = '00Q09000007Av1TEAS'][0];
        Database.LeadConvert convert = new Database.LeadConvert();
        convert.setLeadId(goodGuyEddy.Id);
        convert.setConvertedStatus('Closed - Converted');
        Database.LeadConvertResult convertResult = Database.convertLead(convert);
        Account coolGuyEddyAcc = [SELECT Id, Name FROM Account WHERE Id=:convertResult.getAccountId()];
        Contact coolGuyEddyCont = [SELECT Id, Name FROM Contact WHERE Id=:convertResult.getContactId()];
        Opportunity coolGuyEddyOpp = [SELECT Id, Name FROM Opportunity WHERE Id=:convertResult.getOpportunityId()];
        System.debug(coolGuyEddyAcc +' ' + coolGuyEddyCont +' ' + coolGuyEddyOpp);
    }

}
