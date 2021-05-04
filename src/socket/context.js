/**
 * @type {User}
 */
let user

export const setSocketUser = _id => {
  user = new User({ _id })
}

/**
 * @returns {User}
 */
export const getSocketUser = () => user