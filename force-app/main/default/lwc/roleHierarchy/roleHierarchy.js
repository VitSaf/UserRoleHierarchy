import { LightningElement, api, track, wire } from 'lwc';
import getHierarchiedRolesWithManulSerialization from '@salesforce/apex/RoleHierarchy.getHierarchiedRolesWithManulSerialization';

export default class RoleDisplay extends LightningElement {
    
    @track hier;
    @track gridData;
    erorr;

    gridColumns = [
            {
                type: 'text',
                fieldName: 'Name',
                label: 'Role Name'
            },
            {
                type: 'text',
                fieldName: 'Id',
                label: 'Role Id'
            }
    ]


    map_children = function(_children, rm){
        console.log(_children.length + _children.length == 0);
        if(_children.length == 0){
            console.log('return');
            return ;
        }else{
            console.log('_children:' + _children.length);
            _children.forEach(c => {
                c._children = rm.get(c.Id)._children;
                console.log('c:');
                console.log(c);
                this.map_children(c._children, rm);
                //result.addAll(map_children(rolesMapper.get(c.pa)));
            });
        }
    }

    connectedCallback(){
        getHierarchiedRolesWithManulSerialization()
            .then(result => {
                var res = [];
                const rolesMapper = new Map();
                

                //var rolesFromServer = JSON.parse(result);
                var rolesFromServer = JSON.parse(result.replaceAll('childs','_children'));

                rolesFromServer.forEach(r => {
                    if(!r._children){
                        r._children = [];
                    }
                    r.Id = r.myRole.Id;
                    r.Name = r.myRole.Name;
                    r.count = r._children.length;
                    console.log(r);
                    rolesMapper.set(r.myRole.Id, r);

                });
                var i = 0;
                rolesFromServer.forEach(r => {
                    console.log('r:' + i);
                    console.log(r);
                    this.map_children(r._children, rolesMapper);
                    i+=1;
                });

                console.log('results:');
                console.log(rolesFromServer);

                rolesFromServer.forEach(r => {
                    console.log([r]);
                    console.log(r.Name === 'CEO');
                    if(r.Name === 'CEO'){
                        this.gridData = [r];
                    }
                });


                this.hier = rolesFromServer;
                //this.gridData = res;
            })
            .catch(error => {
                this.error = error;
            });
        // setTimeout(() => { //Если cacheable=true, то нет нужды в таймауте
        //     var res = [];
        //     console.log(this.hierWithSer.length, this.hierWithSer[0]);
        //     JSON.parse(this.hierWithSer).forEach(h => 
        //         res.push(h)
        //     );
        //     console.log(res);
        //     this.hier = res;
        //     }, 300);
    }


}