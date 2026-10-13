// Original GRE Verbal Reading Comprehension bank.
// Plain browser script (no modules). Loaded via <script src="data/verbal_rc.js">.
// rc-select answers are 0-based indices into the flattened list of all sentences in the passage.
window.VERBAL_PASSAGES = [

  // ===================== SHORT PASSAGES =====================

  {
    id: "p01", difficulty: 2, kind: "short",
    paragraphs: [
      [
        "For much of the twentieth century, botanists treated the fungi that colonize plant roots as little more than opportunistic tenants, organisms that drew sugars from their hosts while contributing nothing of consequence.",
        "That view has been substantially revised.",
        "Mycorrhizal fungi are now known to extend the effective reach of a root system many times over, scavenging phosphorus and nitrogen from soil pores too narrow for root hairs to penetrate.",
        "Some researchers have gone further, proposing that the fungal threads linking neighboring trees function as conduits through which mature trees deliberately channel carbon to shaded seedlings.",
        "This more ambitious claim, however, rests on a slender evidentiary base: the transfers measured in field studies are typically small, and it remains unclear whether they reflect any benefit to the seedlings rather than simple diffusion along a concentration gradient.",
        "The revised picture of the fungi as partners is secure; the picture of the forest as a cooperative community is not."
      ]
    ],
    questions: [
      {
        id: "p01q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "The primary purpose of the passage is to",
        options: [
          "argue that mycorrhizal fungi are better understood as parasites than as partners of the plants they colonize",
          "explain the mechanism by which mature trees transfer carbon to shaded seedlings",
          "trace the history of botanical research on root systems over the course of the twentieth century",
          "distinguish a well-supported revision of an earlier view from a more speculative extension of that revision",
          "criticize field researchers for relying on flawed techniques to measure carbon transfer"
        ],
        answer: [3],
        explanation: "The author endorses the revised view of the fungi as nutrient-gathering partners (“The revised picture of the fungi as partners is secure”) but treats the claim that trees deliberately share carbon as poorly supported (“the picture of the forest as a cooperative community is not”). That contrast between a secure revision and a speculative extension is the point of the passage. The parasite view is the one the passage says has been revised. The passage doubts the carbon-transfer mechanism rather than explaining it. History is only background, and the author questions what the measurements show, not the techniques used to take them."
      },
      {
        id: "p01q2", type: "rc-select", topic: "rc", difficulty: 2,
        prompt: "Select the sentence in the passage in which the author offers an alternative explanation for an observed phenomenon.",
        answer: [4],
        explanation: "“This more ambitious claim, however, rests on a slender evidentiary base: the transfers measured in field studies are typically small, and it remains unclear whether they reflect any benefit to the seedlings rather than simple diffusion along a concentration gradient.” The observed phenomenon is the measured carbon transfer, and passive diffusion is offered as an alternative to deliberate channeling."
      },
      {
        id: "p01q3", type: "rc-multi", topic: "rc", difficulty: 3,
        prompt: "It can be inferred from the passage that the author would agree with which of the following statements? Consider each of the choices separately and select all that apply.",
        options: [
          "Mycorrhizal fungi supply their host plants with nutrients that the roots alone could not readily obtain.",
          "Carbon never passes from mature trees to seedlings through fungal networks.",
          "Evidence that transferred carbon benefits seedlings would be needed before the claim of deliberate channeling could be accepted."
        ],
        answer: [0, 2],
        explanation: "The first choice is supported because the fungi scavenge nutrients “from soil pores too narrow for root hairs to penetrate,” and the author calls this revised view “secure.” The third is supported because the author faults the channeling claim on the grounds that “it remains unclear whether [the transfers] reflect any benefit to the seedlings.” The second goes too far: the author grants that transfers are measured and only says they are “typically small.”"
      }
    ]
  },

  {
    id: "p02", difficulty: 1, kind: "short",
    paragraphs: [
      [
        "Seventeenth-century Dutch still-life paintings are often read as moral allegories.",
        "A peeled lemon, a guttering candle, or an overturned glass is said to remind viewers that worldly pleasures are fleeting, and the genre’s popularity is taken as evidence of a pervasive Calvinist anxiety about wealth.",
        "Yet this reading sits uneasily with what is known about the paintings’ market.",
        "Inventories show that still lifes hung in the same rooms as maps and tavern scenes, and that buyers frequently paid a premium for a painter’s skill at rendering costly materials such as silver, porcelain, and imported fruit.",
        "Such evidence suggests that many owners prized these works less as sermons than as displays of virtuosity and, not incidentally, of the very luxury the allegorical reading assumes they condemned."
      ]
    ],
    questions: [
      {
        id: "p02q1", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "Which of the following best expresses the main idea of the passage?",
        options: [
          "Dutch still lifes were intended primarily as warnings against the austerity of Calvinist doctrine.",
          "Seventeenth-century Dutch buyers generally preferred maps and tavern scenes to still lifes.",
          "Art historians have consistently misidentified the symbols that appear in Dutch still lifes.",
          "The popularity of Dutch still lifes declined once buyers recognized their moral content.",
          "Evidence about how still lifes were bought and displayed complicates the view that they functioned chiefly as moral allegories."
        ],
        answer: [4],
        explanation: "The passage sets out the allegorical reading and then argues that market evidence “sits uneasily” with it, suggesting owners valued the works for virtuosity and luxury. The first choice gets the allegorical reading wrong. The passage does not say that buyers preferred maps, that historians misidentified symbols, or that the genre lost popularity."
      },
      {
        id: "p02q2", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "In the context of the passage, the phrase “not incidentally” serves primarily to",
        options: [
          "signal that the author regards the point that follows as significant and somewhat ironic",
          "concede a weakness in the author’s own argument",
          "indicate that the point that follows is a minor digression from the argument",
          "introduce evidence drawn from a later historical period",
          "suggest that owners were unaware of the paintings’ moral meaning"
        ],
        answer: [0],
        explanation: "“Not incidentally” stresses a point that matters: the paintings showed off “the very luxury the allegorical reading assumes they condemned.” The irony is that works read as warnings against wealth worked as displays of it. The phrase draws attention to the point instead of downplaying it, and it brings in no concession and no new period."
      },
      {
        id: "p02q3", type: "rc-select", topic: "rc", difficulty: 1,
        prompt: "Select the sentence in the passage that presents the evidence on which the author’s challenge to the allegorical reading is based.",
        answer: [3],
        explanation: "“Inventories show that still lifes hung in the same rooms as maps and tavern scenes, and that buyers frequently paid a premium for a painter’s skill at rendering costly materials such as silver, porcelain, and imported fruit.” This is the market evidence. The sentence after it draws the conclusion from that evidence."
      }
    ]
  },

  {
    id: "p03", difficulty: 3, kind: "short",
    paragraphs: [
      [
        "Economists have long puzzled over why many firms adjust their prices so infrequently, even when costs and demand shift substantially.",
        "The traditional explanation invokes “menu costs,” the literal expenses of reprinting catalogs and relabeling shelves.",
        "But such costs have fallen nearly to zero for online retailers, whose prices nonetheless remain surprisingly rigid.",
        "An alternative account locates the rigidity not in the firm but in the customer: buyers who notice frequent price changes may infer that a seller is opportunistic, and the resulting loss of goodwill can outweigh any gain from fine-tuning prices.",
        "If this account is correct, price stickiness is less a friction to be engineered away than a rational investment in reputation, and policies premised on the assumption that firms would reprice continuously if only they could do so cheaply are likely to misfire."
      ]
    ],
    questions: [
      {
        id: "p03q1", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "The author mentions online retailers primarily in order to",
        options: [
          "present a case that the traditional explanation of price rigidity seems unable to account for",
          "illustrate how customers come to infer that a seller is opportunistic",
          "suggest that online retailers care more about customer goodwill than traditional retailers do",
          "show that menu costs are higher than economists had assumed",
          "provide evidence that price rigidity has declined in recent decades"
        ],
        answer: [0],
        explanation: "Online retailers have almost no menu costs, yet their prices “nonetheless remain surprisingly rigid.” If menu costs explained rigidity, those prices should move freely, so the case undercuts the traditional explanation and sets up the alternative account. The passage does not compare online and traditional retailers’ concern for goodwill, and it says rigidity persists rather than declines."
      },
      {
        id: "p03q2", type: "rc-multi", topic: "rc", difficulty: 3,
        prompt: "Which of the following can be inferred about the “alternative account” described in the passage? Consider each of the choices separately and select all that apply.",
        options: [
          "It implies that a firm might rationally decline to change its prices even if doing so were costless.",
          "It holds that menu costs play no role whatsoever in any firm’s pricing decisions.",
          "It treats customers’ perceptions as relevant to explaining why prices are rigid."
        ],
        answer: [0, 2],
        explanation: "The account calls stickiness “a rational investment in reputation” that holds even when repricing is cheap, so the first choice follows. It explicitly “locates the rigidity … in the customer,” who infers opportunism, so the third choice follows. The second choice is too extreme: the account offers another explanation but never says menu costs have no influence at all."
      },
      {
        id: "p03q3", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "Which of the following, if true, would most seriously undermine the alternative account described in the passage?",
        options: [
          "Some online retailers change their prices more often than physical stores do.",
          "Surveys show that customers do not think less of sellers whose prices change frequently, and such sellers retain customers as well as sellers whose prices are stable.",
          "Menu costs for physical retailers have also declined in recent years.",
          "Customers who come to believe that a seller is opportunistic often take their business elsewhere.",
          "Firms that keep their prices stable report higher levels of customer satisfaction than firms that do not."
        ],
        answer: [1],
        explanation: "The account depends on customers losing goodwill toward sellers whose prices change often. If customers do not think less of such sellers and do not leave them, that mechanism disappears. The fourth and fifth choices support the account. The first and third do not bear on why customers would react to price changes."
      }
    ]
  },

  {
    id: "p04", difficulty: 2, kind: "short",
    paragraphs: [
      [
        "Free indirect discourse, the technique by which a narrator’s voice takes on the idiom and perspective of a character without the signal of quotation marks, is often celebrated as a vehicle of intimacy.",
        "By blurring the boundary between narrator and character, it seems to grant readers unmediated access to a mind.",
        "Yet the same blurring can produce the opposite effect.",
        "Because the reader cannot always tell whose judgment a given sentence expresses, the technique can hold a character at an ironic distance even while appearing to inhabit her thoughts, inviting the reader to notice self-deceptions the character herself does not.",
        "Intimacy and detachment, in other words, are not alternative uses of the technique but simultaneous effects of a single ambiguity."
      ]
    ],
    questions: [
      {
        id: "p04q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "Which of the following best states the main point of the passage?",
        options: [
          "Free indirect discourse is better suited to producing irony than to producing intimacy.",
          "Critics have misunderstood free indirect discourse because they have neglected the role of quotation marks.",
          "The ambiguity at the heart of free indirect discourse allows it to create closeness to and distance from a character at the same time.",
          "Readers of free indirect discourse are usually unable to detect a character’s self-deceptions.",
          "Free indirect discourse was developed chiefly as a means of conveying irony."
        ],
        answer: [2],
        explanation: "The last sentence states the thesis: “Intimacy and detachment … are not alternative uses of the technique but simultaneous effects of a single ambiguity.” The first choice ranks one effect above the other, which the author does not do. The fourth reverses the passage, which says the technique invites readers to notice self-deceptions. The passage says nothing about how the technique was developed."
      },
      {
        id: "p04q2", type: "rc-select", topic: "rc", difficulty: 2,
        prompt: "Select the sentence in the passage that explains how free indirect discourse can distance the reader from a character.",
        answer: [3],
        explanation: "“Because the reader cannot always tell whose judgment a given sentence expresses, the technique can hold a character at an ironic distance even while appearing to inhabit her thoughts, inviting the reader to notice self-deceptions the character herself does not.” The sentence before it only claims that the opposite effect is possible. This sentence explains how it comes about."
      },
      {
        id: "p04q3", type: "rc-multi", topic: "rc", difficulty: 1,
        prompt: "The passage suggests which of the following about free indirect discourse? Consider each of the choices separately and select all that apply.",
        options: [
          "It does not depend on quotation marks to convey a character’s perspective.",
          "It can make it difficult to attribute a given judgment to either the narrator or the character.",
          "Critics have generally regarded it as a technique that distances readers from characters."
        ],
        answer: [0, 1],
        explanation: "The definition says the technique works “without the signal of quotation marks,” which supports the first choice. The reader “cannot always tell whose judgment a given sentence expresses,” which supports the second. The third reverses the passage, which says the technique “is often celebrated as a vehicle of intimacy.”"
      }
    ]
  },

  {
    id: "p05", difficulty: 1, kind: "short",
    paragraphs: [
      [
        "Accounts of early modern European economic growth have traditionally emphasized changes in production: new machines, new sources of power, and new forms of factory organization.",
        "Some historians, however, contend that an earlier transformation took place within households.",
        "Beginning well before mechanization, they argue, families in parts of northwestern Europe reallocated their time away from leisure and household self-provisioning and toward market work, in order to purchase goods such as sugar, cloth, and tableware that they could not easily make themselves.",
        "On this view, rising demand for consumer goods was not merely a consequence of industrial growth but one of its preconditions."
      ]
    ],
    questions: [
      {
        id: "p05q1", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "The primary purpose of the passage is to",
        options: [
          "describe a view that revises the traditional account of the sources of early modern economic growth",
          "argue that new machines played no role in early modern economic growth",
          "compare the economies of northwestern Europe with those of other regions",
          "explain why early modern families preferred purchased goods to homemade ones",
          "criticize historians who emphasize the behavior of households"
        ],
        answer: [0],
        explanation: "The passage summarizes the traditional, production-centered account and then presents a view that puts an earlier change in household behavior ahead of it. The second choice is too extreme, since the revision adds a precondition and does not deny that machines mattered. The passage makes no comparison between regions, and it reports the household-centered view without criticizing it."
      },
      {
        id: "p05q2", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "According to the view described in the passage, the household transformation involved",
        options: [
          "families abandoning market work in favor of producing their own goods",
          "the introduction of new machines into domestic production",
          "a decline in demand for imported goods such as sugar",
          "a shift in how family members allocated their time",
          "the replacement of household labor by factory labor"
        ],
        answer: [3],
        explanation: "Families “reallocated their time away from leisure and household self-provisioning and toward market work.” The first choice reverses that direction. Machines and factories belong to the traditional account, and demand for goods such as sugar rose."
      },
      {
        id: "p05q3", type: "rc-select", topic: "rc", difficulty: 1,
        prompt: "Select the sentence in the passage that states the causal conclusion the historians draw about consumer demand.",
        answer: [3],
        explanation: "“On this view, rising demand for consumer goods was not merely a consequence of industrial growth but one of its preconditions.” This sentence states the causal reversal at the center of the historians’ argument."
      }
    ]
  },

  {
    id: "p06", difficulty: 3, kind: "short",
    paragraphs: [
      [
        "The discovery in the 1990s of “hot Jupiters,” gas giants orbiting their stars more closely than Mercury orbits the Sun, posed a problem for theories of planet formation.",
        "Such planets almost certainly could not have formed where they are now found, because so near a star there would have been too little solid material and too much heat for a massive core to accumulate gas.",
        "Astronomers therefore concluded that the planets must have formed farther out and migrated inward.",
        "The inference is sound as far as it goes, but it is sometimes taken to show more than it does: that hot Jupiters are common among known planets is now well established, yet this tells us little about how often migration occurs in planetary systems generally, since such planets are disproportionately easy to detect and were thus overrepresented in early surveys."
      ]
    ],
    questions: [
      {
        id: "p06q1", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "The author’s attitude toward the astronomers’ conclusion that hot Jupiters migrated inward is best described as",
        options: [
          "skepticism about whether such migration occurs at all",
          "enthusiasm, since the conclusion resolves the central problems of planet formation",
          "rejection, on the grounds that hot Jupiters are rare",
          "neutrality, since the author regards the question as unresolvable",
          "acceptance of the conclusion combined with caution against overextending it"
        ],
        answer: [4],
        explanation: "The author calls the inference “sound as far as it goes” and then warns that “it is sometimes taken to show more than it does.” The author accepts the conclusion but limits what can be drawn from it. The first and third choices contradict that acceptance, and the second overstates it. The author takes a definite position, so the attitude is not neutral."
      },
      {
        id: "p06q2", type: "rc-multi", topic: "rc", difficulty: 3,
        prompt: "The passage implies which of the following? Consider each of the choices separately and select all that apply.",
        options: [
          "Inward migration of gas giants has occurred in most planetary systems.",
          "The methods used in early planet surveys made planets orbiting close to their stars easier to find.",
          "The proportion of hot Jupiters among detected planets may overstate their prevalence among planets in general."
        ],
        answer: [1, 2],
        explanation: "Hot Jupiters are “disproportionately easy to detect and were thus overrepresented in early surveys.” That implies the survey methods favored them and that their share of detected planets overstates their real frequency. The first choice is exactly the kind of overextension the author warns against: their commonness “tells us little about how often migration occurs in planetary systems generally.”"
      },
      {
        id: "p06q3", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "According to the passage, hot Jupiters could not have formed in their current locations because",
        options: [
          "they orbit their stars more closely than Mercury orbits the Sun",
          "they migrated inward from farther out in their planetary systems",
          "the region close to a star would have been too hot and too poor in solid material for a massive core to gather gas",
          "the gravity of their stars prevents any planet from forming nearby",
          "early surveys detected them disproportionately often"
        ],
        answer: [2],
        explanation: "The passage says that “so near a star there would have been too little solid material and too much heat for a massive core to accumulate gas.” The first choice describes the planets’ position, not the reason. The second is the conclusion drawn from the problem. Gravity is never mentioned, and detection bias concerns a different issue."
      }
    ]
  },

  {
    id: "p07", difficulty: 2, kind: "short",
    paragraphs: [
      [
        "Sociologists studying how people find jobs have repeatedly found that useful leads come more often from acquaintances than from close friends.",
        "The finding seems paradoxical, since close friends are presumably more motivated to help.",
        "The paradox dissolves once one considers what each kind of tie can offer.",
        "Close friends tend to move in the same circles and therefore to know much of what one already knows; acquaintances, precisely because they are embedded in different networks, are more likely to carry novel information.",
        "The strength of a relationship and its informational value, then, may vary inversely.",
        "Job seekers who rely only on their closest companions may therefore be drawing again and again from the same small pool of information."
      ]
    ],
    questions: [
      {
        id: "p07q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "The second sentence of the passage (“The finding seems paradoxical …”) primarily serves to",
        options: [
          "cast doubt on the reliability of the sociologists’ finding",
          "explain why the finding might at first appear counterintuitive",
          "present the author’s resolution of an apparent paradox",
          "provide evidence that close friends are more motivated to help than acquaintances are",
          "introduce a finding that contradicts the one reported in the first sentence"
        ],
        answer: [1],
        explanation: "The sentence explains why the finding looks puzzling: friends are “presumably more motivated to help.” The author never doubts the finding, and the resolution comes in later sentences. “Presumably” marks an assumption, not evidence, and no contradicting finding is introduced."
      },
      {
        id: "p07q2", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "Which of the following situations is most analogous to the relationship described in the passage?",
        options: [
          "A student works harder for a teacher she likes than for one she dislikes.",
          "A company finds that its longest-serving employees are its most loyal ones.",
          "A traveler relies on a close friend’s restaurant recommendations because she trusts the friend’s taste.",
          "A researcher learns of a breakthrough technique from a scientist in another field whom she met briefly at a conference, rather than from her longtime laboratory colleagues.",
          "A reader seeks out new books by authors whose earlier works she has enjoyed."
        ],
        answer: [3],
        explanation: "In the passage, a distant tie connected to a different network supplies new information that close ties, who share one’s own knowledge, cannot. The researcher case matches this: a brief acquaintance from another field brings a new technique that close colleagues did not. The other choices show closeness or familiarity producing more benefit, which is the opposite pattern."
      },
      {
        id: "p07q3", type: "rc-select", topic: "rc", difficulty: 2,
        prompt: "Select the sentence in the passage that states a general principle about relationships that the author derives from the explanation of the finding.",
        answer: [4],
        explanation: "“The strength of a relationship and its informational value, then, may vary inversely.” The word “then” marks it as a conclusion, and it generalizes from the explanation in the sentence before it."
      }
    ]
  },

  {
    id: "p08", difficulty: 1, kind: "short",
    paragraphs: [
      [
        "Early jazz recordings were constrained by the technology that preserved them.",
        "A ten-inch 78-rpm disc held only about three minutes of sound per side, so musicians who in live performance might stretch a tune across a quarter of an hour had to compress their ideas drastically for the studio.",
        "Some historians regard these recordings as poor substitutes for the music actually heard in dance halls.",
        "Yet the constraint may also have shaped the music in lasting ways: the compact, tightly arranged three-minute performance became a model that later musicians imitated even after longer formats made it unnecessary.",
        "Seen this way, the limits of the 78 were not merely obstacles that early musicians overcame but conditions that helped define the idiom itself."
      ]
    ],
    questions: [
      {
        id: "p08q1", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "According to the passage, musicians recording on 78-rpm discs had to",
        options: [
          "record their performances in dance halls rather than in studios",
          "abandon improvisation altogether",
          "condense performances that might otherwise have lasted much longer",
          "use larger discs for longer tunes",
          "play every tune at a faster tempo than usual"
        ],
        answer: [2],
        explanation: "Musicians who “might stretch a tune across a quarter of an hour had to compress their ideas drastically.” Giving up improvisation altogether goes beyond what the passage says, and nothing is said about recording in dance halls, using larger discs, or playing faster."
      },
      {
        id: "p08q2", type: "rc-multi", topic: "rc", difficulty: 2,
        prompt: "Which of the following can be inferred from the passage? Consider each of the choices separately and select all that apply.",
        options: [
          "The author believes that early jazz recordings accurately represent the music performed in dance halls.",
          "Recording formats developed after the 78-rpm disc permitted performances longer than about three minutes.",
          "Some musicians produced compact performances even when the technology no longer required them to."
        ],
        answer: [1, 2],
        explanation: "The second and third choices follow from the claim that later musicians imitated the three-minute model “even after longer formats made it unnecessary.” The first is unsupported: the author reports historians’ doubts and does not dispute them, arguing only that the constraint also had creative effects."
      },
      {
        id: "p08q3", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "The passage is primarily concerned with",
        options: [
          "arguing that early jazz recordings have little historical value",
          "explaining why live jazz performance declined in dance halls",
          "claiming that longer recording formats harmed the quality of jazz",
          "describing how 78-rpm discs were manufactured",
          "suggesting that a technological limitation may have had a formative as well as a restrictive effect on an art form"
        ],
        answer: [4],
        explanation: "The final sentence carries the main point: the three-minute limit “may also have shaped the music in lasting ways.” The passage presents the constraint as both restrictive and formative. The first choice adopts the historians’ view, which the author qualifies, and the remaining choices fall outside the passage’s scope."
      }
    ]
  },

  // ===================== LONG PASSAGES =====================

  {
    id: "p09", difficulty: 2, kind: "long",
    paragraphs: [
      [
        "Reef-building corals depend on a partnership with microscopic algae that live within their tissues, supplying the coral with sugars produced by photosynthesis in exchange for shelter and nutrients.",
        "When ocean temperatures rise even a degree or two above their usual summer maximum, this partnership breaks down: the corals expel their algae and turn white, a phenomenon known as bleaching.",
        "If the high temperatures persist, the corals starve.",
        "Corals can recover if cooler conditions return quickly enough for algae to recolonize their tissues, but repeated bleaching leaves less time for recovery between events.",
        "Because bleaching events have grown more frequent as the oceans have warmed, many marine biologists have predicted the widespread collapse of reef ecosystems within this century."
      ],
      [
        "A number of researchers have proposed that this prediction may be too pessimistic.",
        "The algae that inhabit corals are not a single species but a diverse group whose members differ markedly in their tolerance of heat.",
        "Some corals that survive a bleaching event are later found to host a higher proportion of heat-tolerant algae than they did before, suggesting that corals might acquire greater resilience by exchanging one set of partners for another.",
        "If such “symbiont shuffling” were widespread, reefs might adapt to warming far faster than they could through the slow process of genetic evolution in the corals themselves.",
        "Because algae reproduce far more rapidly than corals do, a change in partners can occur within a single season, whereas a comparable genetic change in a long-lived coral population might require many generations."
      ],
      [
        "The hypothesis is attractive, but its implications are easily overstated.",
        "Heat-tolerant algae typically supply their hosts with less sugar than do their heat-sensitive counterparts, so a coral that gains resilience in this way may grow more slowly and reproduce less.",
        "Moreover, in many reefs the changes in algal composition observed after bleaching prove temporary, reverting within a few years to the pre-bleaching mix.",
        "Symbiont shuffling may thus buy some reefs time, but it is unlikely by itself to offset the effects of continued warming.",
        "Those who invoke it as grounds for complacency about warming, in other words, mistake a reprieve for a remedy."
      ]
    ],
    questions: [
      {
        id: "p09q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "The primary purpose of the passage is to",
        options: [
          "argue that predictions of widespread reef collapse are entirely unfounded",
          "describe the process by which corals genetically evolve tolerance of heat",
          "compare the nutritional value of different species of coral-dwelling algae",
          "evaluate a proposed mechanism that might mitigate a predicted ecological outcome",
          "explain why coral bleaching events have become more frequent"
        ],
        answer: [3],
        explanation: "The passage lays out the prediction of reef collapse, presents symbiont shuffling as a reason for less pessimism, and then judges that shuffling “may thus buy some reefs time” but is unlikely to offset warming on its own. The author does not call the prediction unfounded, genetic evolution is mentioned only in passing, and the comparison of algae serves the evaluation rather than being its purpose."
      },
      {
        id: "p09q2", type: "rc-multi", topic: "rc", difficulty: 3,
        prompt: "According to the passage, which of the following is a reason to doubt that symbiont shuffling will prevent widespread reef decline? Consider each of the choices separately and select all that apply.",
        options: [
          "Corals that host heat-tolerant algae may receive less sugar from their partners.",
          "Shifts toward heat-tolerant algae after bleaching often do not last.",
          "Heat-tolerant algae occur in too few coral species to make a difference."
        ],
        answer: [0, 1],
        explanation: "The third paragraph gives two reasons. Heat-tolerant algae “supply their hosts with less sugar,” and the changes “prove temporary, reverting within a few years.” The passage never says heat-tolerant algae are limited to a few coral species."
      },
      {
        id: "p09q3", type: "rc-select", topic: "rc", difficulty: 2,
        prompt: "Select the sentence in the passage that presents evidence suggesting that corals can change the composition of their algal partners.",
        answer: [7],
        explanation: "“Some corals that survive a bleaching event are later found to host a higher proportion of heat-tolerant algae than they did before, suggesting that corals might acquire greater resilience by exchanging one set of partners for another.” The sentence before it says the algae vary in heat tolerance, but this sentence gives the observation that the mix of algae can change."
      },
      {
        id: "p09q4", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "It can be inferred from the passage that a coral that has acquired a higher proportion of heat-tolerant algae through symbiont shuffling",
        options: [
          "will be immune to future bleaching events",
          "may be less well positioned to grow and reproduce than it was before",
          "will pass on its increased heat tolerance genetically to its offspring",
          "most likely belongs to a species that was previously heat-sensitive",
          "will retain its new algal partners permanently"
        ],
        answer: [1],
        explanation: "Because heat-tolerant algae supply less sugar, “a coral that gains resilience in this way may grow more slowly and reproduce less.” Immunity is too extreme. Shuffling is contrasted with genetic change in the coral, so genetic inheritance is not implied. Permanence contradicts the point that such shifts often revert."
      }
    ]
  },

  {
    id: "p10", difficulty: 3, kind: "long",
    paragraphs: [
      [
        "Historians seeking to measure literacy in early modern England have relied heavily on a single kind of evidence: the ability to sign one’s name.",
        "Marriage registers, court depositions, and loyalty oaths survive in large numbers, and the proportion of signatures to marks on these documents offers a rare quantitative index of a skill that otherwise leaves few traces.",
        "By this measure, literacy was confined to a minority of the population until well into the eighteenth century, and was sharply stratified by class and sex.",
        "The resulting figures have been reproduced in textbooks so often that they have come to seem less like estimates than like facts."
      ],
      [
        "The method’s critics point out that it rests on a questionable premise about how reading and writing were taught.",
        "In most schools of the period, children learned to read first, often over several years, and began writing only afterward; many children, particularly girls and the children of laborers, left school before writing instruction began.",
        "Such individuals might read the Bible or a printed ballad with ease yet be unable to sign a register.",
        "Signature counts, on this view, do not so much measure literacy as measure the attainment of a later and more socially exclusive stage of schooling, and they therefore systematically understate the extent of reading ability among precisely those groups whom historians have described as least literate.",
        "A laborer’s daughter who marked her marriage register with a cross might, in other words, have been a more practiced reader than many who signed beside her."
      ],
      [
        "Defenders of signature evidence concede the point but argue that no better alternative exists.",
        "Records of book ownership skew toward the wealthy, and literary references to reading are anecdotal.",
        "A count that is consistently biased, they contend, can still reveal trends over time even if it misstates absolute levels.",
        "This defense is weaker than it appears, however, for the bias need not have been constant: if the age at which writing was taught, or the length of time poorer children remained in school, changed over the period, then apparent trends in signature rates might reflect changes in schooling rather than in the spread of reading."
      ]
    ],
    questions: [
      {
        id: "p10q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "Which of the following best expresses the main idea of the passage?",
        options: [
          "Signature evidence remains the most reliable available source for measuring early modern literacy.",
          "Literacy in early modern England was far more widespread than any historian has recognized.",
          "Because reading and writing were taught in sequence, signature counts are a problematic measure of literacy, and even their use for tracking trends is open to doubt.",
          "Records of book ownership provide a better index of early modern literacy than signatures do.",
          "Girls and the children of laborers were generally excluded from schooling in early modern England."
        ],
        answer: [2],
        explanation: "The passage presents the signature method and the critics’ point that reading was taught before writing. It then argues that the fallback defense, that signature counts at least track trends, is also weak. The first choice is the view the author argues against, and the second is too extreme. The passage says book ownership records are skewed, not better. It says many poorer children left school early, not that they were excluded from it."
      },
      {
        id: "p10q2", type: "rc-multi", topic: "rc", difficulty: 3,
        prompt: "The critics described in the second paragraph would most likely agree with which of the following? Consider each of the choices separately and select all that apply.",
        options: [
          "Signature counts overstate the literacy of the wealthy.",
          "Some people who could not sign their names were nonetheless able to read.",
          "Signature evidence understates reading ability more severely for some social groups than for others."
        ],
        answer: [1, 2],
        explanation: "The critics say such individuals “might read the Bible or a printed ballad with ease yet be unable to sign a register,” which supports the second choice. They also say signature counts understate reading ability “among precisely those groups whom historians have described as least literate,” which supports the third. Nothing suggests that signatures overstate anyone’s literacy, since a person who could sign had normally already learned to read."
      },
      {
        id: "p10q3", type: "rc-select", topic: "rc", difficulty: 3,
        prompt: "Select the sentence in the passage in which the author identifies a possible flaw in the reasoning of those who defend signature evidence.",
        answer: [12],
        explanation: "“This defense is weaker than it appears, however, for the bias need not have been constant: if the age at which writing was taught, or the length of time poorer children remained in school, changed over the period, then apparent trends in signature rates might reflect changes in schooling rather than in the spread of reading.” The earlier sentences in that paragraph state the defenders’ position. This one gives the author’s objection to it."
      },
      {
        id: "p10q4", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "The defenders’ argument that signature counts “can still reveal trends over time” depends on which of the following assumptions?",
        options: [
          "Records of book ownership are entirely without value as evidence of literacy.",
          "Most people who could sign their names could also read.",
          "Reading was taught before writing in every school of the period.",
          "Literary references to reading are less numerous than surviving signatures.",
          "The degree to which signature counts understate reading ability remained roughly the same throughout the period studied."
        ],
        answer: [4],
        explanation: "A biased measure can show trends only if the bias is “consistent,” meaning roughly constant over time. The author attacks exactly this assumption by pointing out that “the bias need not have been constant.” The first choice is too strong, since the defenders say only that the records are skewed. The other choices are not needed for a trend-based inference."
      }
    ]
  },

  {
    id: "p11", difficulty: 1, kind: "long",
    paragraphs: [
      [
        "Popular histories of Impressionism often credit a modest invention with making the movement possible: the collapsible metal paint tube, introduced in the mid-nineteenth century.",
        "Before its introduction, painters who wished to work outdoors had to grind pigments and store them in fragile animal bladders, an arrangement so inconvenient that most landscapes were composed in the studio from sketches.",
        "The tube, the story goes, freed artists to paint directly before their subjects and thus to capture the fleeting effects of light that became the hallmark of the Impressionist style.",
        "Such accounts have obvious appeal, offering a tidy narrative in which a technical advance produces an artistic one."
      ],
      [
        "There is truth in this account, but it is incomplete.",
        "Outdoor oil sketching was a well-established practice long before the tube, recommended in academic manuals as an exercise for training the eye.",
        "Such sketches, often small and rapidly executed on paper or board, were kept in the studio as reference material and only rarely shown to the public.",
        "What distinguished the Impressionists was not that they painted outdoors but that they exhibited such work as finished pictures, treating the sketch’s qualities of speed and spontaneity as artistic ends in themselves rather than as stages toward a polished studio composition.",
        "That decision was aesthetic and, in a sense, polemical; no change in equipment could have dictated it.",
        "Hostile critics of the early Impressionist exhibitions understood this perfectly well; their complaint was not that the pictures had been painted outdoors but that they looked unfinished."
      ],
      [
        "Indeed, many celebrated Impressionist canvases that appear to have been dashed off in a single outdoor session were in fact reworked extensively indoors.",
        "The tube made a certain way of working easier, but it was the painters’ redefinition of what counted as a finished painting that made Impressionism new.",
        "To credit the movement to a container for paint is, in this sense, to mistake a convenience for a cause."
      ]
    ],
    questions: [
      {
        id: "p11q1", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "The primary purpose of the passage is to",
        options: [
          "qualify a popular explanation of an artistic development",
          "argue that the paint tube had no influence on Impressionism",
          "describe how early paint tubes were manufactured",
          "defend the methods recommended in academic painting manuals",
          "explain why Impressionist paintings were reworked indoors"
        ],
        answer: [0],
        explanation: "The author grants that “there is truth in this account, but it is incomplete,” then argues that the movement’s novelty lay in a redefinition of the finished painting. That qualifies the popular account rather than rejecting it. The second choice is too extreme, because the author says the tube “made a certain way of working easier.” The other choices are details or fall outside the passage."
      },
      {
        id: "p11q2", type: "rc-select", topic: "rc", difficulty: 1,
        prompt: "Select the sentence in the passage that provides evidence undermining the impression that Impressionist paintings were spontaneous products of outdoor work.",
        answer: [10],
        explanation: "“Indeed, many celebrated Impressionist canvases that appear to have been dashed off in a single outdoor session were in fact reworked extensively indoors.” This is a factual claim that contradicts the appearance of spontaneity."
      },
      {
        id: "p11q3", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "According to the passage, outdoor oil sketching before the introduction of the paint tube was",
        options: [
          "unknown among academically trained painters",
          "commonly exhibited as finished work",
          "practiced only by the painters who later became Impressionists",
          "recommended as a means of training the eye",
          "discouraged by academic painting manuals"
        ],
        answer: [3],
        explanation: "Outdoor sketching was “recommended in academic manuals as an exercise for training the eye.” The passage says exhibiting sketches as finished work was what set the Impressionists apart, so that was not common practice earlier. The remaining choices contradict the passage."
      },
      {
        id: "p11q4", type: "rc-multi", topic: "rc", difficulty: 2,
        prompt: "The author of the passage would most likely agree with which of the following statements? Consider each of the choices separately and select all that apply.",
        options: [
          "The paint tube made outdoor painting more convenient than it had been.",
          "What was new about Impressionism lay chiefly in a change in artistic values rather than in a change in materials.",
          "An academically trained painter of the period might have painted outdoors without intending to exhibit the result."
        ],
        answer: [0, 1, 2],
        explanation: "All three are supported. The tube “made a certain way of working easier.” Impressionism was new because of “the painters’ redefinition of what counted as a finished painting,” a decision that was “aesthetic” and that “no change in equipment could have dictated.” Academic manuals recommended outdoor sketching as a training exercise, and exhibiting such work as finished pictures was what distinguished the Impressionists."
      }
    ]
  },

  {
    id: "p12", difficulty: 3, kind: "long",
    paragraphs: [
      [
        "It has become commonplace to assert that markets characterized by strong network effects—markets in which a product becomes more valuable to each user as more people use it—tend inexorably toward monopoly.",
        "Once one firm attains a modest lead, the reasoning goes, new users flock to the larger network, widening the lead until rivals are driven out.",
        "The histories of telephone systems, computer operating systems, and social media platforms are routinely cited in support.",
        "Pointing to these cases, some commentators conclude that antitrust intervention in such markets is futile, since any market that was broken up would simply re-concentrate around a new leader."
      ],
      [
        "The argument is not wrong so much as incomplete, for it treats the strength of network effects as fixed when in fact it depends on conditions that firms and users can alter.",
        "Where users can cheaply participate in several networks at once—a practice economists call multihoming—the advantage of the largest network is blunted, since joining a smaller rival does not require abandoning the leader.",
        "Ride-hailing drivers who run several apps simultaneously, and shoppers who compare prices across multiple online marketplaces, illustrate the point.",
        "Similarly, when networks are made interoperable, so that users of one can communicate with users of another, the size of any single network matters less than the size of the combined system.",
        "Email, which allows a user of any provider to write to a user of any other, has proved far less hospitable to a single dominant firm than have messaging services lacking such compatibility."
      ],
      [
        "None of this implies that concentration in such markets is benign or that it will correct itself.",
        "Dominant firms have strong incentives to raise the costs of multihoming—through exclusivity requirements, for example, or loyalty discounts—and to resist interoperability.",
        "The tendency toward monopoly, then, is better understood not as a natural law of networked markets but as an outcome that is partly engineered, and that policy might therefore partly undo.",
        "Treating dominance as inevitable risks making it so, by discouraging the very interventions that could preserve competition."
      ]
    ],
    questions: [
      {
        id: "p12q1", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "The author’s attitude toward the “commonplace” assertion described in the first paragraph is best described as",
        options: [
          "wholehearted endorsement",
          "outright dismissal",
          "qualified dissent that grants the assertion some validity",
          "amused indifference",
          "reluctant agreement based on the historical record"
        ],
        answer: [2],
        explanation: "The author says “the argument is not wrong so much as incomplete,” which grants it some validity while disputing its claim that monopoly is inevitable. That rules out endorsement and dismissal alike. “Reluctant agreement” is tempting, but the author rejects the idea that monopoly is “a natural law of networked markets,” so the stance is disagreement, not agreement."
      },
      {
        id: "p12q2", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "The examples of ride-hailing drivers and online shoppers serve primarily to",
        options: [
          "show how dominant firms impose exclusivity requirements on users",
          "demonstrate that network effects do not exist in some markets",
          "provide evidence that interoperability benefits consumers",
          "support the claim that networked markets tend toward monopoly",
          "illustrate a condition under which the advantage conferred by network size is reduced"
        ],
        answer: [4],
        explanation: "The examples follow the claim about multihoming and “illustrate the point” that when users can join several networks cheaply, “the advantage of the largest network is blunted.” Blunting an advantage is not the same as showing network effects are absent, so the second choice goes too far. Interoperability is a separate point that comes next."
      },
      {
        id: "p12q3", type: "rc-multi", topic: "rc", difficulty: 3,
        prompt: "It can be inferred that the author would regard which of the following as potentially effective in reducing concentration in networked markets? Consider each of the choices separately and select all that apply.",
        options: [
          "Prohibiting contractual terms that prevent users of a dominant platform from also using rival platforms",
          "Requiring dominant platforms to let their users communicate with users of competing platforms",
          "Encouraging the largest firm in a market to expand until it serves all users"
        ],
        answer: [0, 1],
        explanation: "The author names multihoming and interoperability as conditions that weaken the largest network’s advantage. Dominant firms resist both through tactics such as “exclusivity requirements,” and the author says policy “might therefore partly undo” the resulting concentration. The first and second choices protect multihoming and require interoperability. The third would increase concentration."
      },
      {
        id: "p12q4", type: "rc-select", topic: "rc", difficulty: 3,
        prompt: "Select the sentence in the passage in which the author anticipates and forestalls a possible misreading of the argument.",
        answer: [9],
        explanation: "“None of this implies that concentration in such markets is benign or that it will correct itself.” After arguing that network effects can be blunted, the author heads off the inference that concentration is therefore harmless or will fix itself."
      }
    ]
  },

  {
    id: "p13", difficulty: 2, kind: "long",
    paragraphs: [
      [
        "Many of the most celebrated nineteenth-century novels first reached readers not as books but in installments, issued monthly or weekly over a year or more.",
        "Twentieth-century critics, who encountered these works as single bound volumes, often faulted them for sprawling plots, abrupt cliffhangers, and an apparent lack of overall design, defects they attributed to authors writing hastily against deadlines.",
        "Some went so far as to suggest that the novels’ enduring popularity owed more to their memorable characters than to any formal achievement."
      ],
      [
        "More recent scholarship has argued that such judgments mistake the conditions under which the novels were meant to be read.",
        "A reader following a story across eighteen months experienced it as part of the rhythm of ordinary life, discussing each number with friends and speculating about what would come next.",
        "Installments were often read aloud within households, so that a single copy might reach a dozen listeners.",
        "Features that seem like padding in a continuous reading—recapitulations of earlier events, recurring catchphrases attached to minor characters—served to orient readers who had last encountered the story weeks before.",
        "The cliffhanger, similarly, was less a lapse of craft than a deliberate device for sustaining interest across the interval between installments.",
        "Some authors even adjusted later installments in response to readers’ letters, so that the novel became, in a modest sense, a collaboration with its audience."
      ],
      [
        "This historical reconstruction is valuable, but it should not become a blanket defense.",
        "To explain why a feature was present is not to establish that it was successful, and some serial novels were in fact shaped by commercial pressure in ways that their own authors regretted.",
        "Moreover, the installment form did not dictate a single aesthetic: some writers planned their serials meticulously in advance, while others improvised from month to month, and the resulting works differ accordingly.",
        "The serial context, in short, is a necessary starting point for judging these novels, not a substitute for judgment."
      ]
    ],
    questions: [
      {
        id: "p13q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "Which of the following best states the main point of the passage?",
        options: [
          "Understanding the serial context of nineteenth-century novels illuminates features once regarded as flaws, though it does not settle questions of the novels’ merit.",
          "Twentieth-century critics were correct that serial novels generally lack overall design.",
          "Commercial pressure damaged most novels that were published in installments.",
          "Nineteenth-century serial novels are best read in installments by modern readers.",
          "Writers of serial novels planned their works meticulously in advance."
        ],
        answer: [0],
        explanation: "The passage accepts the scholarly reconstruction as “valuable” but warns that it “should not become a blanket defense.” The serial context is “a necessary starting point for judging these novels, not a substitute for judgment.” The second choice is the view the newer scholarship challenges. The third and fifth choices distort details, since the passage refers to “some” serial novels and “some writers.”"
      },
      {
        id: "p13q2", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "In the context of the passage, the word “number” (in “discussing each number with friends”) most nearly means",
        options: [
          "numerical figure",
          "installment",
          "group of readers",
          "sum paid for a subscription",
          "musical piece"
        ],
        answer: [1],
        explanation: "The passage is about novels “issued monthly or weekly” in installments. Readers discussed each issue as it appeared, so “number” means a single installment of a serial publication."
      },
      {
        id: "p13q3", type: "rc-multi", topic: "rc", difficulty: 2,
        prompt: "According to the passage, recent scholarship explains which of the following features of serial novels as responses to the conditions of installment publication? Consider each of the choices separately and select all that apply.",
        options: [
          "Recapitulations of earlier events",
          "Recurring catchphrases attached to minor characters",
          "Abrupt cliffhangers"
        ],
        answer: [0, 1, 2],
        explanation: "Recapitulations and recurring catchphrases “served to orient readers who had last encountered the story weeks before.” The cliffhanger was “a deliberate device for sustaining interest across the interval between installments.” All three are explained by the serial format."
      },
      {
        id: "p13q4", type: "rc-select", topic: "rc", difficulty: 3,
        prompt: "Select the sentence in the passage that distinguishes between accounting for a literary feature and vindicating it.",
        answer: [10],
        explanation: "“To explain why a feature was present is not to establish that it was successful, and some serial novels were in fact shaped by commercial pressure in ways that their own authors regretted.” Its first clause separates explaining a feature from justifying it."
      }
    ]
  },

  {
    id: "p14", difficulty: 1, kind: "long",
    paragraphs: [
      [
        "On islands, animals frequently evolve to sizes strikingly different from those of their mainland relatives.",
        "Large mammals such as elephants and deer have repeatedly produced dwarf forms on islands, while small animals such as rodents and some lizards have tended toward gigantism.",
        "Fossil elephants no taller than a large pig have been found on several Mediterranean islands, and on islands in Southeast Asia rats grew to several times the size of their mainland relatives.",
        "Biologists refer to this pattern as the island rule."
      ],
      [
        "Several explanations have been offered.",
        "For large animals, the limited food available on a small island may favor individuals that need less of it, and the absence of large predators removes one of the main advantages of great size.",
        "For small animals, the same absence of predators may relax the pressure to remain small enough to hide, while reduced competition from other species may allow them to exploit food sources that on the mainland would be taken by larger competitors.",
        "In both cases, island populations appear to converge on a size intermediate between the extremes found on continents.",
        "Island dwarfs and island giants, on this account, are two expressions of a single process rather than separate phenomena requiring separate explanations."
      ],
      [
        "The island rule is not, however, without exceptions, and some researchers have questioned whether it is a rule at all.",
        "Studies that compile data across many species find that the trend is strong in some groups, such as mammals, but weak or absent in others, such as birds and turtles.",
        "In some surveys, island birds proved about as likely to be smaller than their mainland relatives as to be larger, whatever the size of the mainland form.",
        "Critics also note that early descriptions of the rule drew heavily on striking fossil examples, which may have been noticed precisely because they were extreme.",
        "Whether the island rule describes a general evolutionary tendency or a collection of vivid special cases thus remains under debate."
      ]
    ],
    questions: [
      {
        id: "p14q1", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "The primary purpose of the passage is to",
        options: [
          "argue that the island rule applies equally to all groups of animals",
          "explain why birds do not follow the island rule",
          "refute the proposed explanations of island gigantism",
          "present fossil evidence that elephants once lived on Mediterranean islands",
          "describe a biological pattern, explanations offered for it, and doubts about its generality"
        ],
        answer: [4],
        explanation: "The first paragraph describes the pattern, the second gives explanations, and the third raises doubts about how general it is. The first choice contradicts the third paragraph. The passage reports that birds show a weak trend without explaining why, it presents the explanations without refuting them, and the fossils are only an example."
      },
      {
        id: "p14q2", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "According to the passage, the absence of large predators on islands",
        options: [
          "is a factor that may influence body size in both large and small animals",
          "causes small animals to become smaller over time",
          "was first documented through fossil evidence",
          "explains why birds do not follow the island rule",
          "increases competition among small species"
        ],
        answer: [0],
        explanation: "The absence of predators is cited for large animals (it “removes one of the main advantages of great size”) and again for small ones (“the same absence of predators may relax the pressure to remain small”). For small animals it allows them to grow larger, not smaller, and the passage says competition is reduced, not increased."
      },
      {
        id: "p14q3", type: "rc-select", topic: "rc", difficulty: 1,
        prompt: "Select the sentence in the passage that suggests a possible source of bias in the evidence originally used to support the island rule.",
        answer: [12],
        explanation: "“Critics also note that early descriptions of the rule drew heavily on striking fossil examples, which may have been noticed precisely because they were extreme.” If extreme cases were the ones noticed, the early evidence was skewed toward them."
      },
      {
        id: "p14q4", type: "rc-multi", topic: "rc", difficulty: 1,
        prompt: "Which of the following can be inferred from the passage? Consider each of the choices separately and select all that apply.",
        options: [
          "On the mainland, small animals may face pressure to remain small enough to hide from predators.",
          "Island populations of all species eventually reach the same absolute body size.",
          "The island rule appears to hold more consistently for mammals than for turtles."
        ],
        answer: [0, 2],
        explanation: "The first choice follows because the absence of island predators “may relax the pressure to remain small enough to hide,” which implies the pressure exists where predators are present. The third follows because the trend “is strong in … mammals, but weak or absent in … turtles.” The second distorts the claim that populations “converge on a size intermediate between the extremes,” which is a size relative to each group, not a single absolute size shared by all species."
      }
    ]
  },

  {
    id: "p15", difficulty: 3, kind: "long",
    paragraphs: [
      [
        "Before the late nineteenth century, most towns kept their own local time, setting their clocks by the position of the sun.",
        "Noon in one town might fall several minutes earlier or later than noon in a town a few dozen miles to the east or west, a discrepancy of little consequence when travel between them took the better part of a day.",
        "The railroads changed this.",
        "Faced with timetables that had to reconcile dozens of local times, railway companies adopted standardized times for their own operations, and these eventually became the basis for the time zones in use today.",
        "Within a few decades, a patchwork of hundreds of local times had given way, at least on paper, to a handful of zones."
      ],
      [
        "Historians have often told this story as one of straightforward technological necessity: faster travel created a problem, and standard time solved it.",
        "Yet the transition was neither swift nor uncontested.",
        "For decades after railway time was introduced, many communities maintained two times at once, with public clocks displaying both the local and the railway hour, and some municipalities pointedly refused to abandon solar time, regarding the change as an imposition by distant corporate interests.",
        "Legal codes, too, lagged behind: in several jurisdictions, courts were obliged to decide whether contracts and statutes referring to a given hour meant local or standard time."
      ],
      [
        "These episodes suggest that standard time was not simply a technical adjustment but a redistribution of authority over a basic dimension of daily life.",
        "The question of who would set the clocks—local communities attending to the sun, or national and commercial institutions attending to coordination—was a political question, even when it was not recognized as one.",
        "Railway time served the needs of commerce conducted across great distances; solar time served a community whose days were organized around its own sunrise and noon.",
        "That the outcome now seems inevitable is itself a measure of how thoroughly the newer authority prevailed."
      ]
    ],
    questions: [
      {
        id: "p15q1", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "Which of the following best expresses the main point of the passage?",
        options: [
          "Standard time was adopted as soon as the railroads demonstrated that it was necessary.",
          "The adoption of standard time involved contested questions of authority that a purely technological account obscures.",
          "Local solar time was more accurate than the standardized time adopted by the railroads.",
          "Courts played the decisive role in establishing standard time.",
          "Railway companies deliberately set out to undermine the authority of municipal governments."
        ],
        answer: [1],
        explanation: "The author challenges the “straightforward technological necessity” narrative and concludes that standard time involved “a redistribution of authority” and “a political question.” The first choice contradicts the claim that the transition was “neither swift nor uncontested.” Court decisions are one detail, and the passage attributes no intention to the railways."
      },
      {
        id: "p15q2", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "The final sentence of the passage primarily serves to",
        options: [
          "concede that the technological account is ultimately correct",
          "argue that local solar time should be restored",
          "summarize the legal disputes described in the second paragraph",
          "suggest that the apparent inevitability of the outcome is itself a result of the contest the passage describes",
          "indicate that the political character of the change was widely recognized at the time"
        ],
        answer: [3],
        explanation: "The author argues that the outcome “now seems inevitable” because the newer authority prevailed so thoroughly. The sense of inevitability, which the technological account relies on, is therefore a product of the political victory. The fifth choice contradicts the remark that the question was political “even when it was not recognized as one.”"
      },
      {
        id: "p15q3", type: "rc-select", topic: "rc", difficulty: 1,
        prompt: "Select the sentence in the passage that provides evidence of resistance to standard time at the level of individual communities.",
        answer: [7],
        explanation: "“For decades after railway time was introduced, many communities maintained two times at once, with public clocks displaying both the local and the railway hour, and some municipalities pointedly refused to abandon solar time, regarding the change as an imposition by distant corporate interests.” The next sentence describes legal uncertainty, not resistance by communities."
      },
      {
        id: "p15q4", type: "rc-multi", topic: "rc", difficulty: 3,
        prompt: "The passage supports which of the following statements about the period after railway time was introduced? Consider each of the choices separately and select all that apply.",
        options: [
          "Some public clocks showed more than one time.",
          "Courts consistently ruled that references to a given hour meant standard time.",
          "Railway companies continued to use local solar times in their own timetables."
        ],
        answer: [0],
        explanation: "Only the first choice is supported: public clocks displayed “both the local and the railway hour.” The passage says courts “were obliged to decide” which time was meant but does not say how they ruled. The railways adopted standardized times “for their own operations,” which contradicts the third choice."
      }
    ]
  },

  // ===================== ARGUMENT / CRITICAL REASONING =====================

  {
    id: "p16", difficulty: 2, kind: "argument",
    paragraphs: [
      [
        "In the year after the city of Marlow installed brighter street lighting in its central business district, reported nighttime burglaries in that district fell by 22 percent.",
        "The new lights were installed on every street in the district within a single month.",
        "The city council has therefore proposed installing the same lighting in all of the city’s residential neighborhoods, arguing that doing so will produce a comparable reduction in nighttime burglaries citywide."
      ]
    ],
    questions: [
      {
        id: "p16q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "Which of the following, if true, most seriously weakens the city council’s argument?",
        options: [
          "Residents of several neighborhoods have publicly expressed support for brighter street lighting.",
          "The new lighting consumes less electricity than the lighting it replaced.",
          "During the same year, the police department doubled the number of officers patrolling the central business district at night.",
          "The brighter lighting in the central business district cost less to install than city planners had projected.",
          "Several other cities that installed brighter street lighting saw a decrease in nighttime traffic accidents."
        ],
        answer: [2],
        explanation: "The argument assumes the lighting caused the drop in burglaries. Doubling night patrols in the same district at the same time offers another explanation, which undermines the basis for expecting the same result elsewhere. The other choices, such as residents’ support for the lighting or its cost and energy use, are irrelevant to whether the lighting reduces burglary."
      }
    ]
  },

  {
    id: "p17", difficulty: 3, kind: "argument",
    paragraphs: [
      [
        "Researchers studying a remote mountain community found that its residents, who eat large quantities of a particular fermented vegetable, have unusually low rates of stomach cancer.",
        "The community has been studied by medical researchers for several decades, and its diet has changed little over that time.",
        "The researchers conclude that the fermented vegetable protects against stomach cancer and recommend that it be promoted as a dietary supplement in other regions."
      ]
    ],
    questions: [
      {
        id: "p17q1", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "The researchers’ argument depends on which of the following assumptions?",
        options: [
          "Rates of stomach cancer have been declining worldwide.",
          "Residents of the community eat more of the fermented vegetable than does any other population in the world.",
          "Every resident of the community eats the fermented vegetable daily.",
          "The fermented vegetable provides no health benefits other than protection against stomach cancer.",
          "The community’s low rate of stomach cancer is not primarily attributable to some other factor, such as a genetic trait common among its residents."
        ],
        answer: [4],
        explanation: "The researchers move from a correlation to a causal claim, so they must assume no other factor, such as genetics, mainly explains the low cancer rate. If one did, the conclusion and the recommendation would fail. The second and third choices are stronger than the argument requires, and the first and fourth have no bearing on it."
      }
    ]
  },

  {
    id: "p18", difficulty: 3, kind: "argument",
    paragraphs: [
      [
        "<b>Over the past decade, the number of independent bookstores in Corvallia has increased by nearly a third</b>, even as online retailers have captured a growing share of book sales.",
        "Some analysts have taken this as evidence that independent bookstores have found a durable niche.",
        "But the increase is better explained by a temporary factor: commercial rents in Corvallia’s town centers fell sharply after several chain stores closed, allowing small shops to open where they previously could not afford to.",
        "Since <b>rents are now rising again as vacant storefronts are filled</b>, the number of independent bookstores is likely to decline."
      ]
    ],
    questions: [
      {
        id: "p18q1", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "In the argument, the two portions in boldface play which of the following roles?",
        options: [
          "The first is the argument’s main conclusion; the second is evidence offered in support of that conclusion.",
          "The first is a claim that the argument rejects as false; the second is the argument’s main conclusion.",
          "The first is a finding that supports an interpretation the argument endorses; the second is a consideration that weighs against that interpretation.",
          "The first is a finding that the argument seeks to explain; the second is evidence offered in support of the argument’s prediction.",
          "The first and the second are both offered as evidence for the analysts’ conclusion."
        ],
        answer: [3],
        explanation: "The first boldface is a fact the argument accepts and explains through falling rents rather than a “durable niche.” The second is a premise (“Since …”) supporting the main conclusion that the number of bookstores “is likely to decline.” The argument rejects the analysts’ interpretation rather than endorsing it, and the second boldface is a premise, not the conclusion."
      }
    ]
  },

  {
    id: "p19", difficulty: 2, kind: "argument",
    paragraphs: [
      [
        "After a regional airline cut its fares on the route between Arden and Brell by 25 percent, the number of passengers it carried on that route rose by 50 percent.",
        "Although the airline’s revenue from the route therefore increased, its profit on the route declined.",
        "Fuel prices and airport fees on the route remained unchanged throughout the period."
      ]
    ],
    questions: [
      {
        id: "p19q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "Which of the following, if true, most helps to resolve the apparent discrepancy described above?",
        options: [
          "A competing airline also reduced its fares on the route between Arden and Brell.",
          "To accommodate the additional passengers, the airline added several daily flights to the route, and the cost of operating those flights exceeded the additional revenue they generated.",
          "Most of the new passengers had previously traveled between Arden and Brell by train.",
          "The airline’s profits on its other routes rose during the same period.",
          "Before the fare cut, the route between Arden and Brell had been among the airline’s most profitable."
        ],
        answer: [1],
        explanation: "Profit can fall while revenue rises only if costs rose by more. Extra flights that cost more than the revenue they brought in explain the outcome. A competitor’s fare cut, the passengers’ previous mode of travel, and other routes’ profits do not explain why this route’s costs exceeded its revenue gain. The route’s earlier profitability does not explain the decline either."
      }
    ]
  },

  {
    id: "p20", difficulty: 1, kind: "argument",
    paragraphs: [
      [
        "Ecologists have observed that a species of songbird nests far more often in forest patches containing dead standing trees than in patches without them.",
        "They hypothesize that the birds prefer such patches because dead trees harbor the wood-boring insects on which the birds feed their young.",
        "The observations were made over three breeding seasons in a large protected forest where dead trees are not removed."
      ]
    ],
    questions: [
      {
        id: "p20q1", type: "rc-single", topic: "rc", difficulty: 1,
        prompt: "Which of the following, if true, most strongly supports the ecologists’ hypothesis?",
        options: [
          "The songbirds also eat seeds during the winter months.",
          "Dead standing trees are more common in older forests than in younger ones.",
          "Several other bird species nest in cavities in dead trees.",
          "In forest patches where wood-boring insects were experimentally removed from the dead trees, the songbirds nested no more often than in patches without dead trees.",
          "Wood-boring insects can damage living trees as well as dead ones."
        ],
        answer: [3],
        explanation: "Removing the insects while leaving the dead trees in place eliminated the birds’ preference, which isolates the insects as the attraction. The third choice suggests a rival explanation (nest cavities), and the second points to forest age as a possible confound. The remaining choices are irrelevant."
      }
    ]
  },

  {
    id: "p21", difficulty: 2, kind: "argument",
    paragraphs: [
      [
        "The Lindell Chamber Orchestra includes musicians who play string, wind, and percussion instruments.",
        "Every member of the orchestra who plays a string instrument also teaches at the city conservatory.",
        "None of the orchestra’s conductors has ever taught at the conservatory.",
        "Some of the orchestra’s conductors began their careers as members of the orchestra."
      ]
    ],
    questions: [
      {
        id: "p21q1", type: "rc-single", topic: "rc", difficulty: 2,
        prompt: "If the statements above are true, which of the following must also be true?",
        options: [
          "At least one person who began a career as a member of the orchestra has never taught at the conservatory.",
          "Every teacher at the conservatory plays a string instrument.",
          "Some of the orchestra’s conductors played string instruments when they were members of the orchestra.",
          "No member of the orchestra who plays a wind instrument teaches at the conservatory.",
          "Every member of the orchestra teaches at the conservatory."
        ],
        answer: [0],
        explanation: "Some conductors began as orchestra members, and no conductor has ever taught at the conservatory. Those conductors are therefore people who began as members and never taught there. The second choice reverses the conditional. Nothing establishes the third, fourth, or fifth choice, since the statements say nothing about which instruments conductors played or about whether non-string members teach."
      }
    ]
  },

  {
    id: "p22", difficulty: 3, kind: "argument",
    paragraphs: [
      [
        "A software company introduced a four-day workweek for its engineers, keeping their pay unchanged.",
        "The size of the engineering team stayed the same throughout the period, and no engineers were hired or let go.",
        "In the six months that followed, the engineers completed 10 percent more project milestones than they had in the preceding six months.",
        "The company’s management concludes that the shorter workweek increased the engineers’ productivity."
      ]
    ],
    questions: [
      {
        id: "p22q1", type: "rc-single", topic: "rc", difficulty: 3,
        prompt: "Which of the following would it be most useful to know in order to evaluate management’s conclusion?",
        options: [
          "Whether the engineers prefer a four-day workweek to a five-day workweek",
          "Whether other software companies have adopted four-day workweeks",
          "Whether the company’s sales staff were also moved to a four-day workweek",
          "Whether the engineers’ pay is higher than the industry average",
          "Whether the milestones completed in the later six-month period were comparable in size and difficulty to those completed in the earlier period"
        ],
        answer: [4],
        explanation: "The conclusion treats the number of milestones as a measure of productivity. If the later milestones were smaller or easier, the 10 percent increase would not show higher productivity. If they were comparable, the conclusion is better supported. The other choices do not affect whether the shorter week raised output."
      }
    ]
  }
];
