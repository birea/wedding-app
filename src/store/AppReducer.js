import { AppActionTypes } from "./AppActions";
import * as routes from "./../constants/routes";
const initialState = {
    authUser: null,
    activeNav: routes.HOME,
    isReviewer: false,
    messages: null,
    userLogged: null,
    userReviewed: null,   
    unreadMessages: 0    
};

const AppReducer = (state = initialState, action) => { //eslint-disable-line complexity
    switch (action.type) {
        case AppActionTypes.USER_LOG_IN:
            return {
                ...state,
                authUser: action.authUser,
                userLogged: action.user,
                isReviewer: action.user.isReviewer === true
            };
        case AppActionTypes.LOG_OUT:
            return {
                ...state,
                authUser: null,
                isReviewer: false
            };
        case AppActionTypes.SET_UNREAD_COUNTER:
            return {
                ...state,
                unreadMessages: action.unreadMessages                
            };    
        case AppActionTypes.LOAD_WALL:
            return {
                ...state,
                messages: action.messages
            };  
      
        case AppActionTypes.SET_USER_REVIEWED:
            return {
                ...state,
                userReviewed: action.userReviewed,
                activeNav: action.activeNav,
                unreadTranslationItems: action.userReviewed.translationsUnread,
                unreadCorrectionItems: action.userReviewed.correctionsUnread
            };
        case AppActionTypes.SET_ACTIVE_NAV:
            return {
                ...state,
                activeNav: action.activeNav
            };
        case AppActionTypes.SET_ERROR:
            return {
                ...state,
                error: state.error
            };
        default:
            return { ...state };
    }
};

export default AppReducer;