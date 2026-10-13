// Original "Analyze an Issue" prompts in the style of the GRE Analytical Writing task.
(function () {
  var I = {
    agree: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    reasons: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider the most compelling reasons and/or examples that could be used to challenge your position.",
    challenge: "Write a response in which you discuss the extent to which you agree or disagree with the claim. In developing and supporting your position, be sure to address the most compelling reasons and/or examples that could be used to challenge your position.",
    twoViews: "Write a response in which you discuss which view more closely aligns with your own position and explain your reasoning for the position you take. In developing and supporting your position, you should address both of the views presented.",
    claimReason: "Write a response in which you discuss the extent to which you agree or disagree with the claim and the reason on which that claim is based.",
    recommend: "Write a response in which you discuss your views on the policy and explain your reasoning for the position you take. In developing and supporting your position, you should consider the possible consequences of implementing the policy and explain how these consequences shape your position."
  };

  var raw = [
    ["agree", "The most valuable lessons a person learns come from failure rather than from success."],
    ["agree", "A society's greatness is best measured by how it treats its least powerful members."],
    ["agree", "Technological progress tends to make people more isolated rather than more connected."],
    ["agree", "Experts in any field are often the people least likely to produce genuinely new ideas in that field."],
    ["agree", "The primary goal of education should be to teach students how to question, not what to believe."],
    ["agree", "Nations should judge their success by the well-being of their citizens rather than by economic growth."],
    ["agree", "Most important discoveries are the result of persistence rather than brilliance."],
    ["reasons", "Leaders who change their minds in response to new information are more trustworthy than leaders who remain consistent."],
    ["reasons", "People should be wary of any idea that is accepted without controversy."],
    ["reasons", "The study of history is more useful for understanding the present than for predicting the future."],
    ["reasons", "Art that is created primarily to make money cannot be considered serious art."],
    ["reasons", "Competition among students does more to harm learning than to help it."],
    ["reasons", "In most professions, practical experience matters more than formal training."],
    ["reasons", "A person's character is revealed more clearly in small daily choices than in moments of crisis."],
    ["challenge", "Claim: Governments should not fund scientific research that has no obvious practical application."],
    ["challenge", "Claim: Public figures forfeit their right to privacy once they choose to enter public life."],
    ["challenge", "Claim: The widespread availability of information has made people less, not more, knowledgeable."],
    ["challenge", "Claim: A community's traditions should be preserved even when they no longer serve a practical purpose."],
    ["challenge", "Claim: Cities, rather than national governments, are now the most important sources of social change."],
    ["challenge", "Claim: Teachers should be evaluated primarily on the measurable progress of their students."],
    ["challenge", "Claim: Individuals who achieve great success owe more to circumstance than to their own effort."],
    ["twoViews", "Some people believe that young people should be encouraged to choose careers based on their passions. Others believe that young people should be encouraged to choose careers based on financial security and the needs of the job market."],
    ["twoViews", "Some people believe that the best way to solve environmental problems is through individual changes in behavior. Others believe that only large-scale government and industry action can make a meaningful difference."],
    ["twoViews", "Some people believe that universities should require all students to study a broad range of subjects. Others believe that students should be free to concentrate only on the subjects that interest them most."],
    ["twoViews", "Some people believe that a news organization's first duty is to report events as neutrally as possible. Others believe that news organizations have a responsibility to take clear positions on important issues."],
    ["twoViews", "Some people believe that museums should focus on displaying the works of established masters. Others believe that museums should devote most of their resources to new and emerging artists."],
    ["twoViews", "Some people believe that cooperation is the most important skill for success in the modern world. Others believe that independence and self-reliance matter more."],
    ["twoViews", "Some people believe that government officials should rely primarily on expert advice when making decisions. Others believe that officials should give more weight to the opinions of ordinary citizens."],
    ["claimReason", "Claim: Students should be required to spend at least one year working before entering a university.\nReason: Time spent outside of school gives students a clearer sense of what they want to learn and why."],
    ["claimReason", "Claim: Societies should place less emphasis on preserving historic buildings.\nReason: Resources devoted to the past are resources taken away from meeting present needs."],
    ["claimReason", "Claim: Critics of popular culture do more harm than good.\nReason: Criticism discourages people from enjoying works that bring them genuine pleasure."],
    ["claimReason", "Claim: Organizations should hire for attitude and train for skill.\nReason: Skills can be taught relatively quickly, whereas character and motivation are difficult to change."],
    ["claimReason", "Claim: The best way to understand a culture is to study its everyday customs rather than its great works.\nReason: Great works reflect the views of a privileged few, while everyday customs reflect the lives of most people."],
    ["claimReason", "Claim: Scientists should be held responsible for the ways their discoveries are used.\nReason: Scientists are best positioned to foresee the potential consequences of their work."],
    ["recommend", "Governments should offer substantial financial incentives to citizens who choose to live in rural areas rather than in large cities."],
    ["recommend", "Schools should eliminate letter grades and replace them with detailed written evaluations of each student's work."],
    ["recommend", "Every adult citizen should be required to perform one year of national or community service."],
    ["recommend", "Large corporations should be required to publicly disclose the salaries of all of their employees."],
    ["recommend", "Public libraries should shift most of their funding from physical books to digital resources and technology training."],
    ["recommend", "Universities should require all faculty members to devote at least as much time to teaching as to research."]
  ];

  window.ISSUE_PROMPTS = raw.map(function (r, i) {
    return { id: "i" + String(i + 1).padStart(2, "0"), type: r[0], prompt: r[1], instructions: I[r[0]] };
  });

  window.ISSUE_RUBRIC = [
    { score: 6, label: "Outstanding", points: [
      "Articulates a clear and insightful position on the issue in accordance with the task",
      "Develops the position fully with compelling reasons and/or persuasive examples",
      "Sustains a well-focused, well-organized analysis, connecting ideas logically",
      "Conveys ideas fluently and precisely, using effective vocabulary and sentence variety",
      "Demonstrates superior facility with the conventions of standard written English, with only minor errors"
    ]},
    { score: 5, label: "Strong", points: [
      "Presents a clear and well-considered position on the issue in accordance with the task",
      "Develops the position with logically sound reasons and/or well-chosen examples",
      "Is focused and generally well organized, connecting ideas appropriately",
      "Conveys ideas clearly and well, using appropriate vocabulary and sentence variety",
      "Demonstrates facility with the conventions of standard written English, with only minor errors"
    ]},
    { score: 4, label: "Adequate", points: [
      "Presents a clear position on the issue in accordance with the task",
      "Develops the position with relevant reasons and/or examples",
      "Is adequately focused and organized",
      "Demonstrates sufficient control of language to express ideas with reasonable clarity",
      "Generally demonstrates control of standard written English, though it may have some errors"
    ]},
    { score: 3, label: "Limited", points: [
      "Is vague or limited in addressing the specific task directions and/or in presenting a position",
      "Is weak in the use of relevant reasons or examples, or relies largely on unsupported claims",
      "Is poorly focused and/or poorly organized",
      "Has problems in language and sentence structure that result in a lack of clarity",
      "Contains occasional major errors or frequent minor errors that can interfere with meaning"
    ]},
    { score: 2, label: "Seriously Flawed", points: [
      "Is unclear or seriously limited in addressing the task and in presenting or developing a position",
      "Provides few, if any, relevant reasons or examples in support of its claims",
      "Is poorly focused and/or poorly organized",
      "Has serious problems in language and sentence structure that frequently interfere with meaning",
      "Contains serious errors in grammar, usage, or mechanics that frequently obscure meaning"
    ]},
    { score: 1, label: "Fundamentally Deficient", points: [
      "Provides little or no evidence of understanding the issue",
      "Provides little evidence of the ability to develop an organized response",
      "Has severe problems in language and sentence structure that persistently interfere with meaning",
      "Contains pervasive errors in grammar, usage, or mechanics that result in incoherence"
    ]},
    { score: 0, label: "Off-topic / Blank", points: [
      "Is off topic, merely copies the prompt, is in a foreign language, consists only of keystroke characters, is illegible, or is blank"
    ]}
  ];
})();
