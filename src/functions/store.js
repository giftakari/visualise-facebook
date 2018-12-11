import createStore from "unistore";
import _ from "lodash";

const store = createStore({
  zip: false,
  friends: false,
  messages: false
});

const actions = store => ({
  dropData(state, zip) {
    console.log("Dropped data");
    return { zip: zip };
  },
  extractFriends(state) {
    console.log("Processing friends");
    state.zip
      .file("friends/friends.json")
      .async("text")
      .then(json => {
        store.setState({ friends: JSON.parse(json) });
      });
  },
  extractMessages(state) {
    console.log("Processing Messages");
    const messages = [];
    state.zip.folder("messages/inbox").forEach((relativePath, file) => {
      if (!file.dir) {
        messages.push(
          file.async("text").then(result => JSON.parse(result).messages)
        );
      }
    });
    Promise.all(messages).then(results => {
      store.setState({ messages: _.flatten(results) });
    });
  },
  extractWords(state) {
    console.log("Processing Words");
    const messages = [];
    state.zip.folder("messages/inbox").forEach((relativePath, file) => {
      if (!file.dir) {
        messages.push(
          file.async("text").then(result => JSON.parse(result).messages)
        );
      }
    });
    Promise.all(messages).then(results => {
      store.setState({ words: _.flatten(results) });
    });
  },
  extractReactions(state) {
    console.log("Processing Reactions");
    const reactions = [];
    state.zip.folder("likes_and_reactions/").forEach((relativePath, file) => {
      if (!file.dir) {
        reactions.push(
          file.async("text").then(result => JSON.parse(result).reactions)
        );
      }
    });
    Promise.all(reactions).then(results => {
      store.setState({ reactions: _.flatten(results) });
    });
  }
});

export { actions, store };
