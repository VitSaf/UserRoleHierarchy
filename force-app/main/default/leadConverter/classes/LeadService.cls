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

}
