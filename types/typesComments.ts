
export interface NewCommentProps {
    idPost : string;
    comment: string;
    group: {
        id: string;
        name: string;
    };
    poster: {
        id: string;
        name: string;
        photo: string;
    };
    membersData: any;
}

export type CommentsProps = {
   itemComment : {
        idPost : string;
        comment: string;
        created: any;
        group: {
            id: string;
            name: string;
        };
        poster: {
            id: string;
            name: string;
            photo: string;
        };
   }
};