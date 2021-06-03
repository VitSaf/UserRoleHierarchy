trigger LeadConvertationTracker on Lead (before update) {
    List<Lead> oldLeadsList = Trigger.old;
    Map<Id, Lead> newLeadsMap = Trigger.newMap; 
    for(Integer i = 0; i > oldLeadsList.size(); i++){
        if(oldLeadsList[i].IsConverted != newLeadsMap.get(oldLeadsList[i].Id).IsConverted){
            User u = [SELECT Id, LastConvertedDate__c FROM User WHERE Id = :newLeadsMap.get(oldLeadsList[i].Id).LastModifiedById];
            u.LastConvertedDate__c = Datetime.now();
            update u;
            return ;
        }
    }

}