export const types = {
    NOTIFICATION_SINGLE_SHOW: "NOTIFICATION_SINGLE_SHOW",
    NOTIFICATION_SINGLE_HIDE: "NOTIFICATION_SINGLE_HIDE"
};

export const actions = {
    showSingleNotification: (payload = {}) => ({
        type: types.NOTIFICATION_SINGLE_SHOW,
        payload: payload
    }),
    hideSingleNotification: (payload = {}) => ({
        type: types.NOTIFICATION_SINGLE_HIDE,
        payload
    })
}
