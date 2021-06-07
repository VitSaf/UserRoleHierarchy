public with sharing class LeadTriggerHandler {
    public void leadConvertTracker(List<Lead> oldLeadsList, Map<Id, Lead> newLeadsMap){
        try{
            for(Integer i = 0; i > oldLeadsList.size(); i++){
                if(oldLeadsList[i].IsConverted != newLeadsMap.get(oldLeadsList[i].Id).IsConverted){
                    User u = [SELECT Id, LastConvertedDate__c FROM User WHERE Id = :newLeadsMap.get(oldLeadsList[i].Id).LastModifiedById];
                    u.LastConvertedDate__c = Datetime.now();
                    update u;
                    return ;
                }
            }
        }catch(Exception e){
            System.debug(e + ' User.LastConvertedDate__c is not updated ' + Datetime.now());
        }

    }
}
