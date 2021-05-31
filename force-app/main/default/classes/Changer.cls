global with sharing class Changer implements Schedulable{

    public static Integer num = 0;
    private static final String CRON_EXP = '0 56 10 * * ? 2021';


    public Changer() {

    }

    global void execute(SchedulableContext ctx) {
        Changer.num++;
    }




    public static String startScheduling(){
            return System.schedule('Scheduling example', CRON_EXP, new Changer());
    }

    @AuraEnabled(cacheable=true)
    public static Integer getNumber(){
        try {
            return Changer.num;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}