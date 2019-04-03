import parse from "date-fns/parse";
import format from "date-fns/format";
import _ from "lodash";

export const processFriendsData = (data, f) => {
  const formatOptions = {
    day: "dd/MM/yyyy",
    month: "MM/yyyy",
    hour: "h aaaa"
  };

  const labelFormat = formatOptions[f];

  const parseLabel = t => parse(t, labelFormat, new Date());
  const parseTime = t => parse(t, "t", new Date());
  const formatTime = t => format(t, labelFormat);

  const grouped = _.groupBy(data.friends, d => {
    return formatTime(parseTime(d.timestamp));
  });

  const mapped = _.map(grouped, (value, key) => {
    return { label: key, value: value.length };
  });

  const sorted = _.reverse(_.sortBy(mapped, d => parseLabel(d)));

  return sorted;
};

export const processMessagesData = (data, f) => {
  const formatOptions = {
    day: "dd/MM/yyyy",
    month: "MM/yyyy",
    hour: "h aaaa"
  };

  const labelFormat = formatOptions[f];

  const parseLabel = t => parse(t, labelFormat, new Date());
  const parseTime = t => parse(t, "T", new Date());
  const formatTime = t => format(t, labelFormat);

  const grouped = _.groupBy(data, d => {
    return formatTime(parseTime(d.timestamp_ms));
  });

  const mapped = _.map(grouped, (value, key) => {
    return { label: key, value: value.length };
  });

  const sorted = _.sortBy(mapped, d => parseLabel(d.label));
  return sorted;
};

export const processWordData = (data, f) => {
  const words = _.map(data, (value, key) => {
    return data[0].content.split(" ");
  });

  const flatted = _.flatten(words);

  const grouped = _.groupBy(flatted, d => {
    return d;
  });

  const mapped = _.map(grouped, (value, key) => {
    return { label: key, value: value.length };
  });

  return mapped;
};

export const processReactionData = (data, f) => {
  console.log(data);
  const formatOptions = {
    day: "dd/MM/yyyy",
    month: "MM/yyyy",
    hour: "h aaaa"
  };

  const labelFormat = formatOptions[f];

  const parseLabel = t => parse(t, labelFormat, new Date());
  const parseTime = t => parse(t, "t", new Date());
  const formatTime = t => format(t, labelFormat);

  const reactions = _.groupBy(data, d => {
    return d.data[0].reaction.reaction;
  });

  const datasets = _.map(reactions, (reaction, label) => {
    const grouped = _.groupBy(reaction, d => {
      return formatTime(parseTime(d.timestamp));
    });
    const mapped = _.map(grouped, (value, key) => {
      return { y: value.length, x: parseLabel(key) };
    });

    const sorted = _.sortBy(mapped, d => d.x);

    return { label, data: sorted };
  });

  return datasets;
};
