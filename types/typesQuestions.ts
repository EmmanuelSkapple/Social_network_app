
export interface QuestionOfTheDayProps {
    navigation : any;
    variant: string;
}
export interface QuestionByGroup {
    membersSelected: string[];
    group: {
        id: string;
        name: string;
    };
    question: string;
    poster: {
        id: string;
        name: string;
        photo: string;
    };
    dateUpdate: {
        seconds: number;
        nanoseconds: number;
    };
    id: string;
}

export interface QuestionByMatter {
    hashtag: string;
    created: any;
    dateToShow: any;
    id: string;
    creatorID: string;
    questionTitle: {
        es: string;
        en: string;
    },
}


export interface UpdateQuestionProps {
    membersSelected: string[];
    group: {
        id: string;
        name: string;
    };
    question: string;
    poster: {
        id: string;
        name: string;
        photo: string;
    };
}

export interface GetQuestionProps {
    groupID: string;
    userID: string;
}