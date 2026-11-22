const MagicEngine = (() => {
  const {questions, roles, dimensions} = MagicData;
  const motiveCount = dimensions.length;
  const sum = values => values.reduce((total, value) => total + value, 0);
  const dot = (a, b) => a.reduce((total, value, i) => total + value * b[i], 0);
  const average = values => sum(values) / values.length;

  // Small offsets fitted on uniformly sampled answers, excluding the hidden role.
  // They apply mainly to mixed answers and fade out as a preference becomes clear.
  const calibration = {
    harry: 0.0863, hermione: -0.3749, ron: 0.2889, luna: -0.1647,
    neville: 0.2068, ginny: 0.144, draco: -0.3657, cedric: 0.0635,
    fred: 0.0293, george: -0.0157, snape: -0.2183, dumbledore: -0.2992,
    mcgonagall: -0.1587, hagrid: 0.36, sirius: 0.0999, lupin: 0.0386,
    wood: -0.2898, tonks: 0.2706, dobby: 0.2728, cho: 0.0263,
  };

  function expectedMotiveCounts(preferences) {
    const counts = Array(motiveCount).fill(0);
    for (const {options} of questions) {
      const total = sum(options.map(option => preferences[option.motive]));
      for (const {motive} of options) counts[motive] += preferences[motive] / total;
    }
    return counts;
  }

  const neutralCounts = expectedMotiveCounts(Array(motiveCount).fill(1));
  const neutralProfile = dimensions.map((_, i) =>
    average(questions.map(({options}) => average(options.map(option => option.scores[i])))));

  // Compare the direction of each role's expected choices to the same neutral
  // baseline. Standardization accounts for which motives each question offers.
  const templates = roles.map(role => {
    const total = sum(role.motiveWeights);
    const preferences = role.motiveWeights.map(weight => 0.2 + 0.8 * motiveCount * weight / total);
    const direction = expectedMotiveCounts(preferences).map((value, i) => value - neutralCounts[i]);
    const variance = sum(questions.map(({options}) => {
      const moves = options.map(option => direction[option.motive]);
      return average(moves.map(value => value ** 2)) - average(moves) ** 2;
    }));
    const deviation = Math.sqrt(variance);
    return {role, direction, norm: Math.hypot(...direction), deviation};
  });
  const regular = templates.filter(template => !template.role.hidden);
  const hiddenTemplate = templates.find(template => template.role.hidden);

  function valid(answers, complete = false) {
    return Array.isArray(answers) && answers.length === questions.length
      && Array.from(answers).every((a, i) => a === null
        || Number.isInteger(a) && a >= 0 && a < questions[i].options.length)
      && (!complete || answers.every(a => a !== null));
  }

  function result(answers) {
    if (!valid(answers, true)) throw new Error('请先完成全部题目');
    const selected = answers.map((answer, i) => questions[i].options[answer]);
    const profile = dimensions.map((_, d) => average(selected.map(option => option.scores[d])));
    const signal = neutralCounts.map(value => -value);
    for (const {motive} of selected) signal[motive]++;
    const norm = Math.hypot(...signal);
    const strength = norm / Math.sqrt(questions.length / motiveCount);
    const calibrationShare = Math.max(0, Math.min(1, (4.4 - strength) / 1.8));
    const distance = role => sum(profile.map((value, i) => (value - role.profile[i]) ** 2));
    const ranked = regular.map(template => {
      const {role, direction, deviation} = template;
      const score = strength === 0 ? -Math.sqrt(distance(role) / motiveCount)
        : dot(signal, direction) / deviation + calibrationShare * (calibration[role.id] ?? 0);
      return {template, score};
    }).sort((a, b) => b.score - a.score || distance(a.template.role) - distance(b.template.role));

    const control = selected.filter(option => option.control).length;
    const hidden = control >= 4 && profile[4] >= 65 && profile[1] >= 50 && profile[2] <= 46;
    const {role, direction, norm: roleNorm} = hidden ? hiddenTemplate : ranked[0].template;
    const secondary = (hidden ? ranked[0] : ranked[1]).template.role;
    const closeMatch = !hidden && (strength < 1 || ranked[0].score - ranked[1].score < 0.22);
    const similarity = norm > 0
      ? Math.round(Math.max(0, Math.min(1, dot(signal, direction) / (norm * roleNorm))) * 100)
      : null;
    const strongest = profile.map((v, i) => ({v, i}))
      .sort((a, b) => (b.v - neutralProfile[b.i]) - (a.v - neutralProfile[a.i])).slice(0, 2);

    const evidence = selected.map((option, i) => ({
      text: option.text,
      title: questions[i].title,
      weight: direction[option.motive] - average(questions[i].options.map(choice => direction[choice.motive])),
    })).sort((a, b) => b.weight - a.weight).slice(0, 2);
    return {role, profile, similarity, secondary, strongest, evidence, hidden, control, closeMatch};
  }

  const encode = answers => answers.map(answer => answer === null ? 'x' : String(answer)).join('');
  function decode(value) {
    if (typeof value !== 'string' || value.length !== questions.length || !/^[0-3]+$/.test(value)) return null;
    const answers = [...value].map(Number);
    return valid(answers, true) ? answers : null;
  }
  return {valid, result, encode, decode};
})();
