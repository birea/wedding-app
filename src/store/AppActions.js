import { db, firebase } from "../firebase";
import i18n from "i18next";

export const AppActionTypes = {
    USER_LOG_IN: "app/login",
    LOG_OUT: "app/logout",
    SET_USER_REVIEWED: "app/setUser",
    LOAD_WALL: "translations/loadWall",
    SET_ACTIVE_NAV: "app/setActiveNav",
    SET_UNREAD_COUNTER: "app/setUnreadCounter",
    SET_ERROR: "app/setError"
};

export const userLogin = (authUser, user) => ({
    type: AppActionTypes.USER_LOG_IN,
    authUser: authUser,
    user: user
});

export const logout = () => ({
    type: AppActionTypes.LOG_OUT
});

export const setUnreadMessagesCount = (unreadMessages) => ({
    type: AppActionTypes.SET_UNREAD_COUNTER,
    unreadMessages: unreadMessages ? unreadMessages : 0
});

export const setActiveNav = (activeNav) => ({
    type: AppActionTypes.SET_ACTIVE_NAV,
    activeNav: activeNav
});


export const setRequestList = requestList => ({
    type: AppActionTypes.LOAD_REQUEST_LIST,
    requestList: requestList
});

export const loadWall = (messages) => ({
    type: AppActionTypes.LOAD_WALL,
    messages: messages
});

export const setUserReviewed = (userReviewed, activeNav) => ({
    type: AppActionTypes.SET_USER_REVIEWED,
    userReviewed: userReviewed,
    activeNav: activeNav
});

export const setError = error => ({
    type: AppActionTypes.SET_ERROR,
    error: error
});

export function login(userAuth) {
    return (dispatch) => {
        db.onceGetUser(userAuth.uid)
            .then(snapshot => {
                const user = snapshot.toJSON();
                user.uid = userAuth.uid;
                loadLiterals();
                i18n.changeLanguage(user.language.toLowerCase());     
                return dispatch(userLogin(userAuth, user));
            })
            .catch(() =>console.log("user not found"));
    };
}

function loadLiterals(){
    db.getLiterals()
        .then(snapshot => {
            const data = snapshot.toJSON();            
            i18n.addResources("en","logistics", data.logistics.en);            
            i18n.addResources("es","logistics", data.logistics.es);            
            i18n.addResources("it","logistics", data.logistics.it);            
            i18n.addResources("en","quiz", data.quiz.en);            
            i18n.addResources("es","quiz", data.quiz.es);            
            i18n.addResources("it","quiz", data.quiz.it);          
            return;
        }).catch(false);
}

export function getUnreadMessagesCount(uid, isReviewer) {
    return (dispatch) => {
        db.getUnreadMessages(uid, isReviewer)
            .then(unreadMessages =>
                dispatch(setUnreadMessagesCount(unreadMessages.val()))
            ).catch(() => { });
    };
}

export function loadMessages(uid, isReviewer) {
    return (dispatch) => {
        db.onceGetWall(uid)
            .then(snapshot => {
                db.markMessagesRead(uid, isReviewer, snapshot.toJSON());
                return dispatch(loadWall(orderMessages(snapshot.toJSON())));
            })
            .catch(() => dispatch(loadWall([])));
    };
}

export function sendMessage(message, uid, isReviewer, notification) {
    return (dispatch) => {        
        db.addMessage(message, uid, isReviewer);
        db.sendNotification(notification, uid)
            .then(() => {
                const sendEmailToCall = firebase.functions.httpsCallable("sendEmailTo");        
                return sendEmailToCall(notification);
            })
            .catch(error => console.log(error));
        db.onceGetWall(uid)
            .then(snapshot => dispatch(loadWall(orderMessages(snapshot.toJSON()))))
            .catch(() => dispatch(loadWall([])));
    };
}

function orderMessages(data) {
    if (!data) { return []; }
    const keys = Object.keys(data);
    const messages = [];
    for (let i = keys.length - 1; i >= 0; i--) {
        if (keys[i] !== "metadata")
            messages.push(data[keys[i]]);
    }
    return messages;
}

/*
function addCommentToWall(requestId, page, request, uid, notification) {
    return () => {
        const message = {
            author: request.userName,
            text: request.comments,
            requestId: requestId,
            requestTitle: request.title,
            creationDate: new Date().toJSON(),
            read: false,
            isReviewer: false
        };
        if (request.comments) {
            db.addMessage(message, page, uid, false);
        }
        db.sendNotification(notification, uid);

    };    
}
*/
