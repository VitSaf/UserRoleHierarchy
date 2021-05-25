public class HierarchyBuilder {
	Map<String, List<UserRole>> hierarchy;
    Map<String, UserRole> idUserRoleMap;
    
    public HierarchyBuilder(){
        List<UserRole> urList = this.getAllRoles();
        idUserRoleMap = new Map<String, UserRole>();
        hierarchy = new Map<String, List<UserRole>>();
        this.mapper(urList);
        this.mapByParents(urList);
        
    }
    //Добавить в каждый объект родитель знание о его чайлдах
    //и в каждый чайлд о родителе (мапа)
    public Map<String, List<UserRole>> getHierarchy(){
        return this.hierarchy;
    }
    


    public Map<String, UserRole> getIdUserRoleMap(){
        return idUserRoleMap;
    }

    
    public List<UserRole> getAllRoles(){
        return [SELECT Id, Name, ParentRoleId FROM UserRole];
    }

    
    public void display(){
        for(String k : hierarchy.keySet()){
            String announce = 'Наследники роли ' +idUserRoleMap.get(k).Name+': (';
            String announceFinal = '';
            Integer counter = 0;
            for(UserRole ur: hierarchy.get(k)){
                announceFinal += ur.Name + ', ';
                counter++;
            }
            System.debug(announce + announceFinal.substring(0, announceFinal.length() -2) +') - всего ' +counter + ' наследников');
        }
    }
//генерит мапу hierarchy, где ключ - Id родителя, а значения - это список всех ролей, у которых ParentId = этот Id
/*    void mapByParents(List<UserRole> l){
        //<parentId, childs>
        while(l.size() > 0){
            String parentName = l[0].ParentRoleId;
            List<UserRole> brothers = new List<UserRole>();
            brothers.add(l[0]);
            l.remove(0);
        	for(Integer i = 0; i < l.size(); i++){
                if(parentName == l[i].ParentRoleId){
                    brothers.add(l[i]);
                    l.remove(i);
                }
        	}
            hierarchy.put(parentName, brothers);
        }
    }*/
    void mapByParents(List<UserRole> l){
        //Map<String, List<UserRole>> hierarchy
        for(Integer i = 0; i < l.size(); i++){
            List<UserRole> brothers = new List<UserRole>();//узлы с одинаковым parentId;
            brothers.add(l[i]);
            for(Integer j = 0; j < l.size(); j++){
                if((l[i].ParentRoleId == l[j].ParentRoleId) && (l[i].Id != l[j].Id)){
                    brothers.add(l[j]);
                }
            }
            hierarchy.put(brothers[0].ParentRoleId, brothers);
        }
    }    
    
    
    void mapper(List<UserRole> urList){
        for(UserRole ur: urList){
            try{
            	idUserRoleMap.put(ur.Id, ur);                
            }catch(NullPointerException npe){
                System.debug(npe + ' '+ npe);
            }


        }
    }

}