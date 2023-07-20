export interface AddNotiifacionProps {
    group: {
      id: string;
      name: string;
    };
    poster: {
      id: string;
      name: string;
      photo: string;
    };
    typeNotification: string;
    membersToNotify: string[];
    iconType: string;
    trackingId?: string;
    
  }
  