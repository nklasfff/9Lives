// The Twelve Organs — poetic profiles in the same register as meridians.js and wuShen.js.
// Phase 1: Lungs is fully filled out. The other 11 carry a one-line essence so the
// listing page is meaningful; their deep pages render a "depth coming soon" state.

const ORGANS = {
  lung: {
    key: 'lung',
    name: 'Lungs',
    chinese: '肺',
    englishName: 'The Delicate Organ',
    element: 'metal',
    yinYang: 'yin',
    partner: 'largeIntestine',
    spirit: 'po',
    organClockTime: '03:00–05:00',
    emotion: { balanced: 'Acceptance', imbalanced: 'Grief' },
    domain: ['breath', 'boundary', 'release', 'instinct', 'dignity'],
    essence:
      'The body\'s first point of contact with the outside world — they take in what\'s needed and release what\'s finished.',
    description:
      'The Lungs sit close to the surface of the body, which makes them especially vulnerable to whatever enters through the air — cold, dryness, smoke, infection, and unprocessed grief. Classical Chinese medicine calls them the Delicate Organ for this reason. The Lungs draw fresh Qi from the air and combine it with food Qi from the Spleen to produce the energy that powers the body\'s daily work. They are also the home of the Po, the body-soul that arrives with the first breath and departs with the last, which is why the Lungs govern instinct, the senses, and the intelligence of the skin. When the Lungs are strong, breathing is easy, the skin meets the world without bracing, and you can release things once they are finished. When the Lungs are weak, breathing is shallow, the chest stays tight, and grief stays lodged in the body.',
    balanced:
      'Easy, full breathing that reaches the belly. Skin that meets the weather without bracing. The capacity to grieve and move on. A quiet dignity — nothing to prove, nothing to protect.',
    blocked:
      'Shallow breathing that stays high in the chest. Skin that\'s reactive, dry, or armored. Grief that has settled in and stopped moving — not painful, exactly, but always present. Holding on to people, roles, and old versions of yourself long after they should have ended. A sense of standing slightly behind glass — in the room, but not fully in it.',
    themes: [
      {
        title: 'Breath as Meeting Place',
        body: 'Every breath you take is a small act of trust — trust that the air will be there, trust that your body will know what to do with it. When the Lungs are at ease, the breath drops into the belly without you having to think about it. When the Lungs are guarded, the breath stays high and shallow, the chest stays clenched, and the body stays braced against something it no longer expects to be safe. Releasing the chest isn\'t really about stretching. It\'s about letting yourself breathe again.',
      },
      {
        title: 'The Skin Boundary',
        body: 'The Lungs govern the skin and the Wei Qi just beneath it — the layer that decides what gets in and what stays out. When this layer is healthy, you can spend time in difficult places without absorbing them. When it weakens, the skin becomes reactive, the mood becomes weather-sensitive, and being around other people begins to cost more than it gives back.',
      },
      {
        title: 'Grief That Has Found Its Way',
        body: 'Grief is the emotion of Metal, and it lives in the Lungs. Grief that\'s allowed to move through you becomes refinement — a clearer sense of what really matters. Grief that can\'t move turns into something else: tightness in the chest, a held breath, a flat greyness that isn\'t quite depression but isn\'t quite life either. When the tears finally come, that\'s the Lungs starting to breathe again.',
      },
      {
        title: 'The Po — The Body That Knows',
        body: 'The Lungs are the home of the Po, the body-soul that arrives with the first breath and leaves with the last. The Po is precise and instinctive — it knows, before you think, what\'s safe and what isn\'t, what to draw closer and what to set down. When you listen to it, you get clean boundaries that don\'t need explaining. When you ignore it long enough, it goes quiet, and you stop being able to tell the difference between what you actually want and what you think you should want.',
      },
      {
        title: 'Letting Go',
        body: 'Whatever the Large Intestine releases physically, the Lungs release at the level of breath, identity, and attachment. A relationship that\'s over. A role you\'ve outgrown. A version of yourself that no longer fits. The Lungs are the organ of completion, and what\'s hardest to let go of is rarely what was bad — it\'s what was good and is now over.',
      },
      {
        title: 'Voice and Autumn',
        body: 'The voice rides on the breath. Strong Lungs give you a voice that lands easily; weak Lungs give you a voice that thins out, runs dry, or hesitates before it starts. The Lungs grow stronger in autumn — cooler air, slower mornings, time to look back over what the year has been. They struggle in places that never let anything slow down: constant brightness, constant urgency, no room to be quiet.',
      },
    ],
    lifeQuestions: [
      'What\'s over in your life that you still haven\'t let go of?',
      'Where does your breath go when you\'re afraid?',
      'What grief have you been trying to solve instead of feel?',
    ],
  },

  largeIntestine: {
    key: 'largeIntestine',
    name: 'Large Intestine',
    chinese: '大腸',
    englishName: 'The Drainer',
    element: 'metal',
    yinYang: 'yang',
    partner: 'lung',
    spirit: 'po',
    organClockTime: '05:00–07:00',
    emotion: { balanced: 'Acceptance', imbalanced: 'Grief' },
    domain: ['release', 'completion', 'discernment'],
    essence:
      'Releases what is no longer needed — the organ of completion, of allowing the finished to actually be finished.',
  },

  stomach: {
    key: 'stomach',
    name: 'Stomach',
    chinese: '胃',
    englishName: 'The Receiver',
    element: 'earth',
    yinYang: 'yang',
    partner: 'spleen',
    spirit: 'yi',
    organClockTime: '07:00–09:00',
    emotion: { balanced: 'Care', imbalanced: 'Worry' },
    domain: ['reception', 'appetite', 'breaking down'],
    essence:
      'Receives and breaks down what arrives — the organ of appetite, hospitality, and the body\'s relationship to what is offered.',
  },

  spleen: {
    key: 'spleen',
    name: 'Spleen',
    chinese: '脾',
    englishName: 'The Granary',
    element: 'earth',
    yinYang: 'yin',
    partner: 'stomach',
    spirit: 'yi',
    organClockTime: '09:00–11:00',
    emotion: { balanced: 'Care', imbalanced: 'Worry' },
    domain: ['transformation', 'thought', 'nourishment'],
    essence:
      'Transforms food and experience into useable substance — the organ of nourishment, thought, and the capacity to digest a life.',
  },

  heart: {
    key: 'heart',
    name: 'Heart',
    chinese: '心',
    englishName: 'The Sovereign',
    element: 'fire',
    yinYang: 'yin',
    partner: 'smallIntestine',
    spirit: 'shen',
    organClockTime: '11:00–13:00',
    emotion: { balanced: 'Joy', imbalanced: 'Restlessness' },
    domain: ['consciousness', 'presence', 'joy', 'connection'],
    essence:
      'The seat of consciousness — the organ of joy, presence, and the inner light you recognize in another person\'s eyes.',
    description:
      'The classical texts call the Heart the Sovereign — the emperor of the body, whose condition radiates out to every other organ. It governs the blood and its circulation, but at a deeper level it governs Shen: consciousness, presence, the inner light that lets you be genuinely with another person and with yourself. When Shen is settled in the Heart, thinking is clear, sleep is deep, joy comes without effort, and the people who matter to you can feel that you are actually there with them. When the Heart is overworked or neglected, Shen grows restless — sleep turns shallow, joy hollows out, and someone who has loved deeply can end up watching their own life from a distance. Most of what we call inner peace is, in classical terms, Shen settled in the Heart.',
    balanced:
      'A felt sense of presence — being where you are, with whoever is there, without having to work at it. Sleep that is deep and unbroken. Speech that lands easily, eyes that meet other eyes without anxiety. Joy that arrives in small, ordinary moments and doesn\'t need to be performed. The capacity to love someone without losing yourself in the process.',
    blocked:
      'Insomnia, or sleep that\'s shallow and broken by dreams. A racing mind that won\'t settle, especially in the hours after midday. Restless joy — laughter that doesn\'t quite reach the eyes, social warmth that costs more than it gives. A heart that has armored itself with cleverness or distance because being fully present has come to feel unsafe. The feeling of watching your own life from behind glass.',
    themes: [
      {
        title: 'The Sovereign — Shen and Presence',
        body: 'The Heart is the seat of Shen, the spirit of consciousness — the felt presence that other people recognize in you before they can put it into words. When Shen is rooted in the Heart, you can be genuinely with another person, and they can feel it. When Shen is disturbed, you can be physically present and emotionally absent at the same time — the body is in the room, but the inner light has gone elsewhere. The Sovereign doesn\'t rule by force; it rules by being fully where it is.',
      },
      {
        title: 'Joy as Resting State',
        body: 'In Five Element thinking, joy isn\'t a feeling that comes and goes — it\'s the natural resting state of a healthy Heart. Quiet joy, not euphoria. The kind that arrives unbidden when you sit with someone you love, or when sunlight catches a wall in a particular way. When the Heart is depleted, this baseline disappears, and joy starts to require effort, performance, or external stimulation. Restlessness is what fills the space where joy used to be.',
      },
      {
        title: 'Blood, Sleep, and the Settled Heart',
        body: 'The Heart governs the Blood, and at night the Blood houses the Shen. A Heart with enough Blood gives you sleep that is deep and restorative — Shen comes home for the night, and you wake up as a self that\'s intact. When Blood is depleted, Shen can\'t settle, and sleep becomes fitful, dream-disturbed, or shallow. The Heart\'s most important time of day is, paradoxically, the night — because that\'s when it\'s meant to be still.',
      },
      {
        title: 'Speech and the Tongue',
        body: 'The tongue is the sense organ of the Heart — and so the Heart governs speech, especially the kind of speech that carries presence. Healthy Heart Qi produces speech that is warm, clear, and connected to the eyes. Disturbed Heart Qi produces speech that races, stutters, runs ahead of itself, or else goes flat and dissociated. The ability to say what you mean and have it land is, at the level of the body, a Heart capacity.',
      },
      {
        title: 'Connection Without Disappearing',
        body: 'The Heart is the organ of intimacy — but healthy intimacy, in the Chinese view, requires a sovereign, not a servant. A Heart that is well can love deeply and remain itself; a Heart that is depleted often loves by disappearing into the other person, and then resents the disappearance. The Pericardium exists precisely so the Sovereign doesn\'t have to do this work alone.',
      },
      {
        title: 'Midday and the Inner Light',
        body: 'Between 11:00 and 13:00, the Heart reaches its peak — the body\'s noon, the hour when the inner light is meant to be most accessible. This is not a time for hard work; it\'s a time for connection, for shared meals, for the kind of conversation that nourishes you rather than draining you. A culture that schedules its hardest meetings during the Heart\'s hour is asking the Sovereign to do the work of a soldier — and over the years, that costs.',
      },
    ],
    lifeQuestions: [
      'When was the last time you felt your Shen settle — fully present, fully here — and what did it take to get there?',
      'Where in your life have you been loving by disappearing, and what would it cost you to stay yourself while you love?',
      'What joy in your life has turned into a performance, and what would it look like to let it be quiet again?',
    ],
  },

  smallIntestine: {
    key: 'smallIntestine',
    name: 'Small Intestine',
    chinese: '小腸',
    englishName: 'The Sorter',
    element: 'fire',
    yinYang: 'yang',
    partner: 'heart',
    spirit: 'shen',
    organClockTime: '13:00–15:00',
    emotion: { balanced: 'Joy', imbalanced: 'Restlessness' },
    domain: ['discernment', 'sorting', 'clarity'],
    essence:
      'Separates the pure from the impure — the organ of discernment, of telling what to take in from what to let go.',
    description:
      'The Small Intestine is the yang partner of the Heart, and its function in classical TCM is to separate the pure from the impure — to sort what nourishes from what does not, what to take in from what to let go. Physically, this happens with food in the gut between 13:00 and 15:00, when the body settles into the slower work of digestion. Energetically, the Small Intestine extends the same capacity into the mental and emotional realm: discernment about which impressions to keep, which thoughts to follow, which relationships to invest in. It is the organ of clarity in the practical sense — not insight, but the everyday ability to tell signal from noise. When the Small Intestine is healthy, the small decisions about what matters get made quietly and continuously in the background; when it is overwhelmed, the same person can be flooded with information and unable to tell what is theirs and what isn\'t.',
    balanced:
      'The ability to sort — quickly and quietly — what serves you from what doesn\'t. Discernment that is clear without being harsh. Easy digestion, both of food and of impressions. The ability to spend time in a busy environment without bringing all of it home with you. A selective relationship to information rather than an absorptive one.',
    blocked:
      'Mental overwhelm in the early afternoon — the Small Intestine\'s hour. A sense of being saturated with other people\'s thoughts, opinions, and emotional residue. Difficulty deciding what is worth caring about. Bloating or sluggish digestion in the mid-afternoon. A tendency to carry other people\'s stress home and treat it as your own.',
    themes: [
      {
        title: 'The Sorter — Pure and Impure',
        body: 'The Small Intestine\'s classical function is to separate the pure from the impure — the most useful description of a capacity we all need many times a day. From food, it extracts what nourishes and sends the rest on. From experience, it extracts what teaches and lets the rest pass. When this function is working well, life feels less crowded — not because less is happening, but because more of it is being sorted in the background.',
      },
      {
        title: 'Discernment Without Harshness',
        body: 'A healthy Small Intestine gives you the gentlest kind of clarity — the kind that doesn\'t need to argue. When it is depleted, sorting becomes either too lax (everything in) or too rigid (nothing in). The first is overwhelm; the second is the brittleness of a life that has turned its discernments into walls. In classical terms, either pattern is the same organ asking for the same thing: rest, warmth, and time.',
      },
      {
        title: 'The Body\'s Afternoon',
        body: 'Between 13:00 and 15:00, the Small Intestine works hardest. This is the body\'s afternoon — slower than morning, quieter than evening, deeply occupied with sorting what the day has brought so far. Cultures that honor the siesta are honoring this organ; cultures that schedule their hardest meetings in this window are asking the Sorter to perform when it is meant to be sorting. A lot of afternoon energy crashes are simply the Small Intestine asking for what it actually needs.',
      },
      {
        title: 'What You Absorb, What You Release',
        body: 'The Small Intestine governs absorption — and so, in subtle ways, it decides what becomes part of you and what does not. This applies to food, but also to opinions, to other people\'s moods, to the texture of a difficult conversation. People with a strong Small Intestine can spend a day in chaos and still arrive home as themselves; people with a depleted Small Intestine can spend an hour in a difficult room and carry it for days.',
      },
      {
        title: 'The Heart\'s Practical Companion',
        body: 'The Heart sees what matters; the Small Intestine sorts the daily details that allow what matters to actually get lived. They work as a pair: vision and discernment, presence and practicality. A life with a clear Heart but a depleted Small Intestine knows what is important but can\'t organize the days around it. A life with a strong Small Intestine but an unsettled Heart sorts beautifully but is no longer sure what it is sorting toward.',
      },
      {
        title: 'Bloating, Mental Fog, and the Same Pattern',
        body: 'In classical Chinese medicine, mid-afternoon bloating and mid-afternoon mental fog are often the same problem — a Small Intestine that has been asked to sort more than it has the capacity to sort. Body and mind are not separate systems here. Both improve when the same organ is supported: with warm food, with rest, and with permission to take less in.',
      },
    ],
    lifeQuestions: [
      'What are you taking in right now that isn\'t actually yours to take in?',
      'Where have you let your discernment harden into a wall, and what is on the other side of it that you\'ve stopped letting in?',
      'What is the most important thing your day has been trying to sort out for you that you haven\'t yet given it time to finish?',
    ],
  },

  bladder: {
    key: 'bladder',
    name: 'Bladder',
    chinese: '膀胱',
    englishName: 'The Storage of Fluids',
    element: 'water',
    yinYang: 'yang',
    partner: 'kidney',
    spirit: 'zhi',
    organClockTime: '15:00–17:00',
    emotion: { balanced: 'Trust', imbalanced: 'Fear' },
    domain: ['release', 'flow', 'fear\'s passage'],
    essence:
      'Receives and clears the body\'s waters — the organ of fear\'s release and the willingness to let things pass through.',
  },

  kidney: {
    key: 'kidney',
    name: 'Kidneys',
    chinese: '腎',
    englishName: 'The Root',
    element: 'water',
    yinYang: 'yin',
    partner: 'bladder',
    spirit: 'zhi',
    organClockTime: '17:00–19:00',
    emotion: { balanced: 'Trust', imbalanced: 'Fear' },
    domain: ['Jing', 'will', 'inheritance', 'depth'],
    essence:
      'Stores Jing — your essential life force — and houses Will. The organ of depth, ancestral inheritance, and the long thread of a life.',
  },

  pericardium: {
    key: 'pericardium',
    name: 'Pericardium',
    chinese: '心包',
    englishName: 'The Heart\'s Protector',
    element: 'fire',
    yinYang: 'yin',
    partner: 'tripleHeater',
    spirit: 'shen',
    organClockTime: '19:00–21:00',
    emotion: { balanced: 'Warmth', imbalanced: 'Defended distance' },
    domain: ['intimacy', 'protection', 'closeness'],
    essence:
      'The membrane around the Heart — deciding who comes close, and how close they\'re allowed to come.',
    description:
      'In classical Chinese medicine the Pericardium is the soft wall around the Heart — the Heart Master, the one who answers the door. The Sovereign cannot meet every visitor itself, so the Pericardium does the meeting for it: opening, listening, judging the temperature of what stands outside. Together with its yang partner the Triple Heater, it regulates the warmth that passes between you and another person — how much, how fast, how safely. When it\'s healthy you can be near someone without bracing, and let them be near you without disappearing. When it\'s depleted or walled-up, even the people you love seem to reach you through glass. Much of what we call intimacy lives here, in the quality of this membrane.',
    balanced:
      'Warmth that arrives without performance. Easy presence in close company. The chest stays soft when someone comes near. You can say no without slamming a door. Sleep settles in the late evening.',
    blocked:
      'A guarded distance, even with people you love. Quick recoil at touch or emotional closeness. Wired, restless evenings between 19:00 and 21:00. Old relational hurts that never quite finished. A sense of meeting the world from behind something.',
    themes: [
      {
        title: 'The Membrane Around the Sovereign',
        body: 'The Heart, in this system, is treated as a sovereign — too central to be exposed directly to every passing weather. The Pericardium is what stands between the Sovereign and the world. It absorbs the first impact of an argument, a slight, a piece of bad news, so that the Heart itself isn\'t struck. This is why a healthy Pericardium is supple rather than hard: it gives, returns, and gives again. When it stiffens, the Heart loses its protection in one direction and its access to the world in the other.',
      },
      {
        title: 'The Gateway of Intimacy',
        body: 'Intimacy isn\'t the absence of a boundary — it\'s a working one. The Pericardium is that working gate. It opens for the people who have earned closeness and stays closed to the ones who haven\'t, and it can tell the difference without you having to think about it. When the gate works, you can let someone in without bracing for what they might do once they\'re inside. When it stops working, you either lock everyone out or let everyone in, and both feel like the same exhaustion by the end of the week.',
      },
      {
        title: 'Defended Closeness',
        body: 'Some people are physically close to others all day and still untouched by any of it. They smile, they listen, they hold the room — and nothing actually lands. This is the signature of a defended Pericardium: closeness is performed, but not received. Often there\'s an older injury underneath, a moment when being open turned out to be unsafe, and the membrane thickened in response. The protection made sense once. It\'s the staying-thickened, long after the danger has passed, that becomes the problem.',
      },
      {
        title: 'Letting People In Without Losing the Self',
        body: 'A common fear, especially for those who love deeply, is that opening to another person will mean disappearing into them. So they oscillate — too close, then too far, then too close again. A well-functioning Pericardium makes a third option possible. You can be near someone and still feel where you end. Closeness stops being a choice between fortress and flood, and becomes something you can actually live inside.',
      },
      {
        title: 'The Pericardium and the Triple Heater',
        body: 'The Pericardium has a yang partner, the Triple Heater, and the two work as a single system of warmth. The Pericardium decides who is close; the Triple Heater regulates the temperature once they are. Together they answer a basic question of any relationship — how much heat is safe to share right now? When they\'re in tune, a room with people in it feels warm rather than hot or cold. When they\'re out of tune, you\'ll notice it as social fatigue: drained by company, chilled in your own home, or overheated by interactions that should have been ordinary.',
      },
      {
        title: 'Evening Hours and Wind-Down',
        body: 'On the organ clock the Pericardium holds the hours from 19:00 to 21:00 — the threshold between the working day and the night. This is when the gate is meant to close gently, the Heart to settle, the body to soften toward sleep. If this window is consistently wired — scrolling, arguing, performing, replaying the day — the Pericardium doesn\'t get to do its evening work. Over time, sleep onset suffers, and so does the next morning\'s capacity for closeness. Protect these two hours and you protect the whole system.',
      },
    ],
    lifeQuestions: [
      'Who am I able to let actually close to me right now?',
      'What does my chest do when someone reaches for me?',
      'What happens in my evenings between 19:00 and 21:00?',
    ],
  },

  tripleHeater: {
    key: 'tripleHeater',
    name: 'Triple Heater',
    chinese: '三焦',
    englishName: 'The Coordinator',
    element: 'fire',
    yinYang: 'yang',
    partner: 'pericardium',
    spirit: 'shen',
    organClockTime: '21:00–23:00',
    emotion: { balanced: 'Warmth', imbalanced: 'Disconnection' },
    domain: ['communication', 'coordination', 'warmth between systems'],
    essence:
      'The functional system that coordinates the body\'s three burning spaces and keeps warmth moving between them.',
    description:
      'The Triple Heater is the one organ in Chinese medicine with no physical body. It is a function rather than a thing — the coordination between the upper burner (chest and head), the middle burner (digestion), and the lower burner (elimination and reproduction). Its job is to keep warmth, fluid, and information moving between these three regions so the body works as one piece instead of three. Classical texts call it the Official in Charge of Sluices and Waterways, and the name fits: it opens and closes the small gates that let heat reach the hands, fluid reach the tissues, and signals reach the organs that need them. When it is working, you feel coordinated in your own body and warm with the people around you. When it is depleted, the parts of your life stop talking to each other — your body feels far away, evenings are hard to settle into, and the warmth you offer others does not quite land.',
    balanced:
      'Hands and feet warm without effort. The body feels like one piece, not a set of parts. Easy transitions between work, rest, and sleep. Warmth in conversation that the other person can actually feel. Sleep arrives when you lie down.',
    blocked:
      'Cold extremities while the chest runs hot. A sense of being disconnected from your own body. The evening will not wind down — you are tired but wired. Social warmth that you mean but cannot transmit. Temperature, hormones, and mood that swing without an obvious cause.',
    themes: [
      {
        title: 'The Three Burning Spaces',
        body: 'Chinese medicine divides the torso into three regions, each with its own work. The upper burner — chest, lungs, heart — handles breath and circulation. The middle burner — stomach, spleen, liver — handles digestion and the processing of food into usable energy. The lower burner — kidneys, bladder, intestines, reproductive organs — handles storage, elimination, and the deep reserves. The Triple Heater is what keeps these three regions in conversation. When the conversation breaks down, you can eat well and still feel cold, or think clearly and still feel ungrounded.',
      },
      {
        title: 'Warmth Between Systems',
        body: 'The Triple Heater is the body\'s thermostat, but a strange one. It does not just regulate temperature — it regulates how heat is distributed. A healthy Triple Heater sends warmth out to the surface when you need to meet the world, and pulls it inward when you need to digest, rest, or recover. A depleted one leaves heat trapped in the chest while the hands and feet go cold, or scatters it outward so you sweat at rest and shiver under a blanket. Hormonal swings, hot flashes, and night sweats often live here.',
      },
      {
        title: 'Coordination and Connection',
        body: 'Coordination is the quiet work of a healthy body — the way breath syncs with movement, digestion with rest, attention with what is in front of you. You only notice it when it stops. When the Triple Heater is strained, the parts of you stop arriving at the same time. You sit down to eat and your stomach is not ready. You go to bed and your mind is still in the meeting. You try to be present with someone and half of you is somewhere else. The work is not to push harder but to let the systems find each other again.',
      },
      {
        title: 'The Pericardium and the Triple Heater',
        body: 'These two are the yin and yang of relational fire. The Pericardium guards the heart from the inside — it decides who gets close. The Triple Heater carries the warmth outward — it decides how that closeness is felt. One without the other does not work. A Pericardium that opens without a Triple Heater to deliver warmth produces vulnerability that nobody can actually feel. A Triple Heater that broadcasts warmth without a Pericardium to anchor it produces charm without intimacy. Together, they are what people mean when they say someone is warm.',
      },
      {
        title: 'Evening Hours and the Slow Descent',
        body: 'The Triple Heater\'s peak hours are 21:00 to 23:00 — the window between the day and sleep. This is when the body is meant to lower its temperature, settle its hormones, and quiet the systems that have been running since morning. If the Triple Heater is strong, the descent happens almost on its own and sleep arrives soon after. If it is depleted, this is the hour you suddenly feel awake, scroll on your phone, eat something you did not need, or find a second wind that costs you the next day. The fix is not willpower. It is giving the body a darker, quieter, slower runway.',
      },
      {
        title: 'The Functional Organ',
        body: 'The Triple Heater has no anatomy — no organ a surgeon could remove, no tissue a scan could find. It exists only as relationship, as the working-together of everything else. This is worth sitting with. Some of the most important things in a life are like this: a marriage, a friendship, a sense of home. They are not objects you can point to. They are the quality of how the parts move together. When that quality is alive, you barely notice it. When it goes, you feel the absence everywhere and cannot say exactly what is missing.',
      },
    ],
    lifeQuestions: [
      'Where in your life have the parts stopped talking to each other?',
      'What does your evening descent into sleep actually look like?',
      'Whose warmth reaches you, and whose warmth do you mean but cannot send?',
    ],
  },

  gallbladder: {
    key: 'gallbladder',
    name: 'Gallbladder',
    chinese: '膽',
    englishName: 'The Decisive Official',
    element: 'wood',
    yinYang: 'yang',
    partner: 'liver',
    spirit: 'hun',
    organClockTime: '23:00–01:00',
    emotion: { balanced: 'Creativity', imbalanced: 'Anger' },
    domain: ['decision', 'courage', 'beginning'],
    essence:
      'Turns the Liver\'s plans into action — the organ of decision, courage, and the willingness to begin.',
    description:
      'The Gallbladder is the yang partner of the Liver — and where the Liver makes plans, the Gallbladder makes decisions. The classical texts call it the Decisive Official because it is the organ that closes the gap between knowing and doing, between what is conceived and what is begun. It is also the organ of courage in the Chinese tradition: not the absence of fear, but the willingness to step across the threshold of a decision before all the evidence is in. The Gallbladder works most deeply at night, between 23:00 and 01:00, processing the day\'s choices and preparing the body for the regenerative work that follows. When the Gallbladder is well, you can hear what you actually want and act on it; when it is tired, you can know exactly what is needed and still be unable to begin.',
    balanced:
      'The capacity to decide without endless deliberation. The willingness to begin before all the evidence is in. A relationship to risk that is awake — neither reckless nor frozen. Sleep that comes easily around 23:00 and holds. The felt sense that your judgment is trustworthy, even when it turns out to be wrong, because at least it is yours.',
    blocked:
      'Decision paralysis — the same options reviewed again and again with no resolution. Wakefulness or restlessness around 23:00–01:00, when the Gallbladder is meant to be doing its quiet work. Indecisiveness that masquerades as thoroughness. A jaw that clenches at the threshold of a choice. The habit of leaning on others to decide for you so you can be relieved of the responsibility — and the resentment that follows.',
    themes: [
      {
        title: 'The Threshold of Decision',
        body: 'The Gallbladder lives at the threshold — the moment between knowing and doing. When it is healthy, the threshold is permeable: information becomes a decision, the decision becomes movement, the movement becomes a life. When it is depleted, the threshold thickens, and you stand at it endlessly, gathering evidence for a choice that no amount of evidence will ever make for you. A decision, in the end, is not the outcome of analysis. It is a separate capacity, and the Gallbladder is its home.',
      },
      {
        title: 'Courage as a Body State',
        body: 'Classical Chinese medicine treats courage not as a trait but as a body state — and locates it in the Gallbladder. People with strong Gallbladder Qi can act in the face of uncertainty without the body collapsing into fear. People with depleted Gallbladder Qi may know perfectly well what they want and find that their body cannot carry it through. Courage, in this view, is not a quality you summon. It is a substance you either have or do not have, and there are practices that build it.',
      },
      {
        title: 'The Night Hours of Choice',
        body: 'Between 23:00 and 01:00, the Gallbladder does its deepest work. The body sorts through the day\'s decisions, lets go of what was inconsequential, and prepares the Liver to do its blood-storing work afterward. Waking consistently in these hours — wide-eyed, mind churning over choices made and unmade — is the Gallbladder asking you to settle something it cannot finish on its own. Going to sleep before 23:00 is one of the kindest things you can do for it.',
      },
      {
        title: 'Beginning vs. Planning',
        body: 'The Liver plans; the Gallbladder begins. A life that plans without beginning becomes paralysis dressed up as preparation. A life that begins without planning becomes chaos. The Gallbladder is what allows the plan to actually start — and a person with a strong Gallbladder learns to recognize the moment when one more piece of information is no longer information but resistance.',
      },
      {
        title: 'Risk and Right-Sizing',
        body: 'A healthy Gallbladder is not recklessness. It is the capacity to take the right risk — the one that fits your life — without taking risks for the sake of feeling alive. Depleted in one direction, you become risk-averse and small; depleted in the other, you become risk-seeking and unstable. Both are the same exhaustion wearing different clothes, and both resolve when the Gallbladder is given the rest and the food it needs.',
      },
      {
        title: 'Anger That Will Not Decide',
        body: 'Like the Liver, the Gallbladder is sensitive to anger — but its anger is the anger of indecision. The frustration of standing at a threshold and refusing to cross it. The irritability that builds in a person who knows what they need to do and will not do it. When the Gallbladder is finally allowed to choose, that anger usually disappears, because it was never about the world. It was about the threshold.',
      },
    ],
    lifeQuestions: [
      'What decision have you been making the same way every day by not making it — and what is it costing you to leave it unmade?',
      'Where in your life have you been waiting for one more piece of information that wouldn\'t actually change what you would choose?',
      'What did your body know it wanted to do before your thinking talked you out of it?',
    ],
  },

  liver: {
    key: 'liver',
    name: 'Liver',
    chinese: '肝',
    englishName: 'The General',
    element: 'wood',
    yinYang: 'yin',
    partner: 'gallbladder',
    spirit: 'hun',
    organClockTime: '01:00–03:00',
    emotion: { balanced: 'Creativity', imbalanced: 'Anger' },
    domain: ['vision', 'planning', 'flow', 'storage of blood'],
    essence:
      'Plans, directs, and stores the blood that sustains vision — the organ of strategy, courage, and the urge to grow.',
    description:
      'The classical texts call the Liver the General because it draws up the strategic plans that organize a life — direction, purpose, and the long arc of becoming who you are. Its job is to keep Qi moving smoothly through the body and through the day, and when that movement is unobstructed, you feel decisive, creative, and at ease in your own body. The Liver also stores Blood, which means it stores the substance of memory, of being rooted in yourself, and of the capacity to dream forward without losing the ground under your feet. It houses the Hun — the wandering soul that carries vision and night-dreams — and so it governs the relationship between imagination and action. When the Liver is healthy, plans turn into work and frustration moves through you; when it is constrained, the same energy that fuels creativity turns into anger that finds no clean outlet and seeps out as irritability, headaches, and a body that feels as though it cannot move.',
    balanced:
      'A natural sense of direction that does not require constant deliberation. Creativity that turns into work and form rather than staying as ideas. Anger that arises cleanly when something matters and resolves once the matter is addressed. Flexibility in body and in decision — the willingness to bend without breaking. Eyes that see clearly, both into the world and into a future that is genuinely your own.',
    blocked:
      'Tension that lodges in the temples, neck, and shoulders. Frustration with no clear object — the world simply feels as though it\'s in the way. Plans that never become action, or actions that never become plans. Sleep that breaks between 1 and 3 a.m. with thoughts of what was left unfinished. Eyes that strain, decisions that exhaust, and a body that feels stuck in a position it has been trying to leave for years.',
    themes: [
      {
        title: 'The General — Vision and Direction',
        body: 'The Liver is the strategist of the body — the organ that asks where this life is going and how to get there. When it is healthy, it gives you the long view and the patience to work in pieces toward something only you can see. When it is depleted, the strategist keeps trying to plan but cannot land — the mind generates options endlessly, exhausting itself on a future it cannot quite reach. A General without ground does not stop strategizing; it simply stops being able to act.',
      },
      {
        title: 'Anger as Clean Force',
        body: 'Anger is the emotion of Wood, and the Liver is where it lives in the body. Clean anger arises when something is being violated; it names the violation, gives you the energy to address it, and subsides once the matter is resolved. Frustrated anger — anger that has no permission to be anger — becomes irritability, sideways remarks, a jaw that grinds at night. The Liver does not punish you for being angry. It punishes you for swallowing it.',
      },
      {
        title: 'The Hun — Vision and Wandering',
        body: 'The Liver houses the Hun, the soul that travels — through dreams at night, through imagination by day, through reaching toward what is not yet. The Hun gives meaning to the future and connects you to the people and places that pull you forward. When the Liver Blood that anchors it is depleted, the Hun wanders without ever landing — into other people\'s stories, into restlessness, into the inability to commit. Strong Liver Blood is what allows imagination to become work.',
      },
      {
        title: 'Smooth Flow, Stuck Flow',
        body: 'Above all, the Liver governs the smooth flow of Qi — through your body, through your day, through your relationships. Smooth flow looks like ease in transitions, in conversation, in beginnings and endings. Stuck flow looks like the small daily frictions that accumulate: tension headaches, tightness across the upper back, sighing, the sense that you cannot quite exhale. Wood needs to move, and a life that gives it nowhere to go becomes a body that cannot relax.',
      },
      {
        title: 'Storage of Blood, Storage of Self',
        body: 'The Liver stores Blood at night while you sleep — replenishing the substance that nourishes muscle, vision, the menstrual cycle, and the rooted continuity of who you are. Without enough Liver Blood, sleep becomes restless, the eyes dry, the hair thins, and the felt sense of self becomes harder to reach. Lying down at night while the Liver does its work is not optional rest. It is the body repairing the self that will go out into tomorrow.',
      },
      {
        title: 'Spring in the Body',
        body: 'The Liver is the organ of spring — of the year\'s first impulse to grow. It is strengthened by what spring offers: green, sour-bitter foods, movement that has a direction, and the willingness to begin things whose ending you cannot yet see. It struggles in environments that never permit growth — chronic stagnation, suppressed expression, lives that have to be kept small. Wood that cannot grow turns inward and burns.',
      },
    ],
    lifeQuestions: [
      'Where in your life is the Wood in you trying to grow against something that is not actually you — and what would change if you let it move freely?',
      'What anger have you been carrying as irritation because it never seemed important enough to count as anger — and what is it actually telling you?',
      'What vision is your Hun reaching for, even quietly, that you have not yet given yourself permission to live?',
    ],
  },
};

// Order following the organ clock — starting at 03:00 (Lung).
const CLOCK_ORDER = [
  'lung', 'largeIntestine', 'stomach', 'spleen',
  'heart', 'smallIntestine', 'bladder', 'kidney',
  'pericardium', 'tripleHeater', 'gallbladder', 'liver',
];

// Order grouped by element (Sheng cycle), then yin then yang.
const ELEMENT_GROUP_ORDER = [
  // Wood
  'liver', 'gallbladder',
  // Fire
  'heart', 'smallIntestine', 'pericardium', 'tripleHeater',
  // Earth
  'spleen', 'stomach',
  // Metal
  'lung', 'largeIntestine',
  // Water
  'kidney', 'bladder',
];

export function getOrgan(key) {
  return ORGANS[key];
}

export function getAllOrgans() {
  return CLOCK_ORDER.map((k) => ORGANS[k]);
}

export function getOrgansGroupedByElement() {
  const groups = { wood: [], fire: [], earth: [], metal: [], water: [] };
  ELEMENT_GROUP_ORDER.forEach((k) => {
    const o = ORGANS[k];
    groups[o.element].push(o);
  });
  return groups;
}

export function hasDepthContent(organ) {
  return Boolean(organ && organ.themes && organ.themes.length > 0);
}

export { ORGANS, CLOCK_ORDER, ELEMENT_GROUP_ORDER };
