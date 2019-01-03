import createStore from "unistore";
import _ from "lodash";

const store = createStore({
  zip: false,
  friends: false,
  messages: false
});

const isJSON = (name) => name.substring(name.lastIndexOf('.')+1, name.length) === "json";

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
      if (!file.dir && isJSON(file.name)) {
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
      console.log('f2', file);
      if (!file.dir && isJSON(file.name)) {
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
    state.zip
    .file("likes_and_reactions/posts_and_comments.json")
    .async("text")
    .then(json => {
      store.setState({ reactions: JSON.parse(json).reactions });
    })
  }
});

export { actions, store };
