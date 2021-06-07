trigger LeadConvertationTracker on Lead (before update) {
    new LeadTriggerHandler().leadConvertTracker(Trigger.old, Trigger.newMap);
}