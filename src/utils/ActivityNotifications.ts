import AsyncStorage from "@react-native-async-storage/async-storage";

export const getRecentActivityFilter = (listActivity:Array<any>,currentFilter:string) => {
    let arrayAux = [...listActivity] as any;
    if (currentFilter == 'All') {
      return(arrayAux);
    } else {
      let activityFilter = arrayAux.filter(
        (item: any) => item.group.name === currentFilter
      );
      return(arrayAux);
    }
  };

  export const deleteActivity = async (idNotificacion: string,idUser:string,recentAcivityList:Array<any>,dispatch:any) => {
    if (idNotificacion) {
      try {
        await deleteNotificationFromAsyncStorage(idNotificacion,idUser);
        await deleteNotificationFromReduce(idNotificacion,recentAcivityList,dispatch);
      } catch (error) {
        console.log('error in deleteNotification', error);
      }
    }
  };

  const deleteNotificationFromAsyncStorage = async (idNotificacion: string,idUser:string) => {
    const localActivity = (await AsyncStorage.getItem(
      `${idUser}-recentActivity`
    )) as any;
    const localActivityUpdated = JSON.parse(localActivity).filter(
      (item: any) => item.id !== idNotificacion
    );
    await AsyncStorage.setItem(
      `${idUser}-recentActivity`,
      JSON.stringify(localActivityUpdated)
    );
  };
  const deleteNotificationFromReduce = async (idNotificacion: string,recentAcivityList:Array<any>,dispatch:any) => {
    const reduceActivityUpdated = recentAcivityList.filter(
      (item: any) => item.id !== idNotificacion
    );
    dispatch({ type: 'setRecentActivity', payload: reduceActivityUpdated });
  };


  export const updateLocalActivity = async (remoteActivity: Array<Object>,idUser:string) => {
    try {
      const localActivity = await AsyncStorage.getItem(
        `${idUser}-recentActivity`
      );
      let allActivity = [] as any;
      if (localActivity != null) {
        allActivity = [...JSON.parse(localActivity), ...remoteActivity];
      } else {
        allActivity = [...remoteActivity];
      }
      await AsyncStorage.setItem(
        `${idUser}-recentActivity`,
        JSON.stringify(allActivity)
      );
      const localActivityUpdated = await AsyncStorage.getItem(
        `${idUser}-recentActivity`
      );
      return {
        status: 200,
        localActivity:
          localActivityUpdated != null ? JSON.parse(localActivityUpdated) : [],
      };
    } catch (error) {
      console.log('error in saveLocalActivity', error);
      return { status: 500 };
    }
  };