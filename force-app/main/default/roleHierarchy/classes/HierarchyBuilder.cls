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
    
    public Map<String, List<UserRole>> getHierarchy(){
        return this.hierarchy;
    }
    
    public Map<String, UserRole> getIdUserRoleMap(){
        return idUserRoleMap;
    }

    public List<UserRole> getAllRoles(){
        return [SELECT Id, Name, ParentRoleId FROM UserRole];
    }


//генерит мапу hierarchy, где ключ - Id родителя, а значения - это список всех ролей, у которых ParentId = этот Id
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
                System.debug(npe + '  ');
            }
        }
    }
}