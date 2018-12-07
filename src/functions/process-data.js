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
  const parseTime = t => parse(t, "t", new Date());
  const formatTime = t => format(t, labelFormat);

  const grouped = _.groupBy(data, d => {
    return formatTime(parseTime(d.timestamp));
  });

  const mapped = _.map(grouped, (value, key) => {
    return { label: key, value: value.length };
  });

  const sorted = _.sortBy(mapped, d => parseLabel(d));

  return sorted;
};

export const processReactionData = (data, f) => {
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
