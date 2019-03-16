export default (state = null, action) => {
  switch (action.type) {
    case "ADD_ALL_USER_DATA":
      return action.data;
    default:
      return state;
  }
};
