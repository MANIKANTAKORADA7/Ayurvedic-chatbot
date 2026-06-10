// Ayurvedic Home Remedy Chatbot Knowledge Base
// All remedies are formulated using ONLY: Turmeric, Ginger, Honey, Tulsi, Ajwain, Jeera, Fennel, Aloe Vera, Coconut Oil, Salt, Lemon, Clove, Black Pepper.

const SAFETY_TRIGGERS = [
  {
    keywords: ["chest pain", "pain in chest", "heart pain", "cardiac"],
    reason: "Chest pain"
  },
  {
    keywords: ["breathing difficulty", "difficulty breathing", "hard to breathe", "gasping", "breathless", "cannot breathe"],
    reason: "Breathing difficulty"
  },
  {
    keywords: ["shortness of breath", "short of breath", "shallow breathing"],
    reason: "Shortness of breath"
  },
  {
    keywords: [
      "high fever", "fever 103", "fever 104", "fever 105", "fever above 102", "103 degrees", "104 degrees", "105 degrees",
      "fever of 103", "fever of 104", "fever of 105", "fever of 102.5", "fever of 102.8"
    ],
    reason: "High fever above 102°F"
  },
  {
    keywords: ["severe pain", "unbearable pain", "extreme pain", "pain is severe", "sharp pain in abdomen", "excruciating"],
    reason: "Persistent severe pain"
  },
  {
    keywords: ["severe burn", "third degree burn", "blistered burn", "deep burn", "chemical burn"],
    reason: "Severe burns"
  },
  {
    keywords: ["eye injury", "injured eye", "hit in the eye", "eye pain severe", "scratched eye"],
    reason: "Eye injuries"
  },
  {
    keywords: ["vision problems", "blurry vision", "loss of vision", "cannot see", "double vision"],
    reason: "Vision problems"
  },
  {
    keywords: ["allergic reaction", "anaphylaxis", "swollen throat", "hives all over", "cannot swallow allergic"],
    reason: "Allergic reactions"
  },
  {
    keywords: ["seizure", "seizures", "convulsion", "convulsions", "fit", "fits"],
    reason: "Seizures"
  },
  {
    keywords: ["uncontrolled bleeding", "bleeding heavily", "cannot stop bleeding", "hemorrhage"],
    reason: "Uncontrolled bleeding"
  },
  {
    keywords: ["lost consciousness", "unconscious", "passed out", "fainted", "blacked out", "loss of consciousness"],
    reason: "Loss of consciousness"
  },
  {
    keywords: [
      "baby", "infant", "toddler", "newborn", "child under 5", "under 5 years", "1 year old", "2 years old",
      "3 years old", "4 years old", "6 months old", "18 months old", "pediatric", "my child", "my kid"
    ],
    reason: "Symptoms in children under 5 years old"
  }
];

const REMEDY_DATABASE = [
  {
    ailment: "Common Cold",
    remedies: [
      {
        name: "Ginger-Tulsi Herbal Tea",
        ingredients: ["Ginger", "Tulsi", "Honey"],
        preparation: "Crush 5-6 fresh Tulsi leaves and a 1-inch piece of fresh Ginger. Boil them in 1.5 cups of water for about 5 to 7 minutes until the liquid reduces slightly. Strain into a cup.",
        usage: "Let the tea cool down to a warm temperature, stir in 1 teaspoon of Honey, and drink it slowly. Take it 2-3 times daily for relief."
      },
      {
        name: "Turmeric-Pepper Warm Water",
        ingredients: ["Turmeric", "Black Pepper", "Salt"],
        preparation: "Add 1/2 teaspoon of Turmeric powder and 1/4 teaspoon of freshly crushed Black Pepper to a glass of boiling water. Add a tiny pinch of Salt.",
        usage: "Mix well and sip warm twice daily, preferably before going to bed. The black pepper helps in absorbing turmeric's therapeutic compounds."
      }
    ],
    when_to_use: "Best used at the onset of sneezing, mild sore throat, nasal congestion, and body aches.",
    when_not_to_use: "Do not give honey to children under 1 year old. Avoid hot herbal infusions if you have active stomach ulcers.",
    see_doctor_if: [
      "Fever rises above 102°F.",
      "Symptoms persist for more than 5 days without improvement.",
      "You develop severe ear pain or sinus pressure."
    ]
  },
  {
    ailment: "Sore Throat",
    remedies: [
      {
        name: "Turmeric Salt Water Gargle",
        ingredients: ["Salt", "Turmeric"],
        preparation: "Add 1/2 teaspoon of Salt and 1/2 teaspoon of Turmeric powder to 1 glass of warm water. Stir thoroughly.",
        usage: "Gargle with this solution for 30-60 seconds, then spit it out. Repeat this 3-4 times a day to soothe throat lining irritation."
      },
      {
        name: "Ginger-Lemon-Honey Syrup",
        ingredients: ["Ginger", "Lemon", "Honey"],
        preparation: "Grate fresh Ginger and squeeze it to extract 1 teaspoon of fresh juice. Mix it with 1 teaspoon of fresh Lemon juice and 1 tablespoon of raw Honey.",
        usage: "Consume this syrup slowly, letting it coat your throat. Take it 2-3 times a day."
      }
    ],
    when_to_use: "Excellent for scratchy throat, pain when swallowing, and hoarseness associated with minor colds.",
    when_not_to_use: "Do not use very hot water for gargling as it can burn the throat mucosa. Do not consume if you have acute throat bleeding.",
    see_doctor_if: [
      "You experience difficulty swallowing liquids or breathing.",
      "High fever is present.",
      "White patches appear on the tonsils."
    ]
  },
  {
    ailment: "Tension Headache",
    remedies: [
      {
        name: "Ginger Temples Paste",
        ingredients: ["Ginger"],
        preparation: "Grind 1 teaspoon of dry Ginger powder or fresh Ginger with a few drops of water to form a thick, smooth paste. Warm the paste slightly.",
        usage: "Apply this paste gently onto your forehead and temples. Lie down in a quiet room for 15-20 minutes, then rinse it off with lukewarm water. Note: A mild tingling sensation is normal."
      },
      {
        name: "Soothing Coconut Oil Massage",
        ingredients: ["Coconut Oil"],
        preparation: "Take 1 tablespoon of pure cold-pressed Coconut Oil and rub it between your palms to warm it up.",
        usage: "Gently massage the oil onto your temples, forehead, and the back of your neck in circular motions for 10 minutes. Relax in a dark room."
      }
    ],
    when_to_use: "Ideal for mild to moderate headaches caused by stress, fatigue, or sinus congestion.",
    when_not_to_use: "Do not apply the ginger paste too close to the eyes to prevent irritation. Discontinue ginger paste immediately if intense burning occurs.",
    see_doctor_if: [
      "The headache is sudden, explosive, or accompanied by a stiff neck.",
      "Headache occurs after a head injury.",
      "You experience visual changes, slurred speech, or numbness."
    ]
  },
  {
    ailment: "Acidity",
    remedies: [
      {
        name: "Cooling Fennel Seed Infusion",
        ingredients: ["Fennel"],
        preparation: "Add 1 tablespoon of Fennel seeds (Saunf) to 1 cup of water. Boil for 3-5 minutes, then cover and let it steep for another 5 minutes. Strain the seeds.",
        usage: "Drink this lukewarm infusion slowly after meals, or chew 1 teaspoon of raw fennel seeds directly after eating."
      },
      {
        name: "Jeera (Cumin) Water",
        ingredients: ["Jeera"],
        preparation: "Boil 1 teaspoon of Cumin seeds (Jeera) in 2 cups of water for 5 minutes. The water will turn light brown. Let it cool down to room temperature and strain.",
        usage: "Sip this cumin water slowly throughout the day, especially on an empty stomach or immediately when feeling acid reflux symptoms."
      }
    ],
    when_to_use: "Use when experiencing a burning sensation in the stomach, chest (heartburn), or throat, and sour burps.",
    when_not_to_use: "Avoid drinking excessive water immediately after a heavy meal. Do not use if you are suffering from chronic diarrhea.",
    see_doctor_if: [
      "Acidity is accompanied by difficulty swallowing or vomiting blood.",
      "You experience unexplained weight loss.",
      "Stomach pain is severe, constant, and radiates to the back."
    ]
  },
  {
    ailment: "Gas/Bloating",
    remedies: [
      {
        name: "Ajwain-Salt Warm Water",
        ingredients: ["Ajwain", "Salt"],
        preparation: "Take 1/2 teaspoon of Carom seeds (Ajwain) and mix it with a small pinch of Salt.",
        usage: "Chew the seeds thoroughly and swallow them with a glass of warm water. This provides quick relief from trapped abdominal gas."
      },
      {
        name: "Ginger-Fennel Digest Tea",
        ingredients: ["Ginger", "Fennel"],
        preparation: "Boil 1/2 teaspoon of Fennel seeds and a thin slice of fresh Ginger in 1 cup of water for 5 minutes. Strain.",
        usage: "Sip the warm tea slowly about 15-20 minutes after your main meals."
      }
    ],
    when_to_use: "Effective for flatulence, abdominal distension, mild abdominal cramps, and feelings of fullness.",
    when_not_to_use: "Do not use in cases of severe abdominal tenderness or if appendicitis is suspected.",
    see_doctor_if: [
      "Bloating is severe and accompanied by persistent vomiting or fever.",
      "You have blood in your stool or severe unexplained diarrhea.",
      "The abdomen is visibly swollen, hard, and painful to touch."
    ]
  },
  {
    ailment: "Indigestion",
    remedies: [
      {
        name: "Ginger-Lemon-Honey Appetite Tonic",
        ingredients: ["Ginger", "Lemon", "Honey"],
        preparation: "Extract 1 teaspoon of fresh Ginger juice. Mix it with 1 teaspoon of fresh Lemon juice and a pinch of Salt. Add 1/2 teaspoon of Honey to balance.",
        usage: "Consume this mixture about 15-20 minutes before a meal to stimulate digestive enzymes and improve appetite."
      },
      {
        name: "Cumin-Ajwain Infusion",
        ingredients: ["Jeera", "Ajwain"],
        preparation: "Boil 1/2 teaspoon of Cumin seeds (Jeera) and 1/2 teaspoon of Carom seeds (Ajwain) in 1.5 cups of water until it reduces to 1 cup. Strain the tea.",
        usage: "Drink this warm infusion 30 minutes after your meals."
      }
    ],
    when_to_use: "Use when experiencing sluggish digestion, heaviness in the stomach, mild nausea after eating, or lack of appetite.",
    when_not_to_use: "Do not use if you have severe gastritis, burning stomach ulcers, or inflammatory bowel diseases.",
    see_doctor_if: [
      "Indigestion is accompanied by sweating, shortness of breath, or jaw pain (which can mimic heart issues).",
      "You cannot keep liquids down.",
      "Symptoms persist for more than a week."
    ]
  },
  {
    ailment: "Dry Cough",
    remedies: [
      {
        name: "Honey-Clove Soothing Paste",
        ingredients: ["Honey", "Clove"],
        preparation: "Lightly roast 2-3 cloves in a pan until puffy. Grind them into a very fine powder. Mix this powder with 1 tablespoon of organic Honey.",
        usage: "Lick and swallow this mixture slowly. Repeat 2-3 times daily to coat the irritated throat tissues and suppress dry coughing."
      },
      {
        name: "Aloe Vera-Honey Elixir",
        ingredients: ["Aloe Vera", "Honey"],
        preparation: "Scoop out 1 tablespoon of fresh Aloe Vera gel from a clean leaf. Mix it thoroughly with 1 teaspoon of Honey.",
        usage: "Ingest this mixture twice a day. The mucilage in aloe vera provides a soothing coat to the throat, easing dry tickling coughs."
      }
    ],
    when_to_use: "Perfect for tickly, non-productive coughs, throat irritation, and nocturnal cough fits.",
    when_not_to_use: "Avoid raw honey in children under 1 year of age. Do not drink water immediately after consuming honey remedies to let them coat the throat.",
    see_doctor_if: [
      "The cough lasts longer than 2 weeks.",
      "You start coughing up blood or rusty-colored sputum.",
      "The cough is accompanied by a whistling or wheezing sound."
    ]
  },
  {
    ailment: "Wet Cough",
    remedies: [
      {
        name: "Tulsi-Ginger-Pepper Decoction",
        ingredients: ["Tulsi", "Ginger", "Black Pepper", "Honey"],
        preparation: "Boil 8-10 Tulsi leaves, 1 inch of crushed Ginger, and 3-4 crushed Black Peppercorns in 1.5 cups of water for 7-10 minutes. Strain.",
        usage: "Allow to cool to warm, stir in 1 teaspoon of Honey, and drink. Take twice a day to help liquefy and expel mucus."
      },
      {
        name: "Turmeric-Honey Mucus Cleanser",
        ingredients: ["Turmeric", "Honey", "Black Pepper"],
        preparation: "Mix 1/2 teaspoon of Turmeric powder with 1 teaspoon of Honey and a tiny pinch of crushed Black Pepper.",
        usage: "Lick this paste slowly twice a day. The active compounds help reduce bronchial inflammation and ease congestion."
      }
    ],
    when_to_use: "For productive coughs with clear or white mucus, chest congestion, and cold recovery.",
    when_not_to_use: "Do not take honey or hot remedies if you have a high fever. Do not swallow thick phlegm; try to spit it out.",
    see_doctor_if: [
      "The mucus becomes thick, dark yellow, green, or foul-smelling.",
      "You feel chest pain or shortness of breath when coughing.",
      "High fever (above 102°F) is present."
    ]
  },
  {
    ailment: "Nausea",
    remedies: [
      {
        name: "Ginger-Lemon Warm Infusion",
        ingredients: ["Ginger", "Lemon", "Honey"],
        preparation: "Steep 1 teaspoon of freshly grated Ginger in 1 cup of boiling water for 5 minutes. Strain the liquid, then add 1 teaspoon of fresh Lemon juice and 1/2 teaspoon of Honey.",
        usage: "Sip this warm infusion very slowly in small gulps when you feel nauseous."
      },
      {
        name: "Fennel-Ginger Chew",
        ingredients: ["Fennel", "Ginger"],
        preparation: "Mix 1 teaspoon of Fennel seeds with 1/2 teaspoon of tiny, finely chopped fresh Ginger pieces.",
        usage: "Chew this mixture slowly and swallow the juices. Fennel helps relax stomach muscles while ginger directly targets the nausea trigger."
      }
    ],
    when_to_use: "Ideal for mild nausea due to indigestion, motion sickness, or general stomach upset.",
    when_not_to_use: "Do not drink large amounts of water at once as it can trigger vomiting. Do not use ginger if you are taking blood thinners without consulting a doctor.",
    see_doctor_if: [
      "You are unable to keep any fluids down for 24 hours.",
      "Nausea is accompanied by a severe, sudden headache or stiff neck.",
      "You suspect pregnancy (seek professional prenatal care for morning sickness)."
    ]
  },
  {
    ailment: "Hiccups",
    remedies: [
      {
        name: "Slow Honey Swallowing",
        ingredients: ["Honey"],
        preparation: "Keep 1 teaspoon of pure Honey ready.",
        usage: "Take the teaspoon of honey and swallow it very slowly. The thick texture and sweetness stimulate the vagus nerve, which can reset the diaphragm spasm."
      },
      {
        name: "Ginger Chew Relief",
        ingredients: ["Ginger"],
        preparation: "Cut a very thin slice of fresh, clean Ginger.",
        usage: "Place the ginger slice on your tongue and chew it slowly. The sudden warm, pungent taste helps interrupt the hiccup reflex."
      }
    ],
    when_to_use: "For standard, temporary bouts of hiccups.",
    when_not_to_use: "Do not give honey to infants under 1 year of age. Avoid chewing ginger if you have open mouth ulcers.",
    see_doctor_if: [
      "Hiccups last continuously for more than 48 hours.",
      "Hiccups interfere with eating, sleeping, or breathing."
    ]
  },
  {
    ailment: "Mouth Ulcers",
    remedies: [
      {
        name: "Cooling Aloe Vera Swab",
        ingredients: ["Aloe Vera"],
        preparation: "Extract fresh Aloe Vera gel from a clean leaf. Keep it cold by placing it in the refrigerator for 10 minutes.",
        usage: "Apply a small dab of the cold aloe vera gel directly to the mouth ulcer using a clean finger. Let it rest for 10 minutes, then rinse. Repeat 3-4 times a day."
      },
      {
        name: "Coconut Oil-Turmeric Paste",
        ingredients: ["Coconut Oil", "Turmeric"],
        preparation: "Mix 1/2 teaspoon of cold-pressed Coconut Oil with a small pinch of Turmeric powder to make a paste.",
        usage: "Dab this paste gently onto the ulcer. Let it remain for 5-10 minutes (do not swallow if possible), then spit and rinse with cool water."
      }
    ],
    when_to_use: "For painful canker sores, accidental cheek bites, and minor gum irritation.",
    when_not_to_use: "Avoid eating hot, spicy, or acidic foods while you have mouth ulcers to prevent burning.",
    see_doctor_if: [
      "The ulcer is extremely large, spreading, or lasts for more than 2 weeks.",
      "You have multiple ulcers accompanied by high fever.",
      "The pain prevents you from drinking enough fluids to stay hydrated."
    ]
  },
  {
    ailment: "Minor Burns",
    remedies: [
      {
        name: "Fresh Aloe Vera Dressing",
        ingredients: ["Aloe Vera"],
        preparation: "Immediately run cool (not ice-cold) tap water over the burn for 5-10 minutes. Then, scoop out fresh gel from a clean Aloe Vera leaf.",
        usage: "Spread the cool aloe vera gel gently over the minor burn. Do not rub. Reapply 2-3 times daily to keep the skin hydrated and assist recovery."
      },
      {
        name: "Coconut Oil-Turmeric Balm",
        ingredients: ["Coconut Oil", "Turmeric"],
        preparation: "Once the burn has cooled completely and the skin is unbroken, mix 1 tablespoon of Coconut Oil with 1/8 teaspoon of Turmeric powder.",
        usage: "Apply this mixture gently to the affected area. The coconut oil moisturizes while turmeric acts as a traditional antiseptic helper."
      }
    ],
    when_to_use: "ONLY for minor, first-degree superficial burns (red skin, no open blisters, small area).",
    when_not_to_use: "NEVER apply remedies to open blisters, charred skin, or deep burns. Never use butter, ice, or toothpaste on burns.",
    see_doctor_if: [
      "The burn blisters extensively or the skin appears white, black, or charred.",
      "The burn is on the face, hands, feet, groin, or over a major joint.",
      "Signs of infection appear (pus, increased redness, throbbing pain)."
    ]
  },
  {
    ailment: "Mosquito Bites",
    remedies: [
      {
        name: "Aloe Vera Soothing Dab",
        ingredients: ["Aloe Vera"],
        preparation: "Extract a small amount of fresh Aloe Vera gel.",
        usage: "Apply directly to the bite site. Let it dry completely. The anti-inflammatory properties of Aloe Vera help calm the itching and reduce swelling."
      },
      {
        name: "Coconut Oil-Pepper Paste",
        ingredients: ["Coconut Oil", "Black Pepper"],
        preparation: "Mix 1 teaspoon of Coconut Oil with a tiny pinch of finely ground Black Pepper powder.",
        usage: "Dab a small amount onto the bite. The coconut oil protects the skin, while black pepper helps reduce the localized allergic itching response."
      }
    ],
    when_to_use: "For localized itching, mild swelling, and redness caused by mosquito or minor bug bites.",
    when_not_to_use: "Do not use if the skin is heavily scratched open, bleeding, or shows signs of secondary bacterial infection.",
    see_doctor_if: [
      "You experience a body rash, joint pain, or high fever days after a bite.",
      "The bite site swells excessively, feels very warm, or starts draining pus."
    ]
  },
  {
    ailment: "Dandruff",
    remedies: [
      {
        name: "Coconut Oil-Lemon Treatment",
        ingredients: ["Coconut Oil", "Lemon"],
        preparation: "Mix 2 tablespoons of warm Coconut Oil with 1 tablespoon of fresh Lemon juice.",
        usage: "Massage this mixture gently into your scalp using your fingertips. Leave it on for 20-30 minutes, then wash your hair with a mild shampoo and warm water. Repeat twice a week."
      },
      {
        name: "Aloe Vera Scalp Mask",
        ingredients: ["Aloe Vera"],
        preparation: "Extract 3-4 tablespoons of fresh Aloe Vera gel. Whisk it with a fork until smooth.",
        usage: "Apply directly to the scalp. Leave it on for 45 minutes to moisturize dry flakes and soothe itching, then rinse off with lukewarm water."
      }
    ],
    when_to_use: "For dry scalp flakes, itching, and mild seborrheic conditions.",
    when_not_to_use: "Do not apply lemon juice if your scalp has open cuts, sores, or severe bleeding scratches, as it will sting intensely.",
    see_doctor_if: [
      "The scalp becomes inflamed, bright red, or starts oozing fluid.",
      "Dandruff persists despite several weeks of home care.",
      "You experience sudden patches of hair loss."
    ]
  },
  {
    ailment: "Dry Skin",
    remedies: [
      {
        name: "Coconut Oil Moisturizer",
        ingredients: ["Coconut Oil"],
        preparation: "Keep virgin Coconut Oil ready. Best used when slightly warm.",
        usage: "Massage a thin layer of coconut oil directly onto damp skin immediately after a bath to lock in moisture. Let it absorb naturally."
      },
      {
        name: "Aloe Vera-Honey Hydrating Mask",
        ingredients: ["Aloe Vera", "Honey"],
        preparation: "Blend 2 tablespoons of fresh Aloe Vera gel with 1 tablespoon of raw Honey until it forms a uniform mix.",
        usage: "Apply to dry skin patches (face, hands, or elbows). Leave it on for 15-20 minutes, then rinse off with warm water and pat dry."
      }
    ],
    when_to_use: "For dry, rough, scaling, or tight skin caused by cold weather, wind, or low humidity.",
    when_not_to_use: "Avoid using heavy oils on acne-prone areas. Discontinue use if you experience redness or breakouts.",
    see_doctor_if: [
      "Skin cracks, bleeds, or shows signs of eczema or severe dermatitis.",
      "Itching is constant and disrupts your sleep."
    ]
  },
  {
    ailment: "Dark Circles",
    remedies: [
      {
        name: "Aloe Vera Under-Eye Massage",
        ingredients: ["Aloe Vera"],
        preparation: "Extract fresh Aloe Vera gel and chill it in the refrigerator for 15 minutes.",
        usage: "Gently dab the cold gel under your eyes. Using your ring finger, massage in soft circular motions for 2-3 minutes before bedtime. Leave it on overnight and wash off in the morning."
      },
      {
        name: "Coconut Oil-Turmeric Brightener",
        ingredients: ["Coconut Oil", "Turmeric"],
        preparation: "Mix 1 teaspoon of warm Coconut Oil with a tiny pinch of Turmeric powder.",
        usage: "Apply carefully under the eyes, ensuring none gets into the eyes. Leave it on for 10-15 minutes, then gently wipe away with a damp cotton ball. Repeat daily."
      }
    ],
    when_to_use: "To reduce hyperpigmentation, puffiness, and fatigue lines around the eyes.",
    when_not_to_use: "Do not apply if you have an active eye infection. Wash off immediately if any gets inside the eyes.",
    see_doctor_if: [
      "The discoloration is only under one eye and is accompanied by pain or swelling.",
      "Puffiness is severe, permanent, and accompanied by swelling in other parts of the body."
    ]
  },
  {
    ailment: "Minor Joint Pain",
    remedies: [
      {
        name: "Turmeric-Ginger Poultice Paste",
        ingredients: ["Turmeric", "Ginger", "Coconut Oil"],
        preparation: "Mix 1 tablespoon of Turmeric powder, 1 tablespoon of Ginger powder (dry ginger), and enough warm Coconut Oil to create a thick paste.",
        usage: "Apply this warm paste directly to the painful joint. Wrap it loosely with a clean cotton bandage to retain heat and prevent staining. Leave it on for 30-40 minutes, then wash off with warm water."
      },
      {
        name: "Warm Coconut-Clove Massage Oil",
        ingredients: ["Coconut Oil", "Clove"],
        preparation: "Heat 3 tablespoons of Coconut Oil with 4-5 lightly crushed Cloves for 2 minutes. Let it cool until it is comfortably warm, then strain out the cloves.",
        usage: "Massage the warm oil gently onto the sore joint for 10-15 minutes. Keep the joint covered with warm clothing afterwards."
      }
    ],
    when_to_use: "Good for mild aches, stiffness due to cold weather, or fatigue after physical exertion.",
    when_not_to_use: "Do not apply hot oil or massage aggressively if the joint is red, hot, swollen, or actively inflamed (which suggests acute arthritis or gout).",
    see_doctor_if: [
      "The joint is swollen, red, hot, or deformed.",
      "You cannot bear weight on the joint.",
      "Pain is accompanied by fever."
    ]
  },
  {
    ailment: "Mild Constipation",
    remedies: [
      {
        name: "Warm Lemon-Salt Water",
        ingredients: ["Lemon", "Salt"],
        preparation: "Squeeze the juice of 1/2 Lemon into 1 glass of warm water. Add 1/2 teaspoon of Salt and stir.",
        usage: "Drink this warm mixture on an empty stomach first thing in the morning to stimulate bowel movements."
      },
      {
        name: "Fennel-Cumin Digestive Tea",
        ingredients: ["Fennel", "Jeera"],
        preparation: "Boil 1 teaspoon of Fennel seeds and 1/2 teaspoon of Cumin seeds in 2 cups of water for 5 minutes. Strain.",
        usage: "Drink this warm infusion after dinner, about 30 minutes before going to sleep. This helps relax the GI tract."
      }
    ],
    when_to_use: "For occasional difficulty passing stools or irregular bowel movements.",
    when_not_to_use: "Do not use if constipation is accompanied by severe abdominal pain, vomiting, or if you have chronic bowel obstructions.",
    see_doctor_if: [
      "Constipation lasts for more than a week.",
      "You experience severe pain or see blood in your stool.",
      "You experience sudden unexplained weight loss."
    ]
  },
  {
    ailment: "Chapped Lips",
    remedies: [
      {
        name: "Pure Coconut Oil Balm",
        ingredients: ["Coconut Oil"],
        preparation: "Keep organic, cold-pressed Coconut Oil at hand.",
        usage: "Dab a small drop of coconut oil on your lips multiple times a day, especially after eating and before sleeping, to form a natural protective barrier."
      },
      {
        name: "Aloe Vera-Honey Lip Treatment",
        ingredients: ["Aloe Vera", "Honey"],
        preparation: "Mix 1/2 teaspoon of fresh Aloe Vera gel with 1/2 teaspoon of Honey.",
        usage: "Apply this mixture onto your chapped lips. Leave it on for 15 minutes, then wipe it off with a soft damp cloth, or apply before bedtime and leave overnight."
      }
    ],
    when_to_use: "For dry, cracked, peeling, or wind-burned lips.",
    when_not_to_use: "Do not pick or peel dry skin from the lips, as this causes bleeding and delays healing.",
    see_doctor_if: [
      "The lips are bleeding excessively, show deep painful cracks, or fail to heal.",
      "You notice sores or yellow crusting around the lips (signs of infection)."
    ]
  },
  {
    ailment: "Mild Seasonal Congestion",
    remedies: [
      {
        name: "Ginger-Turmeric Steam Inhalation",
        ingredients: ["Ginger", "Turmeric"],
        preparation: "Boil 4-5 cups of water in a large pot. Add 1 tablespoon of crushed fresh Ginger and 1 teaspoon of Turmeric powder.",
        usage: "Carefully place the pot on a heat-safe table. Lean over the pot with a towel draped over your head to trap the steam. Inhale the warm steam deeply through your nose for 5-10 minutes. Keep eyes closed."
      },
      {
        name: "Tulsi-Ginger-Clove Infusion",
        ingredients: ["Tulsi", "Ginger", "Clove", "Honey"],
        preparation: "Boil 8-10 Tulsi leaves, 1 inch of sliced Ginger, and 2 Cloves in 1.5 cups of water for 5 minutes. Strain.",
        usage: "Stir in 1 teaspoon of Honey once warm. Drink twice a day to help open nasal passages."
      }
    ],
    when_to_use: "For stuffy nose, sinus pressure, and mild seasonal allergies.",
    when_not_to_use: "Use extreme caution during steam inhalation to avoid accidental spills and facial burns. Keep children away from hot water steam.",
    see_doctor_if: [
      "Congestion is accompanied by a severe forehead headache or facial pain.",
      "You have high fever or thick nasal discharge that is blood-streaked.",
      "You develop difficulty breathing or asthma-like wheezing."
    ]
  },
  {
    ailment: "Mild Sunburn",
    remedies: [
      {
        name: "Aloe Vera Cooling Gel Application",
        ingredients: ["Aloe Vera"],
        preparation: "Scoop out fresh Aloe Vera gel from a clean leaf. Place it in the refrigerator for 10-15 minutes to chill.",
        usage: "Apply the cool gel gently over the sunburned skin. Let it air dry. Reapply 3-4 times daily for relief."
      },
      {
        name: "Coconut Oil & Aloe Soothing Blend",
        ingredients: ["Coconut Oil", "Aloe Vera"],
        preparation: "Mix 1 tablespoon of cold-pressed Coconut Oil with 1 tablespoon of fresh Aloe Vera gel until smooth.",
        usage: "Gently apply the blend to the sun-exposed dry skin areas to restore moisture and soothe irritation."
      }
    ],
    when_to_use: "Best used for mild redness, warmth, and dryness of the skin after sun exposure.",
    when_not_to_use: "Do not use on severe sunburns with blistering, bleeding, or open skin.",
    see_doctor_if: [
      "Chills, fever, or dizziness occurs.",
      "Sunburn covers a large portion of the body with severe blistering.",
      "Signs of skin infection appear (pus, red streaks)."
    ]
  },
  {
    ailment: "Heat Rash",
    remedies: [
      {
        name: "Aloe Vera Rash Swab",
        ingredients: ["Aloe Vera"],
        preparation: "Extract fresh Aloe Vera gel from a clean leaf. Keep it cool.",
        usage: "Dab the cool gel gently onto the itchy rash spots. Let it dry naturally. Rinse off with cool water after 20 minutes."
      },
      {
        name: "Coconut Oil & Turmeric Calm Paste",
        ingredients: ["Coconut Oil", "Turmeric"],
        preparation: "Mix 1 tablespoon of Coconut Oil with 1/8 teaspoon of Turmeric powder to form a light, smooth paste.",
        usage: "Dab gently onto the rash area. Wash off with cool water after 15 minutes. Note: Turmeric may stain clothing."
      }
    ],
    when_to_use: "For small, itchy red bumps on skin folds or areas covered by tight clothing in hot weather.",
    when_not_to_use: "Do not use heavy oils if the rash is actively sweating or if the skin feels extremely hot. Avoid thick layers.",
    see_doctor_if: [
      "The rash does not improve after 3 days.",
      "The bumps start oozing pus or swelling increases.",
      "Fever or swollen lymph nodes develop."
    ]
  },
  {
    ailment: "Mild Dehydration",
    remedies: [
      {
        name: "Lemon-Honey-Salt Hydrator",
        ingredients: ["Lemon", "Honey", "Salt"],
        preparation: "Squeeze 1/2 fresh Lemon into 1 glass of warm water. Add 1 teaspoon of Honey and a tiny pinch of Salt. Stir well.",
        usage: "Sip this mixture slowly to help replenish electrolytes and fluids after mild dehydration."
      },
      {
        name: "Fennel-Cumin Saline Water",
        ingredients: ["Fennel", "Jeera", "Salt"],
        preparation: "Boil 1/2 teaspoon of Fennel seeds and 1/2 teaspoon of Cumin seeds in 2 cups of water for 5 minutes. Cool, strain, and add a pinch of Salt.",
        usage: "Sip warm or at room temperature throughout the day."
      }
    ],
    when_to_use: "For mild thirst, dry mouth, and fatigue due to heat or physical activity.",
    when_not_to_use: "Do not use if the person is unable to swallow or is vomiting continuously.",
    see_doctor_if: [
      "Extreme lethargy, confusion, or dark-colored urine persists.",
      "No urination occurs for more than 8 hours.",
      "Dizziness occurs when standing up."
    ]
  },
  {
    ailment: "Motion Sickness",
    remedies: [
      {
        name: "Ginger-Lemon Travel Infusion",
        ingredients: ["Ginger", "Lemon", "Honey"],
        preparation: "Boil 3-4 thin slices of fresh Ginger in 1 cup of water for 5 minutes. Add 1 teaspoon of Lemon juice and a drop of Honey.",
        usage: "Drink this warm infusion 30 minutes before starting your journey, or sip slowly when feeling nauseous."
      },
      {
        name: "Fennel Seed Chew",
        ingredients: ["Fennel"],
        preparation: "Keep a small bag of Fennel seeds ready.",
        usage: "Slowly chew 1 teaspoon of Fennel seeds during travel to settle the stomach."
      }
    ],
    when_to_use: "For dizziness, mild nausea, and stomach discomfort during car, boat, or plane travel.",
    when_not_to_use: "Avoid heavy, oily meals before or during travel.",
    see_doctor_if: [
      "Vomiting becomes severe and uncontrollable.",
      "Dizziness persists long after travel ends."
    ]
  },
  {
    ailment: "Mild Stress",
    remedies: [
      {
        name: "Tulsi-Ginger Calming Tea",
        ingredients: ["Tulsi", "Ginger", "Honey"],
        preparation: "Boil 6-8 fresh Tulsi leaves and 1/2 inch of grated Ginger in 1 cup of water for 5 minutes. Strain.",
        usage: "Add 1 teaspoon of Honey and sip warm. Drink once or twice a day to calm the mind."
      },
      {
        name: "Fennel-Jeera Infusion",
        ingredients: ["Fennel", "Jeera"],
        preparation: "Boil 1/2 teaspoon of Fennel seeds and 1/2 teaspoon of Cumin seeds in 1.5 cups of water. Strain.",
        usage: "Sip warm in the evening. It helps soothe nervous digestion associated with stress."
      }
    ],
    when_to_use: "For mild anxiety, restlessness, and mental fatigue.",
    when_not_to_use: "Do not consume hot spices or black pepper if you have stress-induced acid reflux.",
    see_doctor_if: [
      "Stress is constant, debilitating, and leads to panic attacks.",
      "You experience severe chest tightness or difficulty breathing."
    ]
  },
  {
    ailment: "Occasional Sleep Difficulty",
    remedies: [
      {
        name: "Tulsi-Honey Night Infusion",
        ingredients: ["Tulsi", "Honey"],
        preparation: "Steep 5 fresh Tulsi leaves in a cup of hot water for 5 minutes. Strain and add 1 teaspoon of Honey.",
        usage: "Sip slowly 30 minutes before bedtime to relax the mind."
      },
      {
        name: "Coconut Oil Foot Massage (Padabhyanga)",
        ingredients: ["Coconut Oil"],
        preparation: "Warm 1 tablespoon of Coconut Oil between your palms.",
        usage: "Massage the warm oil onto the soles of both feet in firm, circular strokes for 5-10 minutes before sleeping. Put on clean socks to prevent staining."
      }
    ],
    when_to_use: "For occasional trouble falling asleep due to an overactive mind or travel.",
    when_not_to_use: "Do not massage feet if you have open wounds, active skin infections, or a high fever.",
    see_doctor_if: [
      "Insomnia persists for more than 2-3 weeks.",
      "Lack of sleep interferes with daily safety and performance."
    ]
  },
  {
    ailment: "Tired Eyes from Screen Time",
    remedies: [
      {
        name: "Cool Aloe Vera Compress",
        ingredients: ["Aloe Vera"],
        preparation: "Squeeze fresh Aloe Vera gel onto two cotton pads. Chill the pads in the freezer for 5 minutes.",
        usage: "Close your eyes and place the chilled aloe pads over your eyelids. Relax for 10-15 minutes."
      },
      {
        name: "Coconut Oil Temple Massage",
        ingredients: ["Coconut Oil"],
        preparation: "Keep a few drops of Coconut Oil ready.",
        usage: "Gently dab oil onto the temples and around the orbital bone (avoiding direct eye contact) and massage in light circular motions before sleeping."
      }
    ],
    when_to_use: "For dry, burning, or strained eyes after long hours of screen work.",
    when_not_to_use: "Do not put coconut oil, aloe vera, or any substance directly inside the eye.",
    see_doctor_if: [
      "You experience sudden changes in vision or blurred vision.",
      "You have severe eye pain, redness, or discharge."
    ]
  },
  {
    ailment: "Foot Odor",
    remedies: [
      {
        name: "Salt & Lemon Foot Soak",
        ingredients: ["Salt", "Lemon"],
        preparation: "Fill a small tub with warm water. Add 2 tablespoons of Salt and the juice of 1 whole Lemon.",
        usage: "Soak your feet for 15-20 minutes. Pat dry thoroughly, especially between the toes."
      },
      {
        name: "Coconut-Clove Foot Rub",
        ingredients: ["Coconut Oil", "Clove"],
        preparation: "Warm 2 tablespoons of Coconut Oil with 3 crushed Cloves for 1-2 minutes. Let it cool until warm, then strain out the cloves.",
        usage: "Massage the warm, aromatic oil onto your clean, dry feet before bedtime."
      }
    ],
    when_to_use: "For foot perspiration and mild bad odors.",
    when_not_to_use: "Do not use lemon juice if your feet have open cuts, deep cracks, or active fungal blisters, as it will sting.",
    see_doctor_if: [
      "Foot odor is persistent despite good hygiene and signs of fungal infection (peeling, itching) develop.",
      "You have diabetes and notice any foot issues."
    ]
  },
  {
    ailment: "Cracked Heels",
    remedies: [
      {
        name: "Coconut Oil Heel Wrap",
        ingredients: ["Coconut Oil"],
        preparation: "Keep 1-2 tablespoons of cold-pressed Coconut Oil ready.",
        usage: "Soak feet in warm water for 10 minutes, dry completely, and apply a thick layer of coconut oil. Put on clean cotton socks and leave overnight."
      },
      {
        name: "Aloe-Turmeric Heel Balm",
        ingredients: ["Aloe Vera", "Turmeric"],
        preparation: "Mix 1 tablespoon of fresh Aloe Vera gel with 1/4 teaspoon of Turmeric powder.",
        usage: "Apply to cracked areas. Leave on for 30 minutes, then rinse with warm water. Repeat daily."
      }
    ],
    when_to_use: "For dry, rough, and minor peeling skin on the heels.",
    when_not_to_use: "Do not use turmeric-aloe on bleeding or deep, painful cracks without consulting a doctor.",
    see_doctor_if: [
      "Cracks are very deep, painful, and start bleeding.",
      "Signs of bacterial infection (pus, warmth, redness) are present."
    ]
  },
  {
    ailment: "Mild Itchy Scalp",
    remedies: [
      {
        name: "Aloe Vera Scalp Mask",
        ingredients: ["Aloe Vera"],
        preparation: "Extract 3 tablespoons of fresh Aloe Vera gel.",
        usage: "Apply directly to the itchy areas of the scalp. Massage gently and leave on for 30 minutes before washing off with lukewarm water."
      },
      {
        name: "Coconut-Lemon Scalp Treatment",
        ingredients: ["Coconut Oil", "Lemon"],
        preparation: "Mix 2 tablespoons of warm Coconut Oil with 1 teaspoon of fresh Lemon juice.",
        usage: "Massage into the scalp, let it sit for 20 minutes, then shampoo with a mild cleanser."
      }
    ],
    when_to_use: "For dry, itchy, or irritated scalp without severe sores.",
    when_not_to_use: "Do not apply lemon juice to an open, scratched scalp, as it will cause stinging.",
    see_doctor_if: [
      "Itching is accompanied by severe hair loss or red, scaly patches (psoriasis/eczema).",
      "Scalp shows signs of infection like pus or swelling."
    ]
  },
  {
    ailment: "Mild Seasonal Dry Nose",
    remedies: [
      {
        name: "Coconut Oil Nasal Lubrication",
        ingredients: ["Coconut Oil"],
        preparation: "Warm a few drops of Coconut Oil until liquid.",
        usage: "Using a clean fingertip or cotton swab, gently apply 1-2 drops of coconut oil to the inner walls of the nostrils. Avoid deep insertion."
      },
      {
        name: "Aloe Vera Nasal Swab",
        ingredients: ["Aloe Vera"],
        preparation: "Use fresh, clean Aloe Vera gel.",
        usage: "Gently apply a thin layer of aloe vera gel inside the nostril entrance to soothe dryness."
      }
    ],
    when_to_use: "For dry nasal passages due to dry winter weather or air conditioning.",
    when_not_to_use: "Do not inhale large amounts of oils into the nose. Keep applications very light and superficial.",
    see_doctor_if: [
      "Frequent nosebleeds occur.",
      "Dryness is accompanied by severe nasal pain, crusting, or breathing difficulty."
    ]
  },
  {
    ailment: "Mild Hand Dryness",
    remedies: [
      {
        name: "Coconut Oil Hand Mask",
        ingredients: ["Coconut Oil"],
        preparation: "Keep virgin Coconut Oil ready.",
        usage: "Massage a generous amount of coconut oil into your hands and nails before sleep. Wear soft cotton gloves overnight to lock in moisture."
      },
      {
        name: "Aloe-Honey Hand Rub",
        ingredients: ["Aloe Vera", "Honey"],
        preparation: "Mix 1 tablespoon of Aloe Vera gel with 1 teaspoon of Honey.",
        usage: "Rub onto dry hands, let it sit for 15 minutes, then rinse with warm water and pat dry."
      }
    ],
    when_to_use: "For dry, rough hands caused by frequent washing or cold weather.",
    when_not_to_use: "Avoid using honey if you have open cuts on your hands that could attract dirt.",
    see_doctor_if: [
      "Hands develop deep, painful cracks that bleed.",
      "Skin shows signs of contact dermatitis or severe eczema."
    ]
  },
  {
    ailment: "Mild Muscle Soreness After Exercise",
    remedies: [
      {
        name: "Warm Clove-Coconut Oil Rub",
        ingredients: ["Coconut Oil", "Clove"],
        preparation: "Warm 3 tablespoons of Coconut Oil with 5 crushed Cloves for 2 minutes. Let it cool to a comfortable warm temperature. Strain.",
        usage: "Gently massage the warm oil onto the sore muscles to relieve tension."
      },
      {
        name: "Turmeric-Ginger Muscle Paste",
        ingredients: ["Turmeric", "Ginger", "Coconut Oil"],
        preparation: "Mix 1 teaspoon of Turmeric, 1 teaspoon of Ginger powder, and enough warm Coconut Oil to make a paste.",
        usage: "Apply to the sore muscle area, leave for 20-30 minutes, then wash off with warm water. Protect clothing from turmeric stains."
      }
    ],
    when_to_use: "For minor muscle aches and stiffness 24-48 hours after exercise.",
    when_not_to_use: "Do not massage joints or muscles that are red, hot, swollen, or suggest a sprain or tear.",
    see_doctor_if: [
      "Pain is severe and limits joint mobility.",
      "The muscle soreness does not decrease after 7 days."
    ]
  },
  {
    ailment: "Mild Menstrual Cramps",
    remedies: [
      {
        name: "Ajwain-Ginger Warm Infusion",
        ingredients: ["Ajwain", "Ginger", "Honey"],
        preparation: "Boil 1/2 teaspoon of Carom seeds (Ajwain) and a 1/2-inch slice of Ginger in 1.5 cups of water for 5 minutes. Strain.",
        usage: "Mix in 1 teaspoon of Honey and drink warm. Take twice a day during the first two days of your cycle."
      },
      {
        name: "Jeera-Fennel Pain Relief Tea",
        ingredients: ["Jeera", "Fennel", "Honey"],
        preparation: "Boil 1/2 teaspoon of Cumin seeds and 1/2 teaspoon of Fennel seeds in 1 cup of water for 5 minutes. Strain.",
        usage: "Drink warm 2-3 times daily. Cumin helps relax spasm muscles."
      }
    ],
    when_to_use: "For mild, dull pelvic cramping and bloating during menstrual periods.",
    when_not_to_use: "Do not consume excessive amounts of hot spices if you have heavy bleeding or gastritis.",
    see_doctor_if: [
      "Cramps are sudden, severe, and debilitating.",
      "Pain is accompanied by heavy bleeding, fever, or vomiting."
    ]
  },
  {
    ailment: "Mild Travel Fatigue",
    remedies: [
      {
        name: "Tulsi-Ginger Energizer Tea",
        ingredients: ["Tulsi", "Ginger", "Black Pepper", "Honey"],
        preparation: "Boil 6-8 Tulsi leaves, 1/2 inch of Ginger, and 2 crushed Black Peppercorns in 1 cup of water for 5 minutes. Strain.",
        usage: "Stir in 1 teaspoon of Honey and drink warm to revitalize your energy and boost immunity after travel."
      },
      {
        name: "Lemon-Honey Warm Energizer",
        ingredients: ["Lemon", "Honey", "Salt"],
        preparation: "Add the juice of 1/2 Lemon, 1 teaspoon of Honey, and a pinch of Salt to a glass of warm water. Stir well.",
        usage: "Drink immediately after long flights or road trips to restore hydration and vitality."
      }
    ],
    when_to_use: "For jet lag, body fatigue, and general exhaustion after long journeys.",
    when_not_to_use: "Do not drink too close to bedtime if ginger makes you overly alert.",
    see_doctor_if: [
      "Extreme exhaustion persists for more than 4-5 days.",
      "Fatigue is accompanied by high fever or respiratory symptoms."
    ]
  },
  {
    ailment: "Mild Bad Breath",
    remedies: [
      {
        name: "Fennel Seed Cleanse",
        ingredients: ["Fennel"],
        preparation: "Keep Fennel seeds handy.",
        usage: "Slowly chew 1 teaspoon of Fennel seeds after meals. Fennel neutralizes odors and stimulates saliva production."
      },
      {
        name: "Clove-Salt Warm Mouthwash",
        ingredients: ["Clove", "Salt"],
        preparation: "Boil 3-4 Cloves in 1 cup of water for 5 minutes. Let it cool to lukewarm, strain, and add a pinch of Salt.",
        usage: "Use this water to rinse your mouth and gargle. Repeat twice daily to control oral bacteria."
      }
    ],
    when_to_use: "For dry mouth, post-meal bad breath, and general oral freshness.",
    when_not_to_use: "Do not swallow the clove gargle water. Do not chew cloves if you have fresh mouth ulcers.",
    see_doctor_if: [
      "Bad breath is chronic and persists despite thorough brushing and flossing.",
      "It is accompanied by bleeding gums or loose teeth."
    ]
  },
  {
    ailment: "Mild Hoarseness of Voice",
    remedies: [
      {
        name: "Ginger-Honey Voice Syrup",
        ingredients: ["Ginger", "Honey"],
        preparation: "Grate fresh Ginger and squeeze out 1 teaspoon of juice. Mix it with 1 tablespoon of organic Honey.",
        usage: "Lick and swallow this mixture slowly to coat the vocal cords. Take twice daily."
      },
      {
        name: "Salt-Turmeric Throat Gargle",
        ingredients: ["Salt", "Turmeric"],
        preparation: "Mix 1/2 teaspoon of Salt and 1/2 teaspoon of Turmeric in 1 glass of warm water.",
        usage: "Gargle for 30-40 seconds, then spit it out. Repeat 3 times a day."
      }
    ],
    when_to_use: "For voice strain from talking/singing or mild vocal cord irritation from a cold.",
    when_not_to_use: "Do not whisper, as it strains the vocal cords more than normal speech. Rest your voice.",
    see_doctor_if: [
      "Hoarseness lasts for more than 2 weeks.",
      "It is accompanied by difficulty breathing or swallowing."
    ]
  },
  {
    ailment: "Mild Neck Stiffness",
    remedies: [
      {
        name: "Warm Clove-Coconut Oil Massage",
        ingredients: ["Coconut Oil", "Clove"],
        preparation: "Heat 2 tablespoons of Coconut Oil with 4 crushed Cloves. Let it cool until warm, then strain.",
        usage: "Gently massage the warm oil onto the back of your neck in downward strokes for 10 minutes."
      },
      {
        name: "Ginger-Turmeric Warm Compress",
        ingredients: ["Ginger", "Turmeric", "Salt"],
        preparation: "Boil 1 tablespoon of grated Ginger, 1/2 teaspoon of Turmeric, and 1 teaspoon of Salt in 3 cups of water. Strain.",
        usage: "Soak a clean washcloth in the warm liquid, wring out excess water, and apply the warm compress to your neck for 15 minutes."
      }
    ],
    when_to_use: "For neck muscle tension due to poor sleeping posture or long hours at a desk.",
    when_not_to_use: "Do not massage if you experience sharp shooting pain, numbness, or tingling in your arms.",
    see_doctor_if: [
      "Neck stiffness is accompanied by a severe headache and high fever (possible meningitis).",
      "Stiffness is caused by a recent fall or neck injury."
    ]
  },
  {
    ailment: "Mild Leg Cramps",
    remedies: [
      {
        name: "Warm Salt Bath Soak",
        ingredients: ["Salt"],
        preparation: "Fill a basin with warm water and dissolve 3 tablespoons of Salt.",
        usage: "Soak your feet and lower legs for 15-20 minutes to relax leg muscles."
      },
      {
        name: "Coconut Oil Calving Rub",
        ingredients: ["Coconut Oil"],
        preparation: "Warm 1 tablespoon of Coconut Oil.",
        usage: "Gently massage the warm oil onto your calves in upward motions, stretching the muscle gently if a cramp occurs."
      }
    ],
    when_to_use: "For occasional night-time calf cramps or muscle spasms after walking.",
    when_not_to_use: "Do not massage the area if you suspect a deep vein clot (symptoms: calf is red, swollen, warm, and highly tender).",
    see_doctor_if: [
      "Cramps are frequent, severe, and disrupt sleep every night.",
      "You notice visible leg swelling, redness, or heat."
    ]
  },
  {
    ailment: "Mild Loss of Appetite",
    remedies: [
      {
        name: "Ginger-Lemon Appetite Trigger",
        ingredients: ["Ginger", "Lemon", "Salt"],
        preparation: "Slice a thin piece of fresh Ginger. Sprinkle a pinch of Salt and a few drops of Lemon juice on it.",
        usage: "Chew this ginger piece slowly about 15-20 minutes before your main meals to stimulate salivary glands and digestive enzymes."
      },
      {
        name: "Jeera-Fennel Infusion",
        ingredients: ["Jeera", "Fennel"],
        preparation: "Boil 1/2 teaspoon of Cumin seeds and 1/2 teaspoon of Fennel seeds in 1.5 cups of water for 5 minutes. Strain.",
        usage: "Drink warm 30 minutes before lunch or dinner."
      }
    ],
    when_to_use: "For temporary lack of appetite due to sluggish digestion, weather changes, or mild fatigue.",
    when_not_to_use: "Do not consume hot spices if you have active burning ulcers in the stomach.",
    see_doctor_if: [
      "Loss of appetite is prolonged (lasts more than a week) and leads to unexplained weight loss.",
      "It is accompanied by persistent nausea, vomiting, or jaundice."
    ]
  }
];
