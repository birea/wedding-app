import { storage } from "./../firebase";
import { TEXT_FILE_PATH, TRANSLATED_PATH, REVIEWER_MAIL } from "./../constants/appConstant";

const getFileURL = (key, uid, idReq, fileName, isTranslatedFile) => {
    if (fileName) {
        const name = isTranslatedFile ? `${TRANSLATED_PATH}${fileName}` : fileName;
        storage.downloadFileURL(TEXT_FILE_PATH, uid, idReq, name).then(url => {
            const a = document.getElementById(key);
            a.href = url;
            return;
        }).catch(() => { });
    }
};

const getUid = (userLogged, userReviewed) => userReviewed ? userReviewed.uid : userLogged.uid;

const getUsername = (userLogged, userReviewed) => userReviewed ? userReviewed.username : userLogged.username;

const getPartialState = event => {
    const { target } = event;
    const { name, type } = target;
    const value = type === "checkbox" ? target.checked : target.value;
    const partialState = {};
    partialState[name] = value;
    return partialState;
};

const handleBackButton = (event, props) => {
    const { history, location: { state: { originPage, originTab, showCancelled } } } = props;
    history.push({//eslint-disable-line fp/no-mutating-methods
        pathname: originPage,
        search: null,
        state: { activeTab: originTab, showCancelled: showCancelled }
    });
    event.preventDefault();
};

const createNotification = (from, to, mailCode, text) => (
    {
        from: `${from.email} ${from.username}`,
        emailTo: to? to.email: REVIEWER_MAIL,
        mailCode: mailCode,        
        text: text,
        language: to? to.language: "it"
    });


export {
    getFileURL,
    getPartialState,
    getUid,
    getUsername,
    handleBackButton,
    createNotification
};
