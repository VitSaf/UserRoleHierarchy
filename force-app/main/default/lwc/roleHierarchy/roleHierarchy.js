import { LightningElement, api, track, wire } from 'lwc';
import getHierarchiedRolesWithManulSerialization from '@salesforce/apex/RoleHierarchy.getHierarchiedRolesWithManulSerialization';
import MOMENT_JS from '@salesforce/resourceUrl/momentJS';
import { loadScript } from 'lightning/platformResourceLoader';

//https://github.com/trailheadapps/lwc-recipes/blob/main/force-app/main/default/lwc/libsMomentjs/libsMomentjs.js

export default class RoleDisplay extends LightningElement {
    @track hier;
    @track gridData;
    erorr;

    @track selectedDateTime = new Date().toISOString();
    weekOfYear;
    @track dayOfYear;
    calculatedDateTime;

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
        if(_children.length == 0){
            return ;
        }else{
            _children.forEach(c => {
                c._children = rm.get(c.Id)._children;
                this.map_children(c._children, rm);
            });
        }
    }

    connectedCallback(){
        loadScript(this, MOMENT_JS)
        .then(() => {
            this.setMomentValues(this.selectedDateTime);
        })
        .catch((error) => {
            this.error = error;
        });


        getHierarchiedRolesWithManulSerialization()
            .then(result => {
                var res = [];
                const rolesMapper = new Map();
                //компонент строит иерархию по _children
                var rolesFromServer = JSON.parse(result.replaceAll('childs','_children'));

                rolesFromServer.forEach(r => {
                    if(!r._children){
                        r._children = [];
                    }
                    r.Id = r.myRole.Id;
                    r.Name = r.myRole.Name;
                    r.count = r._children.length;
                    rolesMapper.set(r.myRole.Id, r);
                });
                var i = 0;
                rolesFromServer.forEach(r => {
                    this.map_children(r._children, rolesMapper);
                    i+=1;
                });

                rolesFromServer.forEach(r => {
                    if(r.Name === 'CEO'){
                        this.gridData = [r];
                    }
                });
                this.hier = rolesFromServer;
            })
            .catch(error => {
                this.error = error;
            });
    }


    setMomentValues(dateTime) {
        const mom = moment.utc(dateTime);
        this.selectedDateTime = dateTime;
        this.weekOfYear = mom.week();
        this.dayOfYear = mom.dayOfYear();
        this.calculatedDateTime = mom.add(3, 'hours').calendar();
        // this.calculatedDateTime = mom
        //     .subtract(3, 'day')
        //     .add(10, 'hour')
        //     .subtract(33, 'minute')
        //     .calendar();
    }

    handleDateTimeChange(event) {
        this.setMomentValues(event.target.value);
    }
}