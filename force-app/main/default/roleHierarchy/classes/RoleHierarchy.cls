public with sharing class RoleHierarchy {
    public UserRole myRole;
    private List<UserRole> childs;
    public UserRole parent;

    public static Map<String, RoleHierarchy> RHMap = new Map<String, RoleHierarchy>();

    public RoleHierarchy(UserRole myRole1, List<UserRole> childs1, UserRole parent1) {
        this.myRole = myRole1;
        this.childs = childs1;
        this.parent = parent1;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<RoleHierarchy> getUserRolesWithHierarchy(Map<String, List<UserRole>> mappedRoles, Map<String, UserRole> urMap){

        List<RoleHierarchy> roleList = new List<RoleHierarchy>();
        for(List<UserRole> urList: mappedRoles.values()){
            for(UserRole ur: urList){
                RoleHierarchy rh = new RoleHierarchy(ur, mappedRoles.get(ur.Id), urMap.get(ur.ParentRoleId));
                roleList.add(rh);
                RHMap.put(ur.Id, rh);
            }
        }
        return roleList;
    }

    @AuraEnabled(cacheable=true)
    public static String getHierarchiedRolesWithManulSerialization(){
        HierarchyBuilder builder = new HierarchyBuilder();
        return JSON.serialize(RoleHierarchy.getUserRolesWithHierarchy(builder.getHierarchy(), builder.getIdUserRoleMap()));     
    }
}