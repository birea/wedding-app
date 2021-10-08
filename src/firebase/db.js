import { db } from "./firebase";
// User API

export const doCreateUser = (uid, username, googleDisplayName, email, language) =>
    db.ref(`users/${uid}`).set({
        uid: uid,
        username: username,
        googleDisplayName: googleDisplayName,
        email: email,
        language:language.substring(0,2).toUpperCase()
    });
export const updateUserLanguage = (uid, language) =>
    db.ref(`users/${uid}`).update({      
        language:language.substring(0,2).toUpperCase()

    });

export const getAccount = () => db.ref("staticData/account").once("value");

export const getLiterals = () => db.ref("staticData/literals").once("value");

export const onceGetUsers = () =>
    db.ref("users").once("value");

export const onceGetQuiz = () =>
    db.ref("quiz").once("value");

export const onceGetRSVP = () =>
    db.ref("rsvp").once("value");


export const onceGetUser = (uid) =>
    db.ref(`users/${uid}`).once("value");

export const saveQuizResult = (uid, mark, answers) =>
    db.ref(`quiz/${uid}`).update(//eslint-disable-line fp/no-mutating-methods
        {mark: mark, answers: answers});

export const getQuizResult = (uid) =>
    db.ref(`quiz/${uid}`).once("value");

export const updateRsvp = (uid, rsvp) => db.ref(`rsvp/${uid}`).update(rsvp);

export const getRsvp = (uid) => db.ref(`rsvp/${uid}`).once("value");

export const addMessage = (message, uid, isReviewer) => {
    db.ref(`Wall/${uid}`).push({//eslint-disable-line fp/no-mutating-methods
        ...message
    }, () => incrementUnreadMessages(uid, isReviewer));
};


export const sendNotification = (notification, uid) => 
    db.ref(`notifications/${uid}`)//eslint-disable-line fp/no-mutating-methods
        .push({ ...notification });


export const incrementUnreadMessages = (uid, isReviewer) => {
    if (!isReviewer) {
        db.ref(`users/${uid}/unreadMessages`)
            .transaction(currentUnread => (currentUnread || 0) + 1);
    } else {
        db.ref(`Wall/${uid}/metadata/unreadMessages`)
            .transaction(currentUnread => (currentUnread || 0) + 1);
    }
};

export const markMessagesRead = (uid, isReviewer, messages) => {
    if (isReviewer) {
        db.ref(`users/${uid}/unreadMessages`)
            .transaction(() => 0);

    } else {
        db.ref(`Wall/${uid}/metadata/unreadMessages`)
            .transaction(() => 0);
    }

    const keys = Object.keys(messages);
    keys.forEach(key => markMessageRead(key, messages[key], uid, isReviewer));
};

export const markMessageRead = (key, message, uid, isReviewer) => {
    if (!message.isReviewer === isReviewer && !message.read) {
        db.ref(`Wall/${uid}/${key}/read`)
            .transaction(() => true);
    }
};

export const getUnreadMessages = (uid, isReviewer) => {
    if (!isReviewer) {
        return db.ref(`Wall/${uid}/metadata/unreadMessages`).once("value");
    } else {
        return db.ref(`users/${uid}/Unread`).once("value");
    }

};

export const onceGetWall = (uid) => {
    const ref = db.ref(`Wall/${uid}`);
    return ref.once("value");

};