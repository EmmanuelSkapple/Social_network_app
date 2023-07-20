import { getGroups, getGroupWithArrayIds } from "../database/groupFirebase";

export const getGroupsWithActivity = (acivity:Array<any>) => {
    let groupObject = {} as any;
    let groupsArray = [] as any;
    let arrayAux = [...acivity];
    arrayAux.forEach(function (item: any) {
      groupObject[item.group.name] = (groupObject[item.group.name] || 0) + 1;
    });
    var arrayOfKeys = Object.keys(groupObject);
    arrayOfKeys.forEach((item, index) => {
      groupsArray.push({ name: item, numberOfNoty: groupObject[item] });
    });
    return(groupsArray)
  };

export const checkIfExistNewGroups = (userGroups : Array<string>,localGroups : Array<any>) => {
  let groupsMissing = [...userGroups];
  localGroups.forEach((item : any) => {
    groupsMissing.includes(item.id) && groupsMissing.splice(groupsMissing.indexOf(item.id),1)
  });
  return(groupsMissing)
}


export const getDataOfMissingGroups = async (userData:any,Groups : any) => {
  let groupsMissing = checkIfExistNewGroups(userData.groups,Groups);
  if(groupsMissing.length>0 || userData.groups.length < Groups.length){
    let newGroupData :any;
    if(userData.groups.length == groupsMissing.length || userData.groups.length < Groups.length){
      newGroupData = await getGroups(userData.uid)
      return({status:200, groupData:newGroupData.groupData})
    }else{
      newGroupData = await getGroupWithArrayIds(groupsMissing)
      return({status:202, groupData:newGroupData.groupData})
    }
  }else{
    return(false)
  }
}
