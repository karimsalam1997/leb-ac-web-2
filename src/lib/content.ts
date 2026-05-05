import "server-only";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export type Citation = {
  id: number;
  text: string;
};

export type EssaySection = {
  heading?: string;
  paragraphs: string[];
};

export type Essay = {
  slug: string;
  title: string;
  dek: string;
  byline: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  pullQuote: string;
  tags: string[];
  relatedSlugs: string[];
  notes: Citation[];
  sections: EssaySection[];
  heroStyle?: "image" | "art";
};

export type Letter = {
  slug: string;
  title: string;
  location: string;
  date: string;
  readTime: string;
  excerpt: string;
  body: string[];
};

export type NotebookEntry = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
  size: "large" | "medium" | "small";
};

const editorialImageExtensions = new Set([
  ".avif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

const fallbackEssays: Essay[] = [
  {
    slug: "the-mehtail-republic",
    title: "The Mehtail Republic",
    dek: "The Lebanese person is not corrupt. He is the most rational actor in the most irrational system on earth.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "The Lebanese person is not corrupt. He is the most rational actor in the most irrational system on earth — a man who learned, across generations of evidence, that the only governance unit that ever worked was himself.",
    pullQuote: "The mehtail did not create the dysfunction. He adapted to it. The adaptation became culture. The culture now reproduces the dysfunction.",
    tags: ["Political Economy", "Society", "State Failure"],
    relatedSlugs: ["the-brilliant-nodes", "the-service-state", "cartel-in-the-costume-of-a-country"],
    notes: [
      { id: 1, text: "Game theory literature on iterated prisoner's dilemmas in zero-enforcement environments is directly applicable to Lebanese civic behavior patterns." },
      { id: 2, text: "Melani Cammett's fieldwork on Lebanese sectarian welfare provision documents the service-loyalty exchange that makes sectarian dependence individually rational." },
      { id: 3, text: "Data on Lebanese diaspora economic success — Slim, Safra, West African merchant communities — is drawn from comparative diaspora economics literature." },
    ],
    sections: [
      {
        paragraphs: [
          "The Lebanese person is not corrupt. He is the most rational actor in the most irrational system on earth — a man who learned, across generations of evidence, that the only governance unit that ever worked was himself.",
          "This is the argument that Lebanese people themselves resist most violently, because it implicates them in a structure they also hate. But hatred of a system and participation in it are not contradictions. They are the definition of a trap.",
          "Start with the driving. Every visitor to Beirut notices it within ten minutes and frames it as evidence of some essential Lebanese character defect — anarchic, individualistic, unable to follow rules. This is the wrong diagnosis. The Lebanese driver is not ignoring traffic law. He is correctly reading an environment where traffic law is a suggestion issued by an institution that cannot enforce it, and where every other driver has made the same calculation simultaneously. The double-parked Mercedes blocking a lane is a man who has understood, at a cellular level, that public space is simply unclaimed private space. He is wrong morally. He is correct analytically. The enforcement apparatus does not exist. The social contract that would make compliance individually rational does not exist. He is playing the game as it is actually configured, not as it is formally described.",
          "Scale that logic across every domain of Lebanese life and you have the country.",
        ],
      },
      {
        heading: "The Mehtail as Structural Product",
        paragraphs: [
          "The generator. The private school. The wasta call to the ministry official. The building permit obtained through a cousin rather than an application. Each of these is an individually rational response to an institutionally broken system. The Lebanese person did not create the dysfunction. He adapted to it, as any organism adapts to its environment. The adaptation became culture. The culture now reproduces the dysfunction. This is the trap, and it has a name: the mehtail cycle.",
          "The mehtail is not a moral category. He is a structural product. He emerges wherever formal institutions exist on paper but deliver nothing in practice; where informal networks deliver everything but only to those inside them; where there is no credible enforcement of rules against those with sufficient connections; and where the time horizon for any individual actor is short because the system has repeatedly demonstrated its capacity to collapse without warning. Under these conditions, the only rational move is to extract what you can, protect what you have, and extend trust only to those whose loyalty you can verify through kinship or long mutual dependence.",
          "Lebanon has run this experiment for eighty years. The results are in.",
        ],
      },
      {
        heading: "The Brilliant Nodes Without a Network",
        paragraphs: [
          "What makes Lebanon's version distinctive is the civilizational talent the system is wasting. Lebanese emigrant communities are among the most economically successful on earth. Carlos Slim built the largest private fortune in Latin American history from a Lebanese immigrant family. Lebanese merchants ran West African commerce for a century. In Australia, Brazil, Canada, the Gulf, wherever Lebanese communities settled with functioning state institutions around them, the same raw material — the cunning, the multilingualism, the commercial instinct, the adaptive intelligence — produced extraordinary outcomes. The individual Lebanese node, plugged into a functional network, is spectacular.",
          "Plugged into Lebanon, the same node produces blackouts.",
          "The difference is not character. It is infrastructure. The Jewish diaspora survival model, which the Lebanese diaspora most resembles in its raw components, was built on a paradox: fierce individual ambition in service of collective persistence. The synagogue, the burial society, the lending circle, the political lobby, the university pipeline — these were institutions that created a commons that individual talent could draw from and feed back into. Lebanon has the processor. It ripped out the motherboard.",
        ],
      },
      {
        heading: "The Vertical Trap",
        paragraphs: [
          "The Lebanese solidarity structure is not absent. It is precisely targeted. Watch a Lebanese family mobilize for a wedding, a funeral, a cousin's hospital bill. The coordination is immediate, total, and extraordinarily efficient. The same people who will not yield one centimeter in a traffic jam will mortgage their homes to cover a relative's debt. This is not a contradiction. It is two different systems running simultaneously on different logics.",
          "The family and sect run on honor, shame, obligation, and reciprocity. It works. The state and public sphere run on extraction, cunning, and impunity. That also works — for those running it. What does not exist is the bridging layer: the institution that translates family-level solidarity into civic-level coordination. Every attempt to build that layer has been captured by the franchise holders and converted into another patronage node.",
          "The mehtail republic needs not moral reformation but the thing it has never had: an institutional environment in which the individually rational move and the collectively rational move are the same move. The Lebanese person is rational. The system is the problem. These are not consoling conclusions — they redirect blame from the citizen to the structure, and the structure has very effective defenders.",
        ],
      },
    ],
  },
  {
    slug: "the-census-that-cannot-be-taken",
    title: "The Census That Cannot Be Taken",
    dek: "Lebanon has not counted its population since 1932. It will not count it now.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "Lebanon has not counted its population since 1932. It will not count it now. A census is the one act the Lebanese political class unanimously agrees cannot happen — because the result would end the arrangement they have all spent their careers protecting.",
    pullQuote: "The state is the only entity on earth that cannot know how many citizens it has, because knowing would require it to become something other than what it is.",
    tags: ["Demographics", "Sectarianism", "Constitutional Reform"],
    relatedSlugs: ["the-cartel-board-meeting", "the-service-state", "cartel-in-the-costume-of-a-country"],
    notes: [
      { id: 1, text: "The 1932 Lebanese census, conducted under the French Mandate, counted approximately 793,000 people and recorded Christians at 54 percent, a figure disputed by demographers who note the methodology counted diaspora emigrants disproportionately Christian as resident citizens." },
      { id: 2, text: "Hezbollah's political durability relative to the demographic representation argument is analyzed in comparative Lebanese political science literature." },
    ],
    sections: [
      {
        paragraphs: [
          "Lebanon has not counted its population since 1932. It will not count it now. A census is the one act the Lebanese political class unanimously agrees cannot happen — because the result would end the arrangement they have all spent their careers protecting.",
          "That is not hyperbole. It is the operating logic of the Lebanese state, stated plainly by its own architects. The 1943 National Pact was built on the French census of 1932, which recorded Christians as 54 percent of the population. The 6:5 Christian-to-Muslim parliamentary ratio flowed from that count. The Maronite presidency, the Sunni premiership, the Shia speakership — all of it hangs from a single demographic snapshot taken ninety-four years ago by a colonial power with a specific interest in the result it produced.",
          "The French wanted a Christian-majority Lebanon. They got one, on paper, because they designed the census to get one.",
        ],
      },
      {
        heading: "The Frozen Photograph",
        paragraphs: [
          "The French are gone. The demographics are not what the census recorded. Everyone in Lebanon knows this, discusses it in private, and refuses to address it in public. What the actual distribution looks like is itself a contested political act: every community claims the numbers that maximize its leverage. Shia political leaders quote figures suggesting their community comprises 35 to 40 percent of the resident population. Christian leaders maintain parity claims that require a demographic reality most demographers consider implausible. There is no agreed number for anything because agreement on numbers is agreement on power.",
          "The parliament sits at 128 seats, split 64-64 between Christians and Muslims. This ratio was adjusted by Taif in 1989 from 6:5 to 1:1, not because the demographics supported it but because the civil war's power balance demanded it. It was a negotiated outcome between armed factions, not a democratic reflection of a citizen body. The internal allocation — Maronites get 34 seats, Sunnis 27, Shia 27 — was fixed by formula in 1989 and has not moved since.",
          "The army command is permanently Maronite. The central bank governor is conventionally Maronite. The head of general security is Shia. Every senior directorate in every ministry is a confessional slot filled according to a sectarian org chart so institutionally entrenched it operates automatically, without anyone needing to enforce it. This is not representation. It is a frozen photograph of a country that no longer exists, used to allocate power in a country that does.",
        ],
      },
      {
        heading: "The Count That Would End the State",
        paragraphs: [
          "The demographic reality that the census cannot name is roughly this: the Shia community is almost certainly the largest single confessional group in resident Lebanon today. Civil war emigration hit Christian communities hardest. Post-war emigration from the 1990s through the 2019 banking collapse accelerated in communities with the strongest diaspora networks — again, disproportionately Christian and Sunni. The Shia community has the lowest emigration rate and highest birth rate among Lebanon's major sects. By most credible estimates, they comprise somewhere between 30 and 38 percent of the resident population.",
          "The political system allocates them 27 parliamentary seats out of 128. Their actual population entitlement under proportional representation would be substantially higher. This gap — between demographic weight and political representation — is one structural reason Hezbollah's arms are politically sustainable within the Shia community. The weapons compensate for the representation deficit.",
          "Consider what a census would actually require politically. It would require agreement on who counts as Lebanese — which immediately surfaces the Palestinian refugee question, the Syrian refugee question, and the diaspora question. None of these questions have answers that any major Lebanese political actor accepts, because each answer reshapes the power distribution. The census cannot be conducted because its preconditions cannot be agreed — and its preconditions cannot be agreed because agreeing them would already constitute the redistribution of power the census is supposed to produce. The closed loop. The count that would end the state cannot be taken, so the state that cannot be counted continues to govern by the arithmetic of 1932.",
        ],
      },
    ],
  },
  {
    slug: "sovereignty-theatre",
    title: "Sovereignty Theatre",
    dek: "The Lebanese state does not exercise sovereignty. It performs it, on stage, for the Gulf patrons who pay for the performance.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "The Lebanese state does not exercise sovereignty. It performs it — on stage, for the Gulf patrons who will pay for the performance, and who have no interest whatsoever in the real thing.",
    pullQuote: "The state did not lose a confrontation with a generator owner. It demonstrated, again, that the Lebanese state cannot extend its writ even to a meter reading in Sakiet el-Janzeer.",
    tags: ["Sovereignty", "State Failure", "Gulf Relations"],
    relatedSlugs: ["cartel-in-the-costume-of-a-country", "the-transaction", "the-mehtail-republic"],
    notes: [
      { id: 1, text: "Abu Ali Itani case documented from Al Jadeed broadcast coverage, April 2026. The lawyer's admission that 'settling violations' is the normal procedure was broadcast live." },
      { id: 2, text: "Lebanon's generator sector revenue estimates from Ministry of Economy and Energy sector analysts, 2025." },
    ],
    sections: [
      {
        paragraphs: [
          "The Lebanese state does not exercise sovereignty. It performs it — on stage, for the Gulf patrons who will pay for the performance, and who have no interest whatsoever in the real thing.",
          "The tell is always in the target. When the Lebanese state wants to demonstrate that it functions, it does not go after the actors who have genuinely hollowed it out — the port managers who let 2,750 tons of ammonium nitrate sit for seven years, the central bankers who engineered an $80 billion transfer of depositor savings to politically connected accounts, the party militias that maintain parallel security architectures across half the country's territory. Those actors have real defenders. Going after them produces real consequences. Instead, the state selects targets that are large enough to photograph, small enough to survive without, and positioned in communities that cannot fight back effectively in that moment.",
          "In April 2026, the Lebanese state tried to summon a generator owner named Abu Ali Itani for questioning over electricity fraud in Sakiet el-Janzeer, a Sunni neighborhood in West Beirut. Within ninety minutes of the State Security summons, motorcycles had blocked the roads surrounding his neighborhood, a Future Movement coordinator was on live television declaring the arrest an attack on the Sunni community, and garbage was being burned on the streets below. By nightfall, the state had quietly walked away. Abu Ali Itani was still in his apartment. The meters were still spinning.",
        ],
      },
      {
        heading: "The Soft Target That Was Hard",
        paragraphs: [
          "The summons was never really about Abu Ali Itani. It was about optics. The Salam government, formed under international pressure in early 2026 as a precondition for Gulf reconstruction funding, needed deliverables. Not the deliverables that would actually restructure Lebanon's political economy — those would require confronting actors who can end governments — but the kind that photograph well in a ministerial press release. A crackdown on the generator sector. Evidence that the Lebanese state can extend its administrative writ into domains where it previously did not. Something to show Riyadh and Washington that the money is going into a state that functions.",
          "The generator sector is perfect for this purpose. It is genuinely predatory — an estimated $2 billion annual extraction from Lebanese households through inflated rates, manipulated meters, and monopoly over the essential service the actual state catastrophically fails to deliver. It is widely hated. It has no sophisticated international defenders. What the state did not correctly calculate was that Abu Ali Itani was not a soft target. He was a Future Movement neighborhood operator in a Sunni community that had been politically orphaned since Saad Hariri's withdrawal in 2022, sitting on a reservoir of accumulated humiliation. The summons became an occasion.",
          "The lawyer for Itani stated publicly on television that they had secured a one-month administrative extension from the financial prosecutor to 'prepare documents and settle violations.' An admission, broadcast live, that the normal procedure for generator fraud is negotiation and settlement, not prosecution. Not realizing it was a confession. This is the Lebanese legal system describing itself in real time.",
        ],
      },
      {
        heading: "The Audience That Wants the Performance",
        paragraphs: [
          "The performance of sovereignty is not new to Lebanon, but the 2026 version has a specific audience: the Gulf states, whose reconstruction engagement is conditioned on evidence that the Lebanese state is reforming itself. The Salam government understands this. Every cabinet decision, every announced crackdown, every institutional reform measure is calibrated partly for domestic effect and partly for reception in Riyadh and Abu Dhabi. The international community wants to see a state asserting itself. The state shows it is asserting itself. The assertion fails. The international community notes the effort and disburses a portion of the promised funds anyway, because the alternative — acknowledging that Lebanon is unreformable — is politically inconvenient for everyone.",
          "This is sovereignty theatre's perfect audience. The Gulf states do not actually want a fully sovereign Lebanon. A fully sovereign Lebanon would say no to Iranian weapons transits. It would say no to Saudi political money. It would say no to French cultural imperialism. It would say no to American pressure on its banking system. None of these actors want that Lebanon. They want a Lebanon that performs sovereignty well enough to remain a viable client state, but not so well that it becomes an inconvenient one.",
          "The performance serves everyone. The Lebanese state gets its reform credentials without the dangerous work of actual reform. The franchise holders retain their rent streams. Abu Ali Itani goes home. The meters keep spinning. And somewhere in the Saraya, a minister drafts a press release explaining that the rule of law has been preserved through dialogue.",
        ],
      },
    ],
  },
  {
    slug: "the-brilliant-nodes",
    title: "The Brilliant Nodes",
    dek: "Lebanese diaspora produced some of the wealthiest people on earth. Lebanon produced the greatest banking heist in modern history. The difference is not talent.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "Lebanese diaspora produced some of the wealthiest individuals on earth. Lebanon produced the greatest banking heist in modern history. The difference is not talent — it is the total absence of solidarity infrastructure.",
    pullQuote: "Lebanon has the processor. It ripped out the motherboard.",
    tags: ["Diaspora", "Banking Crisis", "Political Economy"],
    relatedSlugs: ["the-mehtail-republic", "cartel-in-the-costume-of-a-country", "the-service-state"],
    notes: [
      { id: 1, text: "Lebanon's banking sector collapse losses estimated at $80-110 billion in depositor funds, World Bank Lebanon Economic Monitor series." },
      { id: 2, text: "Comparative diaspora economics: Lebanese emigrant community performance data drawn from OECD migration studies and regional economic analyses." },
    ],
    sections: [
      {
        paragraphs: [
          "Lebanese diaspora produced some of the wealthiest individuals on earth. Lebanon produced the greatest banking heist in modern history. The difference is not talent — it is the total absence of solidarity infrastructure.",
          "Carlos Slim built the largest private fortune in Latin American history from a Lebanese immigrant family in Mexico City. The Safra banking dynasty — originally from Beirut — controlled financial institutions across three continents by the mid-twentieth century. Lebanese merchants ran the commercial arteries of West Africa for a hundred years. In São Paulo, in Sydney, in Dearborn, wherever Lebanese communities settled with functioning state institutions around them, the same raw material — the cunning, the multilingualism, the commercial instinct, the adaptive intelligence — produced extraordinary outcomes. The individual Lebanese node, plugged into a functional network, is spectacular.",
          "Meanwhile, in Beirut, the banking sector transferred an estimated $80 to $110 billion of depositor savings into politically connected accounts between 1993 and 2019, then collapsed, freezing what remained. Four million Lebanese lost access to their savings. The lira lost 98 percent of its value. The architects of this system — the politicians, the central bankers, the financial institution heads — have not been prosecuted. Their accounts, conveniently moved to foreign banks before the collapse, remain intact.",
        ],
      },
      {
        heading: "Same Raw Material, Different Container",
        paragraphs: [
          "The raw material for Lebanese success is identical wherever you find it: extraordinary commercial instinct, tactical multilingualism, the adaptive intelligence of a people who have survived Phoenicians, Assyrians, Persians, Greeks, Romans, Arabs, Crusaders, Ottomans, and French without being permanently erased by any of them. In a competitive market economy with functioning institutions, these qualities produce exactly what they produce in diaspora: wealth, institutions, influence.",
          "In Lebanon they produce generator mafias, banking Ponzi schemes, and import monopolies. The same intelligence, aimed differently.",
          "The Jewish diaspora survival model, which the Lebanese diaspora most closely resembles in its raw components, was built on a paradox: fierce individual ambition in service of collective persistence. The synagogue, the burial society, the lending circle, the landsmanshaft, the political lobby, the university pipeline — these were institutions that sat between individual ambition and collective survival, creating enforceable mutual obligations. The Hebrew concept captures it: all of Israel is responsible for one another. Not a platitude. A binding social contract that survived two thousand years of statelessness. Lebanon has the ambition without the contract. Five hundred brilliant nodes in the same country cancel each other out, because each is optimizing against all the others with no institution to enforce cooperation.",
        ],
      },
      {
        heading: "The Banking Heist as Thesis",
        paragraphs: [
          "The banking collapse is the brilliant node thesis written in fire. The Lebanese banking sector was built by Lebanese talent — genuinely sophisticated financiers who understood international capital markets, who built institutions that attracted diaspora remittances and Gulf petrodollars, who created the dollar-denominated deposit infrastructure that briefly made Beirut a regional financial hub. This was real. The talent was real. And then the same talent — the same commercial instinct, the same gap-identification — was applied to extracting the system's value rather than producing it. The financial engineering that drained depositors of $80 billion was sophisticated. It required intelligence, connections, and a precise understanding of how to route money through regulatory gaps. It was brilliant, in the clinical sense, applied to theft.",
          "This creates the specific tragedy of the Lebanese middle class — the professional stratum that stayed, believed in something being possible, deposited its savings, paid its taxes, sent its children to private schools. These were the people who behaved as citizens in a country not designed for citizens. They were the nearest thing to the solidarity infrastructure that Lebanon lacked. And they are the ones with frozen accounts and depreciated liras.",
          "The diaspora billionaires had moved their money out. The political class had moved their money out. The doctors and engineers and accountants who stayed and believed — they are the collateral damage of a system that converts every talent into a weapon pointed at the people who can least afford to be weaponized against.",
        ],
      },
    ],
  },
  {
    slug: "what-taif-actually-said",
    title: "What Taif Actually Said",
    dek: "The Taif Agreement did not end the Lebanese civil war. It converted the war's logic into administrative procedure.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "The Taif Agreement did not end the Lebanese civil war. It converted it into administrative procedure — gave the militias suits, gave the checkpoints license numbers, and called the result a constitutional settlement.",
    pullQuote: "Taif redistributed the confessional parliamentary seats. Christians and Muslims now each hold 64. This is presented as reform. It was a renegotiation of the cartel's internal pricing mechanism.",
    tags: ["Taif Agreement", "Civil War", "Constitutional Reform"],
    relatedSlugs: ["the-cartel-board-meeting", "cartel-in-the-costume-of-a-country", "the-transaction"],
    notes: [
      { id: 1, text: "Taif Agreement (1989), formally the National Reconciliation Accord. Article 95 on abolishing political confessionalism has remained unimplemented for 36 years." },
      { id: 2, text: "The 1991 Amnesty Law (Law No. 84) covered civil war crimes and is the foundational document of Lebanese impunity." },
    ],
    sections: [
      {
        paragraphs: [
          "The Taif Agreement did not end the Lebanese civil war. It converted the war's logic into administrative procedure — gave the militias suits, gave the checkpoints license numbers, and called the result a constitutional settlement.",
          "In Ta'if, Saudi Arabia, in October 1989, the Lebanese parliamentarians who had been elected in 1972 — seventeen years earlier, in a country that had since destroyed itself — sat down and wrote a document that would govern Lebanon for the next four decades. The men in the room had spent fifteen years either fighting each other or profiting from the fighting. The document they produced adjusted the sectarian power formula, transferred some authority from the Maronite president to the cabinet, mandated the 'abolition of political confessionalism' as a future goal, and ended the legal basis of the civil war without resolving a single one of its causes.",
          "Article 95 of the amended constitution: 'Abolishment of political confessionalism is a fundamental national objective.' That article was written in 1989. It has been dead since 1989. No government has moved to implement it. Every political actor in Lebanon quotes it when convenient and ignores it always. It is not a commitment. It is a placeholder.",
        ],
      },
      {
        heading: "The Warlords in Suits",
        paragraphs: [
          "Nabih Berri, whose Amal movement had conducted the War of the Camps against Palestinian refugees in the 1980s, became parliamentary speaker in 1992 and has remained so continuously since — thirty-four years, the longest tenure of any parliamentary speaker in the world's functioning democracies. Walid Jumblatt, whose Progressive Socialist Party conducted the Mountain War against the Lebanese Forces in 1983, became the indispensable Druze political broker of the post-war order. Samir Geagea was imprisoned — but this was not justice, it was his political rivals using the post-war state to settle a factional score, as he was the only warlord prosecuted while his counterparts were amnestied.",
          "The amnesty law of 1991 erased the legal record of the civil war crimes. No transitional justice. No tribunal. No accountability process. The men who ordered massacres became the men who designed reconstruction. They brought to civilian governance the same management philosophy they had applied to armed conflict: extract maximum rent from your position, protect your community's share, maintain the ambiguity that allows threat without formal threat.",
          "The civil war is not the exception in Lebanese history. It is the mode. The years of 'peace' between 1990 and 2005, between 2006 and 2023 — these were the intermissions. The franchise system's normal operating condition is managed conflict: violent enough to maintain factional boundaries and patron loyalty, contained enough that the economy continues to function and external patrons continue to invest.",
        ],
      },
      {
        heading: "The Same Deal Being Discussed Again",
        paragraphs: [
          "Now the same deal is being discussed again, in different clothes. The current proposal — circulating in Saudi diplomatic channels since late 2025 — is a 'Taif renovation': maintain the framework's language, implement the senate provision of Article 22, liberate the lower chamber from confessional quotas, integrate Hezbollah into a Lebanese national defense strategy in exchange for disarmament. This proposal has structural merits the previous arrangement lacked. But it will fail for the same reason every Lebanese reform proposal fails: the people who would implement it are the franchise holders.",
          "No cartel votes itself out of business from the inside. The senate provision was in Taif in 1989. The people who wrote it in 1989 are still in power in 2026, or their children are, or their political heirs are. None of them implemented Article 95 in thirty-six years. The current deal asks the same people to implement a different article of the same document they have systematically ignored since they signed it.",
          "What Taif actually said, beneath the constitutional language, was this: the franchise holders have agreed to divide Lebanon's resources in a new formula. The formula will be presented as a peace settlement. The peace settlement will require an ongoing Lebanese state, and the franchise holders will provide one — weak enough to be managed, present enough to absorb international criticism, constitutionally legitimate enough to justify external funding. The civil war is over. The profitable dysfunction has a new operating system. Every subsequent Lebanese settlement has said exactly the same thing.",
        ],
      },
    ],
  },
  {
    slug: "the-rubble-zone",
    title: "The Rubble Zone",
    dek: "Israel flattened southern Lebanon and then occupied the rubble. This is not a security strategy.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Geopolitics",
    excerpt: "Israel flattened southern Lebanon and then occupied the rubble. This is not a security strategy. It is the absence of a strategy wearing a uniform — and Hezbollah has been waiting for exactly this moment since 1982.",
    pullQuote: "Israel has created, at extraordinary military and financial cost, a security buffer zone consisting primarily of demolition sites. It is now garrisoning those demolition sites against a guerrilla force that does not need buildings.",
    tags: ["Israel", "Hezbollah", "Occupation", "Military Strategy"],
    relatedSlugs: ["the-transaction", "cartel-in-the-costume-of-a-country", "the-seventeen-countries"],
    notes: [
      { id: 1, text: "Israel maintained a security zone in southern Lebanon from 1985 to 2000 — fifteen years, during which Hezbollah developed into a mature military organization precisely because of the zone's existence." },
      { id: 2, text: "Hezbollah's tunnel network in southern Lebanon represents decades of engineering investment designed specifically for operations in terrain occupied by conventional forces." },
    ],
    sections: [
      {
        paragraphs: [
          "Israel flattened southern Lebanon and then occupied the rubble. This is not a security strategy. It is the absence of a strategy wearing a uniform — and Hezbollah has been waiting for exactly this moment since 1982.",
          "The fifty-five Lebanese villages currently under Israeli military control have been leveled. Not damaged — leveled. Satellite imagery shows the geometry of what were residential areas reduced to cleared ground. The agricultural land is cratered. The infrastructure is shredded. Israel has created, at extraordinary military and financial cost, a security buffer zone consisting primarily of demolition sites. It is now garrisoning those demolition sites against a guerrilla force that does not need buildings.",
          "The geometry of the problem should have ended the debate before it started. An eight-kilometer buffer zone buys eight kilometers of depth. Hezbollah's Burkan rockets, Falaq launchers, and Iranian-supplied drones do not care about the buffer's edge — they fly over it. The security zone does not intercept fire. It changes the return address. The threat surface has not been reduced. It has been doubled. Israel is now defending two fronts: the occupied strip itself, and the homeland behind it.",
        ],
      },
      {
        heading: "The Experiment Already Ran",
        paragraphs: [
          "The historical verdict on this specific experiment is already in. Israel held a security zone in southern Lebanon from 1985 to 2000 — fifteen years. During those fifteen years, Katyusha rockets continued to fall on the Galilee. The zone did not stop them. What the zone did accomplish was to provide Hezbollah with a training ground, a recruitment engine, and a cause. The South Lebanon Army — Israel's local proxy — was a corruption generator that produced exactly the sectarian resentments necessary for Hezbollah's membership drives. The zone's population, subjected to SLA taxation, arbitrary detention, and collective punishment, became the organizational base Hezbollah needed to build the most sophisticated non-state military force in the Middle East.",
          "Ehud Barak withdrew in May 2000 not because Israel lost a conventional battle. He withdrew because the zone had become a net negative by every metric: casualty rates unsustainable in peacetime, no improvement in security for northern communities, and the accelerating transformation of Hezbollah from a nuisance into a mature military organization specifically trained and motivated to fight Israeli forces in Lebanese terrain. The withdrawal happened because the zone was making Hezbollah stronger and Israel weaker. The current zone is that experiment being rerun against an adversary that is substantially stronger than the 2000 version.",
        ],
      },
      {
        heading: "Garrisoning a Demolition Site",
        paragraphs: [
          "What exactly goes into a security zone? The garrison model requires rotating IDF units through forward operating bases in terrain that Hezbollah has prepared for exactly this contingency: tunnels whose entrances are known, treelines whose sight lines are mapped, approach roads that are trivially ambushable. Every resupply convoy is a potential target. Every patrol is an IED opportunity. Every static outpost is a mortar magnet. Hezbollah's organizational doctrine since 2006 has been built around one principle: make the cost of presence exceed the benefit. They do not need to win a battle. They need to make the garrison bleed at a rate Israeli society will not sustain indefinitely.",
          "The security zone rests on the premise that Lebanese southern geography is the variable that produces the threat. Remove Lebanese fighters from a strip of Lebanese territory and northern Israel is secure. This premise was false in 1985, false in 2000, and is false now, because the threat is not primarily geographic. It is organizational. Hezbollah does not need buildings. It needs tunnels, treelines, patience, and a population grievance to draw on. The demolition of the zone's residential infrastructure has addressed none of these requirements while providing one more: the additional grievance of displacement and destruction.",
          "The buffer that buffers nothing. The strategy that is the absence of a strategy. The rubble Israel is garrisoning while Hezbollah maps the sight lines. Every casualty inside the zone validates Hezbollah's narrative and erodes Israeli public tolerance. Israel knows how to start occupations. It has never once figured out how to end them on its own terms.",
        ],
      },
    ],
  },
  {
    slug: "the-service-state",
    title: "The Service State",
    dek: "Lebanese sectarianism survives not because people believe in it but because it delivers. Nobody abandons their only hospital.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "Lebanese sectarianism survives not because people believe in it but because it delivers. The sect is the only welfare system that works in Lebanon. Nobody abandons their only hospital.",
    pullQuote: "The sect is not filling a vacuum. It is maintaining one. The Lebanese state was designed to fail at service delivery because the service vacuum is where the sects maintain their grip.",
    tags: ["Sectarianism", "Welfare", "Political Economy", "Reform"],
    relatedSlugs: ["cartel-in-the-costume-of-a-country", "the-mehtail-republic", "the-franchisor-has-left"],
    notes: [
      { id: 1, text: "Melani Cammett, 'Compassionate Communalism' (2014): fieldwork documenting that access to services from Lebanese political parties is directly correlated with visible partisan activism and communal loyalty." },
      { id: 2, text: "Lebanese public school enrollment has declined below 30 percent as of 2024. The absence of a shared historical civil war curriculum is a documented policy outcome." },
    ],
    sections: [
      {
        paragraphs: [
          "Lebanese sectarianism survives not because people believe in it but because it delivers. The sect is the only welfare system that works in Lebanon. Nobody abandons their only hospital.",
          "This is the argument that makes liberal Lebanese reformers most uncomfortable, because it removes the comfortable explanation for why sectarianism persists — that people are manipulated into it by cynical politicians, or held in it by false consciousness, or too uneducated to see through its logic. The honest version is darker: Lebanese sectarianism is a rational choice made by millions of people with full awareness of its costs, because the alternative — the Lebanese state — has never once provided a reliable substitute for the services their sect delivers.",
          "Your child needs a hospital bed. The public hospital has no medicine, no equipment, and a six-hour wait that may end in a shrug. The private hospital requires payment in fresh dollars at the door. Your sect's charitable organization — Hezbollah's health network in the south, the Hariri foundation's medical centers in Sunni areas, the Maronite church hospitals in Mount Lebanon — will get your child seen, often for free or at subsidized cost, with the efficiency of an organization that knows its membership and tracks its obligations. The service is real. The delivery is immediate. The quid pro quo is understood.",
        ],
      },
      {
        heading: "Designed to Fail",
        paragraphs: [
          "The Lebanese state has been systematically prevented from delivering services not by incompetence but by design. The electricity sector loses billions annually so that generator owners — who are the political class or its clients — can make billions more. Public hospitals have been starved of medical equipment so that private hospitals — owned by the same political families who control the relevant ministries — can capture the market. Public schools have been allowed to decay so that religious school networks can maintain their enrollment advantage and the loyalty that comes with it. The state has not failed to provide services. It has been designed to fail at providing them, because the service vacuum is where the sects maintain their grip.",
          "This is the franchise model applied to welfare delivery. Every sect that operates a welfare network needs citizens dependent on that network for the network to sustain political loyalty. Genuine state welfare provision would sever the dependency relationship and convert sectarian clients into civic citizens. The franchise holders cannot allow this. They control the state. The state does not deliver.",
          "The trap closes around the citizen gradually. You are born into a sect. Your birth certificate is registered with a sectarian community. Your marriage, if you want it legally recognized, happens in a sectarian court. There is no civil marriage in Lebanon. When you die, you are buried in a sectarian cemetery. Between birth and death, your access to the state is mediated through your sectarian identity at every significant administrative moment.",
        ],
      },
      {
        heading: "Why Reform Cannot Come From Inside",
        paragraphs: [
          "The service state trap is reinforced by its own success. The longer the sect delivers and the state doesn't, the more dependent citizens become on the sect, the more loyalty the sect commands, and the more political capital the sect's leaders can deploy to ensure the state continues to fail. The cycle is self-sealing. The sect is not filling a vacuum. It is maintaining one.",
          "The liberal reformer's response is typically: education will change it. As Lebanese people become better educated, more urban, more exposed to civic models through the diaspora and digital media, sectarian loyalties will weaken. There is some evidence for this aspiration — the 2019 uprising's cross-sectarian character, the civil society movements that persist despite the political class's best efforts to suppress them.",
          "The counter-evidence is stronger. Education does not change the service calculus while the service calculus operates at the material level. The most educated Lebanese citizen, fully aware that the sect's hospital was built with politically captured state funds that should have funded a public hospital, will still take their child to the sect's hospital rather than the dysfunctional public one, because their child needs care now and the structural analysis is for later. The service state survives on the gap between what citizens know and what they can afford to act on. The reformers need to build another hospital before they ask the patients to leave.",
        ],
      },
    ],
  },
  {
    slug: "the-franchisor-has-left",
    title: "The Franchisor Has Left the Building",
    dek: "Every Lebanese political leader represents the rich and poor of their sect simultaneously — which makes real policy mathematically impossible.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "Every Lebanese political leader represents the rich and poor of their sect simultaneously — which makes real policy mathematically impossible. The za'im cannot serve his constituency without destroying his franchise. This is not corruption. It is geometry.",
    pullQuote: "The za'im who builds genuine civic institutions eliminates the service dependency that sustains political loyalty. The rational za'im maintains the service dependency by ensuring the state cannot compete with his network.",
    tags: ["Za'im System", "Patronage", "Political Economy", "Reform"],
    relatedSlugs: ["the-service-state", "cartel-in-the-costume-of-a-country", "the-cartel-board-meeting"],
    notes: [
      { id: 1, text: "The Hariri Foundation provided approximately 33,000 scholarships to Lebanese students between 1979 and 2020, distributed in ways that tracked political loyalty to the Future Movement and its predecessors." },
      { id: 2, text: "Lebanese anti-corruption legislation (Law 175, 2019) created the National Anti-Corruption Commission, which has conducted no significant prosecutions of senior political figures as of 2026." },
    ],
    sections: [
      {
        paragraphs: [
          "Every Lebanese political leader represents the rich and poor of their sect simultaneously — which makes real policy mathematically impossible. The za'im cannot serve his constituency without destroying his franchise. This is not corruption. It is geometry.",
          "Consider what it means to be a successful Lebanese political leader. You represent a confessional constituency that contains, within it, every economic class. Your poorest member is a seasonal agricultural worker in the Bekaa earning three dollars a day. Your richest member is a real estate developer in downtown Beirut with a portfolio in multiple currencies. You need both of their votes, both of their financial contributions, both of their social networks. Now try to make a policy.",
          "A serious policy on agricultural labor — minimum wage enforcement, social security coverage — would cost the developer money. He employs the same agricultural workers through informal subcontracting chains that the Lebanese state conveniently cannot see. Enforce against him and you lose the money that funds the services you provide to the agricultural worker. Exempt him and you have betrayed the agricultural worker you also represent. The za'im resolves this contradiction by making no policy, distributing patronage to both, and maintaining the ambiguity that allows him to be celebrated by each as their champion.",
        ],
      },
      {
        heading: "The Hariri Thesis",
        paragraphs: [
          "The Hariri project is the vertical coalition thesis in its most elaborated historical form. Rafic Hariri was simultaneously the richest Lebanese citizen, the patron of tens of thousands of poor Sunni families who received school scholarships and medical referrals through his network, and the prime minister responsible for the economic policies that transferred wealth upward at a historic scale. He built private hospitals for the poor while ensuring that state hospitals could not compete with his network's private facilities. He employed middle-class Sunnis as civil servants and technocrats while creating the Solidere project that dispossessed working-class Beirutis of downtown property. He was genuinely popular with every stratum of his community and genuinely destructive of any economic arrangement that might have made his patronage unnecessary.",
          "This is not a critique of Hariri personally. He operated exactly as the system requires. The za'im who builds genuine civic institutions — public hospitals, universal education, independent courts — eliminates the service dependency that sustains political loyalty. The rational za'im maintains the service dependency by ensuring the state cannot compete with his network. Every successful Lebanese politician has made this calculation and reached the same conclusion.",
          "The state-society relationship in Lebanon is therefore a permanent triangle: the za'im between the state and his constituency, extracting from the state for his constituency and extracting from his constituency for himself. He is simultaneously the reason the state cannot reform and the reason the state remains minimally functional. The franchise holder is not the state's enemy. He is its parasite — a parasite that has become so embedded in the host that killing the parasite would kill the host.",
        ],
      },
      {
        heading: "The Geometry of Impossibility",
        paragraphs: [
          "Consider what genuine reform would require from the za'im. He would need to support independent judiciary appointments that might prosecute him or his allies. He would need to support public service delivery systems that eliminate the need for his patronage network. He would need to support anti-corruption legislation that would expose the rent streams that fund his operations. Each of these reforms is individually rational for Lebanon as a whole. Each is individually irrational for the za'im who benefits from the current arrangement.",
          "Every Lebanese economic crisis is managed through the same mechanism: targeted transfers to the poorest members of the coalition, financed by extracting from the middle, while protecting the richest members from any real consequence. The 2019 banking collapse followed this logic precisely. Small depositors' accounts were frozen. Politically connected large depositors had already moved offshore. The lira depreciation hit the middle and working class hardest, because the wealthy had already dollarized their assets.",
          "Every Lebanese citizen paying extortionate generator rates while watching their savings depreciate is financing the system that is extracting from them, because the system is also the only thing standing between them and a complete service void. The za'im is simultaneously the cause and the cure, and he has arranged the world so that you cannot have the cure without him. This is not confusion. It is the design.",
        ],
      },
    ],
  },
  {
    slug: "the-transaction",
    title: "The Transaction",
    dek: "Lebanon has never been the subject of its own political life. Since 1920 it has been the object of other people's transactions.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Geopolitics",
    excerpt: "Lebanon has never been the subject of its own political life. Since 1920 it has been the object of other people's transactions — and every Lebanese settlement is really a deal between external patrons, with Lebanese bodies on the table as the collateral.",
    pullQuote: "Lebanon does not have a foreign policy. It has a patron-management strategy.",
    tags: ["Geopolitics", "External Patrons", "Sovereignty", "Saudi Arabia", "Iran"],
    relatedSlugs: ["cartel-in-the-costume-of-a-country", "what-taif-actually-said", "sovereignty-theatre"],
    notes: [
      { id: 1, text: "France's CEDRE conference in 2018 pledged approximately $11 billion to Lebanon conditioned on structural reforms. As of 2026, the reform conditions have not been met and the majority of pledged funds have not been disbursed." },
      { id: 2, text: "Iran's investment in Hezbollah estimated at $100-700 million annually at peak, with cumulative total likely exceeding $10 billion over four decades." },
    ],
    sections: [
      {
        paragraphs: [
          "Lebanon has never been the subject of its own political life. Since 1920 it has been the object of other people's transactions — and every Lebanese settlement is really a deal between external patrons, with Lebanese bodies on the table as the collateral.",
          "State it more plainly: every major Lebanese political outcome since the French drew the borders — every government, every ceasefire, every constitutional adjustment — has been determined primarily by the calculation of actors who do not live in Lebanon and whose interests are served by Lebanon remaining a managed rather than a functional state. The Lebanese political class is not the agent of Lebanese political life. It is the local management team for competing foreign franchises.",
          "The 1943 National Pact was not a Lebanese social contract. It was an unwritten deal between two men — a Maronite and a Sunni — negotiated under French mandate conditions, designed to produce a post-independence arrangement that France could live with, that the Arab states could tolerate, and that the British would not oppose. The Lebanese population was not consulted. The document that has governed Lebanese political life for eighty years was a backroom agreement between community leaders acting as foreign-patron intermediaries, ratified by the external powers' acquiescence rather than popular consent.",
        ],
      },
      {
        heading: "The External Veto Structure",
        paragraphs: [
          "Taif 1989: negotiated in Saudi Arabia under Syrian military pressure, with American strategic direction and Saudi financial backing. The Syrian army controlled approximately 70 percent of Lebanese territory during the negotiations. No Lebanese faction at the table had the independent military capacity to resist Syrian demands. The document that emerged reflected what Saudi Arabia needed, what Syria needed, and what the United States needed. What Lebanon needed was not the primary variable.",
          "The current moment — 2026 — repeats the same grammar at higher stakes. The US-Iran framework agreement is the ceiling of what Lebanon's internal negotiations can achieve. Saudi Arabia proposes a Lebanese settlement package anchored in Taif language not because Saudi Arabia has determined this is best for Lebanon, but because a Lebanon with a politically integrated Shia community and a disarmed Hezbollah would demonstrate that the Saudi-Iran rapprochement has operational regional consequences. Lebanon is the proof of concept for the Gulf's geopolitical project.",
          "None of these external actors have any interest in a fully functional Lebanese state. The interests are harmoniously aligned on this point in a way they are aligned on almost nothing else. A fully functional Lebanese state would say no to Iranian weapons transits, say no to Saudi political money, say no to French cultural imperialism, say no to American pressure on its financial institutions, say no to Israeli military operations on its territory. Every external actor nominally 'committed to Lebanese sovereignty' is committed to it at a level that remains below the threshold where it becomes inconvenient.",
        ],
      },
      {
        heading: "The Patron-Management Strategy",
        paragraphs: [
          "The Lebanese political class understands this. It has learned, over eighty years, to play the external actors against each other — extracting resources from each patron in exchange for performing the kind of alignment each patron needs. The Hariri family extracted Saudi money while performing Sunni moderation for American audiences while maintaining working relationships with Syrian intelligence. Hezbollah extracts Iranian weapons while performing resistance for domestic audiences while maintaining enough political ambiguity to survive Lebanese government participation. Every major Lebanese political actor has a primary patron and one or two secondary ones, and the art of Lebanese politics is maximizing extraction from each without triggering a confrontation between them on Lebanese soil.",
          "Lebanon does not have a foreign policy. It has a patron-management strategy.",
          "The transaction being negotiated now will probably get done, in some form. Lebanon will probably get a temporary period of reduced violence, some reconstruction money, a new government with new technocratic faces, and a constitutional adjustment that the political class will immediately begin hollowing out. The deal will be announced as a Lebanese constitutional achievement. It will be substantially a Saudi-Iranian agreement with Lebanese content. This is not cynicism. It is the pattern, documented across a century of Lebanese political history. The pattern does not change until the external dynamic changes — until one or more external actors develops an interest in a genuinely functional Lebanese state rather than a manageable Lebanese client. There is no current evidence of such a development.",
        ],
      },
    ],
  },
  {
    slug: "the-seventeen-countries",
    title: "The Seventeen Countries",
    dek: "Lebanon has approximately 1,100 municipalities on 10,452 square kilometers. That is not administration. That is a taxonomy of distrust.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "Lebanon has approximately 1,100 municipalities on 10,452 square kilometers. That is not administration. That is a taxonomy of distrust — and every line on the map was drawn to keep you separated from someone the system needs you to fear.",
    pullQuote: "The administrative boundary does not follow the logic of efficient service delivery. It follows the logic of ensuring that communities that might develop civic solidarity instead remain administratively separate, politically distinct, and economically dependent on different patron networks.",
    tags: ["Municipalities", "Gerrymandering", "Sectarianism", "Administrative Reform"],
    relatedSlugs: ["cartel-in-the-costume-of-a-country", "the-cartel-board-meeting", "the-service-state"],
    notes: [
      { id: 1, text: "Executive Magazine reporting on Lebanon's 2025 municipal elections documented that municipalities have multiplied 'often due to political considerations rather than clear administrative planning.'" },
      { id: 2, text: "Connecticut has 169 municipalities for a population roughly half the size of Lebanon's. France, sixty times the land area, organizes local governance through a rational administrative hierarchy." },
    ],
    sections: [
      {
        paragraphs: [
          "Lebanon has approximately 1,100 municipalities on 10,452 square kilometers. That is not administration. That is a taxonomy of distrust — and every line on the map was drawn to keep you separated from someone the system needs you to fear.",
          "Connecticut has 169 municipalities for a population half the size of Lebanon's. France — sixty times the land area, fifteen times the population — organizes local governance through a rational administrative hierarchy. Lebanon, on a strip of land smaller than Jamaica, has fragmented itself into more than a thousand units of local authority, plus twenty-six districts, nine governorates, eighteen sectarian personal status jurisdictions, and 1,623 cadastral boundaries. Each layer of fragmentation is a layer of political management. Each administrative boundary is a fence.",
          "The number was not always 1,100. It has grown. Lebanon's municipalities have multiplied, as one industry report put it, 'often due to political considerations rather than clear administrative planning.' The polite way of saying: every time a za'im needed a new personal fiefdom, or a village's demographic mix shifted in a way that threatened someone's local control, a new municipality was carved out. The boundary was not redrawn because geography demanded it. The boundary was redrawn because the political economy of fragmentation demanded it.",
        ],
      },
      {
        heading: "Gerrymandering at Depth",
        paragraphs: [
          "Consider what an administrative boundary actually controls in Lebanon. Your municipality determines your property registry — who holds the deeds, who processes transfers, who can complicate or facilitate transactions depending on who you are and who your neighbors are. It determines your waste management — which is why Beirut's garbage crisis of 2015 was not a technical failure but a political one: the municipality politics of where to site a landfill produced a standoff that left garbage in the streets for months. It determines your electoral district's specific composition — who you vote with, which community bloc you are aggregated into.",
          "The electoral law, revised in 2017, translates municipal geography into something approaching an art form of political manipulation. Fifteen electoral districts, each with its own confessional arithmetic, each drawn so that a Shia vote in Beirut counts differently from a Shia vote in Baalbek, and a Christian vote in Zahle counts differently from a Christian vote in Metn. The mathematical complexity is not accidental. It was designed by the political class that benefits from it, to produce the one outcome that every design choice consistently serves: ensuring that no cross-confessional coalition can consolidate enough seats to challenge any major franchise holder.",
          "This is gerrymandering at a depth the American version does not approach. In the United States, gerrymandering redraws voting districts. In Lebanon, gerrymandering redraws life. Your mayor, your property registry, your schools, your waste collection, your cemetery — all of it organized by boundaries designed to separate you from people the political class needs you not to cooperate with.",
        ],
      },
      {
        heading: "The Map as Prescription",
        paragraphs: [
          "The fractal dimension is what makes Lebanon's fragmentation distinctive. The pattern replicates at every scale. At the national level: eighteen sects, each with a distinct legal personality. At the regional level: nine governorates with overlapping jurisdictions. At the district level: twenty-six units, each a political battlefield between neighboring za'ims. At the municipal level: 1,100 units, each a patronage territory. At the neighborhood level: distinct sectarian enclaves within municipalities, each with informal governance structures. At the building level: committees, generator arrangements, security watches. At the family level: clan structures that operate as political units in local elections. Sovereignty has collapsed inward through every organizational layer until it lodges in the individual household.",
          "The reform agenda for administrative fragmentation is clear and has been for decades: consolidate municipalities from 1,100 to 200 or fewer, organize them into rational service delivery units, merge district authorities, rationalize cadastral registration, create administrative units large enough to deliver services efficiently. This agenda has been tabled in every serious Lebanese reform discussion since at least the 1990s. It has never advanced because administrative consolidation would destroy dozens of mini-fiefdoms that local politicians have built their careers on, eliminate hundreds of patronage positions that za'ims use to reward loyalists, and force communities that the political system has organized to distrust each other into shared governance.",
          "The political class does not oppose administrative reform because it is inefficient. It opposes it because efficiency is not the point. The seventeen countries wearing a trenchcoat have 1,100 zipcodes and eighteen court systems and nine governors and 128 parliamentarians elected to represent a citizen body they have spent eighty years organizing to prevent from existing. The map is not a description of Lebanon. It is a prescription for it.",
        ],
      },
    ],
  },
  {
    slug: "the-cartel-board-meeting",
    title: "The Cartel Board Meeting",
    dek: "The founding document of Lebanon was not written, was not voted on, and was not a social contract. It was a private deal between two men.",
    byline: "Karim Salam",
    date: "May 1, 2026",
    readTime: "9 min read",
    category: "Political Economy",
    excerpt: "The founding document of Lebanon was not written, was not voted on, and was not a social contract. It was a private deal between two men dividing a country between their communities. Lebanon has been governed by that deal's logic for eighty years.",
    pullQuote: "The founding document of Lebanon is a cartel agreement. A mafia sit-down masquerading as a constitution. The citizen appears nowhere in this arrangement.",
    tags: ["National Pact", "Constitutional History", "Political Economy", "Sectarianism"],
    relatedSlugs: ["cartel-in-the-costume-of-a-country", "what-taif-actually-said", "the-seventeen-countries"],
    notes: [
      { id: 1, text: "The 1943 National Pact was a verbal agreement reached between President Bechara el-Khoury and Prime Minister Riad el-Solh. It was not put to a referendum, not debated in the elected chamber, and not written into any legal instrument." },
      { id: 2, text: "The 2022 Lebanese parliamentary elections produced 13 'change MPs' — independent members not affiliated with major sectarian franchise holders. As of 2026, none of their reform bills have cleared committee." },
    ],
    sections: [
      {
        paragraphs: [
          "The founding document of Lebanon was not written, was not voted on, and was not a social contract. It was a private deal between two men dividing a country between their communities. Lebanon has been governed by that deal's logic for eighty years.",
          "In 1943, Bechara el-Khoury, the Maronite president, and Riad el-Solh, the Sunni prime minister, reached an agreement over the terms of Lebanese independence. The agreement covered everything: which community would hold which office, how parliamentary representation would be divided, what Lebanon's foreign policy orientation would be. The Christians would give up their attachment to France. The Muslims would give up their aspiration toward Arab unity. Together, they would build a country. The terms were understood. None of this was written down.",
          "The founding document of Lebanon is an oral agreement between two unelected representatives of two communities who had no mandate from either community to make the decisions they made, ratified by no referendum, subject to no legal challenge, and enforceable by nothing except the mutual interest of the franchise holders who inherited it. Every Lebanese constitution since — every Taif amendment, every legislative session, every cabinet formation — is a footnote to that conversation. The cartel agreement is the operating system. Everything else runs on top of it.",
        ],
      },
      {
        heading: "A Cartel Agreement, Not a Social Contract",
        paragraphs: [
          "A cartel agreement has specific features that distinguish it from a social contract. A social contract is between citizens and their state. A cartel agreement is between producers who have agreed to divide a market among themselves. It specifies territory — who sells to whom and where. It specifies pricing — what each member extracts from the common resource pool. It specifies enforcement — what happens when a member defects. The National Pact does all three: it specifies confessional territory permanently, it specifies extraction ratios, and it specifies enforcement through the mutual interest of all franchise holders in maintaining the system. The citizen appears nowhere in this arrangement.",
          "This origin story matters for understanding why Lebanese reform is systematically impossible from within the system. Reformers who enter the Lebanese parliament expecting to change it are operating in an institution whose fundamental design purpose is to prevent exactly what they intend. The parliament is not a deliberative body for the Lebanese people. It is the cartel board meeting, where the franchise holders negotiate their shares. A reform MP elected to the parliament is present at a meeting she has not been invited to and whose actual business she is not party to.",
          "The cartel's internal logic explains what would otherwise be baffling: why Lebanese political actors who publicly despise each other, who accuse each other of treason and corruption, reliably unite when the fundamental arrangement is threatened. Hezbollah and the Lebanese Forces — organizations whose political and military histories are a story of sustained mutual antagonism — agreed on exactly one thing during the 2019 uprising: it had to stop. Nabih Berri and Walid Jumblatt, who fought each other's communities in the 1980s, have cooperated reliably on every measure that protects the parliamentary power-sharing formula since 1992. This is not hypocrisy. It is rational self-interest within a cartel framework.",
        ],
      },
      {
        heading: "The Closed Loop",
        paragraphs: [
          "The strongest counter-argument to the cartel framing is that the National Pact represented a genuine attempt at inter-communal accommodation — that Khoury and Solh were trying to build a workable state out of genuinely divided communities, and that the confessional arrangement was the best available option given the political reality of 1943. This argument has merit. Lebanon is a genuinely plural society. The communities are real. Their interests are genuinely different. Some form of power-sharing was probably unavoidable.",
          "The critique is not that power-sharing was chosen. The critique is that the specific form it took — unwritten, undemocratic, unamendable in practice despite being theoretically amendable, self-reinforcing through the service dependency it created — was designed to serve the franchise holders rather than the communities they claimed to represent. A genuine inter-communal accommodation would have been written down, ratified democratically, subject to regular review, and designed with mechanisms for evolving toward civic citizenship as trust developed. The National Pact was none of these things.",
          "Eighty years later, Lebanon is governed by the verbal agreement of two men in 1943. The franchise holders have changed faces and sometimes families. The deal has not changed. It cannot change from inside itself. The institution designed to prevent the renegotiation of the deal cannot renegotiate the deal. Constitutional problems require constituent power — the power of a people to reconstitute their political arrangements from outside the existing framework. Lebanon has not yet generated that power. The question is not whether it can. The question is whether the arrangement can survive long enough for it to.",
        ],
      },
    ],
  },
  {
    slug: "cartel-in-the-costume-of-a-country",
    title: "The Cartel in the Costume of a Country",
    dek:
      "The phrase failed state flatters a machine that has remained exacting, profitable, and deliberately weak for decades.",
    byline: "Karim Salam",
    date: "May 26, 2025",
    readTime: "12 min read",
    category: "Featured Essay",
    excerpt:
      "Lebanon is not a state that wandered into collapse. It is a franchise for organized impotence, dressed in the language of governance and billed to the public as national life.",
    pullQuote:
      "The state is not a government. It is a costume worn by a cartel of competing monopolies.",
    tags: ["Power", "State", "Political Economy"],
    relatedSlugs: [
      "the-seventeen-countries-wearing-a-trenchcoat",
      "the-dog-river-remembers",
      "the-architecture-of-consolation",
    ],
    notes: [
      {
        id: 1,
        text:
          "World Bank, Lebanon Economic Monitor: The Great Denial, for the scale of the financial collapse and the social contraction that followed.",
      },
      {
        id: 2,
        text:
          "IMF staff reports on Lebanon for the banking losses, public finance crisis, and delayed reform architecture.",
      },
      {
        id: 3,
        text:
          "Melani Cammett's work on sectarianism and welfare provision remains essential for understanding how parties substituted themselves for the state.",
      },
      {
        id: 4,
        text:
          "Lebanese budget reporting and army funding analysis illustrate how little sovereign capacity is built compared with what is extracted.",
      },
      {
        id: 5,
        text:
          "Research threads in the local archive on generator cartels, banking secrecy, and cabinet complicity inform the structural framing of this essay.",
      },
      {
        id: 6,
        text:
          "The argument here draws on comparative readings of cartelized states and rent systems rather than on a single institutional source.",
      },
    ],
    sections: [
      {
        paragraphs: [
          "There is a wearying comfort in the phrase failed state. It makes a system sound unlucky. It lets diplomats speak in the grammar of weather and erosion. Something faltered. Something slipped. Something could not cope. In Lebanon, that language obscures more than it explains.",
          "Lebanon has not failed at its true function. It has performed it with remarkable discipline. The state has been kept weak enough to prevent the emergence of a sovereign center, but visible enough to invoice the public in the name of citizenship. Ministries remain. Elections recur. Flags hang. Cabinets assemble. Behind the scenery, the real work is done by factions that treat the republic as a revenue model with ceremonial furniture.",
          "The phrase failed state comforts outside observers because it preserves the delusion of incompetence. It asks us to believe that vanished deposits, ruined infrastructure, and a hollow army are merely the fallout of bad management. That story collapses the moment one looks at the incentives. The machine does not malfunction when the public sphere withers. It is paid through that withering.",
        ],
      },
      {
        heading: "The Delusion of Incompetence",
        paragraphs: [
          "A median wage collapsing into humiliation does not happen by accident. A banking system does not vaporize the savings of a generation because nobody was watching the spreadsheets closely enough. The disappearance of public wealth in Lebanon belongs to the category of harvest, not error. It is extraction carried out behind institutional curtains and explained afterward as tragedy.",
          "The great trick of the postwar order was to teach the public to confuse fragility with weakness. Fragility suggests vulnerability. Weakness suggests incapacity. The system is neither vulnerable nor incapable in the way its defenders imply. It has been capable of protecting rents, preserving elite mobility, funding patronage, and starving any institution that might rival the franchise. That is a great deal of competence concentrated in the wrong moral direction.",
          "The political class still performs opposition as theater. Hezbollah points outward. Its domestic rivals point back at Hezbollah. Each claims to name the source of paralysis. Each sits close enough to the treasury to know how thoroughly the same paralysis enriches them both. The quarrel is public. The plunder is administrative. Their argument is the soundtrack laid over the robbery.",
        ],
      },
      {
        heading: "The Threat of a Functioning State",
        paragraphs: [
          "If one wants to know what the ruling order truly fears, one should look at what it refuses to build. Lebanon still imports, still consumes, still circulates cash, still converts diaspora sacrifice into local survival. The money exists. It passes through ports, border economies, private generators, elite schools, luxury brokers, and informal monopolies. Yet the army remains structurally underfunded, public infrastructure remains ceremonial, and the legal architecture of accountability is kept deliberately thin.",
          "That choice is the key. A professional army, a tax system with reach, a court system with courage, and an energy policy built for citizens rather than cartel tributaries would not merely improve the republic. They would end the franchise. A genuine state would interfere with too many profitable arrangements at once. It would close quarries, inspect ports, tax private empires, and narrow the space where factional sovereignty pretends to be community defense.",
          "This is why the public is invited into a permanent argument about existential symbols while everyday theft continues untouched. As long as the nation is kept in a heightened state of civilizational panic, citizens can be taught to accept pickpocketing as the price of belonging. Fear is cheaper than reform. Chaos is cheaper than sovereignty. Resilience is cheaper than justice.",
        ],
      },
      {
        heading: "The Franchise and Its Future",
        paragraphs: [
          "The system endures by persuading each community that survival depends on factional custody. It trains every grievance back through sect, every service back through patronage, every injury back through a leader who promises shelter while charging rent. The result is a public that remains politically awakened and institutionally orphaned at the same time.",
          "No single election cycle will cure that arrangement. It will not be solved by better rhetoric from within the same architecture. The country requires a different imagination of political belonging, one that begins before government and lasts longer than cabinet arithmetic. It requires the slow construction of a civic center that factions cannot fully digest.",
          "The cycle will continue until the public stops asking which warlord will manage the ruins more delicately and begins asking why the ruins were made profitable in the first place. The state that belongs to its citizens has never been permitted to stand between the sea and the mountain. That absence is the central fact of modern Lebanese life. Naming it clearly is the first small act of repair.",
        ],
      },
    ],
  },
  {
    slug: "the-seventeen-countries-wearing-a-trenchcoat",
    title: "The Seventeen Countries Wearing a Trenchcoat",
    dek:
      "Sectarianism in Lebanon is not a defect draped over the state. It is the machinery through which political life is sorted, rationed, and indefinitely prolonged.",
    byline: "Karim Salam",
    date: "May 22, 2025",
    readTime: "10 min read",
    category: "Essay",
    excerpt:
      "Lebanon does not merely suffer from sectarian fragmentation. It administers identity, welfare, law, and power through it.",
    pullQuote:
      "The citizen remains a legal fiction while the confession remains the true unit of political existence.",
    tags: ["Power", "Sectarianism"],
    relatedSlugs: [
      "cartel-in-the-costume-of-a-country",
      "same-grief-for-three-thousand-years",
    ],
    notes: [
      {
        id: 1,
        text:
          "Draws on archived research about municipalities, parliamentary quotas, and the long afterlife of the National Pact.",
      },
    ],
    sections: [
      {
        paragraphs: [
          "To call sectarianism Lebanon's problem is still too gentle. Sectarianism is the country's administrative grammar. It tells the state how to recognize a person, how to divide a chamber, how to deliver a favor, how to bury a body, and how to delay reform without ever admitting refusal.",
          "The public argument usually treats confessionalism as an overheated sentiment. In practice it is a distribution system. Representation is allocated through it, welfare is distributed through it, and foreign patronage enters the country through its doors. Every faction claims to defend a community. Every community is made more dependent by that defense.",
          "The result is a state that can continue multiplying offices, districts, municipalities, courts, and political rituals while still failing to form a shared civic center. Fragmentation is not collateral damage. It is the design principle.",
        ],
      },
      {
        heading: "The Map as Method",
        paragraphs: [
          "Lebanon's administrative splintering reveals the nature of the game. Tiny territorial units, sectarian balancing, and legal asymmetry do not produce efficiency. They produce sorting. They make it harder for a citizen to appear as a citizen at all. One appears as a client, a sectarian subject, a resident of a protective enclosure.",
          "Every serious cure therefore touches identity law, electoral law, and the architecture of service provision at once. Anything less simply rearranges the factions while leaving the underlying grammar intact.",
        ],
      },
    ],
  },
  {
    slug: "the-dog-river-remembers",
    title: "The Dog River Remembers",
    dek:
      "Conquerors keep carving their certainty into Lebanese stone. The land keeps turning certainty into a future ruin.",
    byline: "Karim Salam",
    date: "May 18, 2025",
    readTime: "9 min read",
    category: "Essay",
    excerpt:
      "Every army that enters Lebanon imagines itself to be the decisive force in the sentence. The country persists like the paragraph around it.",
    pullQuote:
      "The mountains do not answer ambition with argument. They answer it with duration.",
    tags: ["War", "History"],
    relatedSlugs: [
      "cartel-in-the-costume-of-a-country",
      "the-architecture-of-consolation",
    ],
    notes: [
      {
        id: 1,
        text:
          "Developed from the Nahr el Kalb and dragonfly research threads in the archive.",
      },
    ],
    sections: [
      {
        paragraphs: [
          "North of Beirut, conquerors have spent centuries carving declarations of victory into stone. The inscriptions survive. The certainty that produced them does not. There is no cleaner summary of Lebanon's political geography than that contrast between permanence and misreading.",
          "Foreign projects enter this coast convinced they are arriving to reorder a place. They leave having been reordered by it. The cost is rarely immediate. The land invites, absorbs, corrupts, delays, and eventually humiliates. What looked like military initiative gradually becomes logistical fatigue, then political attrition, then a private question about why the operation still exists.",
          "The problem is not mysticism. It is structure. Lebanon is small enough to tempt intervention and fractured enough to absorb it into local rivalries. No conqueror arrives alone. Each enters a field already layered with memory, patronage, grievance, and informal sovereignties.",
        ],
      },
    ],
  },
  {
    slug: "the-architecture-of-consolation",
    title: "The Architecture of Consolation",
    dek:
      "A public park in Beirut can become more than landscape. It can refuse the urban grammar of humiliation.",
    byline: "Karim Salam",
    date: "May 13, 2025",
    readTime: "8 min read",
    category: "Essay",
    excerpt:
      "In a city hollowed by extraction and spectacle, the right to dwell in common becomes a political act.",
    pullQuote:
      "The right to sit, remain, and belong is one of the few civic rights a failed public realm still exposes.",
    tags: ["City", "Memory"],
    relatedSlugs: [
      "cartel-in-the-costume-of-a-country",
      "same-grief-for-three-thousand-years",
    ],
    notes: [
      {
        id: 1,
        text:
          "Adapted from the Beirut park and civic memory materials in RESEARCH 2.",
      },
    ],
    sections: [
      {
        paragraphs: [
          "Cities are not only containers for movement. They are containers for memory. When Beirut loses another public room, another market texture, another patch of common shade, the loss registers politically before it is fully noticed aesthetically.",
          "A park in this context is not ornamental. It is one of the few spaces where a citizen can still appear without needing to purchase permission. That is why design choices matter. A corridor produces transit. A room produces civic life.",
          "The challenge is to build something contemporary without repeating the amnesia of prestige urbanism. A public space can inherit from the orchard, the courtyard, the stone path, and the measured shade of Levantine dwelling without turning into nostalgia. That inheritance is a living civic tool.",
        ],
      },
    ],
  },
  {
    slug: "same-grief-for-three-thousand-years",
    title: "The Same Grief for Three Thousand Years",
    dek:
      "The rituals of mourning in the Levant keep changing names while preserving older structures of memory, lament, and public witness.",
    byline: "Karim Salam",
    date: "May 9, 2025",
    readTime: "11 min read",
    category: "Essay",
    excerpt:
      "Theologians replace vocabulary more easily than societies replace ritual memory.",
    pullQuote:
      "A people can exchange gods more quickly than it exchanges the choreography of grief.",
    tags: ["Culture", "History"],
    relatedSlugs: [
      "the-seventeen-countries-wearing-a-trenchcoat",
      "the-dog-river-remembers",
    ],
    notes: [
      {
        id: 1,
        text:
          "Informed by the archive's work on Canaanite continuity, feminine archetypes, and ritual mourning.",
      },
    ],
    sections: [
      {
        paragraphs: [
          "Public grief in the Levant often arrives wearing the language of the present while moving through gestures older than the present can remember. Chests are struck, names are repeated, a figure is mourned, and the living discover themselves arranged inside a ritual older than doctrine.",
          "This continuity matters because it undermines the tidy sectarian fantasy that every community arrived with sealed civilizational content. The region's deepest rituals do not respect modern partitions so easily. They seep.",
          "To write this continuity clearly is not to collapse theological difference. It is to notice that the land keeps preserving forms even when regimes of explanation change around them.",
        ],
      },
    ],
  },
  {
    slug: "memorycide-on-the-coast",
    title: "Memorycide on the Coast",
    dek:
      "When archives vanish, ruins are privatized, and heritage is traded as inventory, erasure becomes an instrument of political design.",
    byline: "Karim Salam",
    date: "May 4, 2025",
    readTime: "8 min read",
    category: "Essay",
    excerpt:
      "A society can be robbed twice: once of wealth, then of the memory required to name the robbery.",
    pullQuote:
      "Erase enough of a people's material past and you can rent them a counterfeit inheritance.",
    tags: ["Memory", "Culture"],
    relatedSlugs: [
      "same-grief-for-three-thousand-years",
      "the-architecture-of-consolation",
    ],
    notes: [
      {
        id: 1,
        text:
          "Built from archive threads on looted heritage, pre-Christian memory, and institutional erasure.",
      },
    ],
    sections: [
      {
        paragraphs: [
          "There is more than one way to loot a country. One can remove statues, tablets, fragments, and reliefs. One can also leave the objects behind while stripping them of public meaning, institutional context, and civic access.",
          "The destruction of memory rarely arrives with the blunt honesty of iconoclasm. It often arrives as redevelopment, private custodianship, or a convenient doctrine of historical irrelevance. What disappears is the substrate that lets a people say: this was ours, and we still know how to read it.",
        ],
      },
    ],
  },
];

const fallbackLetters: Letter[] = [
  {
    slug: "letter-from-beirut-about-normality",
    title: "What We Keep Inventing as Normal",
    location: "Gemmayzeh, Beirut",
    date: "May 25, 2025",
    readTime: "5 min read",
    excerpt:
      "The city does not return to normal. It produces smaller routines that impersonate it.",
    body: [
      "You can learn a lot about a country by standing still outside a bakery after a crisis. Every person in line is already negotiating with absence. They ask about flour, fuel, medicine, rent, the cousin abroad, the price of endurance. Then they buy bread and call the performance ordinary.",
      "We have become specialists in producing usable fragments of calm. It is not that the country has stabilized. It is that people have learned how to move through instability with astonishing procedural grace. That grace deserves admiration and suspicion in equal measure.",
      "The danger in mastering adaptation is that the exceptional becomes domestic. What should provoke a rupture becomes an anecdote with a receipt attached. We do not return to normal. We design a smaller version of it each week and act grateful for the draft.",
    ],
  },
  {
    slug: "letter-to-a-friend-about-staying",
    title: "On Staying, On Leaving",
    location: "Beirut",
    date: "May 19, 2025",
    readTime: "4 min read",
    excerpt:
      "Every departure carries the accusation that the leaver has seen the truth more clearly than the one who remains.",
    body: [
      "A friend asked whether staying still counts as a decision when departure has become a social genre. I told him staying is never passive here. It is simply less legible. Leaving comes with airports, contracts, and photographs. Staying comes with tiny renewals no one romanticizes correctly.",
      "People imagine the country drives everyone away through one large betrayal. More often it does it through repetition. A form that should have taken two days requires two months. A bill arrives. A salary shrinks. A road closes. A parent ages. One does not leave because of a single event. One leaves because the future begins to feel like unpaid clerical work.",
      "And still, those who remain keep building forms of attachment that are neither blind nor naive. It is possible to see the machinery clearly and refuse exile anyway. The decision still has a cost. It also has a vocabulary of loyalty that policy analysis can never quite hold.",
    ],
  },
  {
    slug: "letter-from-the-shoreline",
    title: "A Shoreline Keeps Better Records",
    location: "Beirut Coast",
    date: "May 12, 2025",
    readTime: "3 min read",
    excerpt:
      "The sea stores the city's habits with more patience than its institutions do.",
    body: [
      "Stand on the coast long enough and you begin to understand why Beirut can survive its planners. The sea is stubborn. It keeps receiving towers, wars, corniches, fantasies of modernity, and temporary empires. It keeps putting them on the same horizon line.",
      "This is not consolation. It is scale. A country that lives on announcements needs at least one element that does not care about speech. Water is useful that way.",
    ],
  },
  {
    slug: "letter-on-small-authorities",
    title: "Notes on Small Authorities",
    location: "Tripoli",
    date: "May 5, 2025",
    readTime: "4 min read",
    excerpt:
      "The republic is experienced less through doctrine than through a thousand tiny permissions.",
    body: [
      "The daily country is built from miniature sovereignties. The man controlling the generator line. The clerk who can accelerate your file. The party office that can place a nephew. The school director who knows whom to call. Every one of them is administering a fraction of the state while claiming not to be the state at all.",
      "That is why reform sounds abstract in Lebanon. People do not only face ideology. They face a distributed archipelago of small authorities that convert inconvenience into power. The large speeches matter less than the local toll booths.",
    ],
  },
];

const fallbackNotebookEntries: NotebookEntry[] = [
  {
    slug: "beirut-april",
    title: "Beirut, April",
    date: "May 20, 2025",
    excerpt:
      "The port and the river still interrupt each other the way two unfinished arguments do.",
    body: [
      "Morning light on concrete can make even a damaged city look briefly unanimous.",
      "Some neighborhoods are held together by exhaust, memory, and stubborn retail.",
      "The city does not conceal its joins. That may be one of its last civic virtues.",
    ],
    size: "large",
  },
  {
    slug: "paper-grain-and-power",
    title: "Paper Grain and Power",
    date: "May 15, 2025",
    excerpt:
      "A rough sheet carries authority differently than a polished screen.",
    body: [
      "Printed matter slows the sentence just enough to make rhetoric answerable to texture.",
      "Every publication chooses whether it wants to sound processed or carried.",
    ],
    size: "medium",
  },
  {
    slug: "raouche-1975",
    title: "Raouche, 1975",
    date: "May 8, 2025",
    excerpt:
      "Some coastlines stop being scenery and become testimony.",
    body: [
      "A photograph of the sea is never only a photograph of the sea here.",
      "It is also a ledger of who built too close, who fled inland, who stayed visible.",
    ],
    size: "small",
  },
  {
    slug: "on-discipline",
    title: "On Discipline",
    date: "May 2, 2025",
    excerpt:
      "Discipline is choosing what deserves repetition before repetition chooses you.",
    body: [
      "A country with too much improvisation produces a secret hunger for form.",
      "The answer is not severity. It is rhythm with moral direction.",
    ],
    size: "small",
  },
  {
    slug: "the-city-at-dusk",
    title: "The City at Dusk",
    date: "April 28, 2025",
    excerpt:
      "Wires, balconies, and sea haze make their own accidental script at sundown.",
    body: [
      "The city becomes most legible at the hour when almost nothing is fully visible.",
    ],
    size: "medium",
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractSectionBlock(content: string, startHeading: string, endHeading?: string) {
  const start = content.indexOf(startHeading);

  if (start === -1) {
    return "";
  }

  const fromStart = content.slice(start + startHeading.length);

  if (!endHeading) {
    return fromStart.trim();
  }

  const end = fromStart.indexOf(endHeading);

  return (end === -1 ? fromStart : fromStart.slice(0, end)).trim();
}

function extractField(block: string, label: string) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = block.match(new RegExp(`\\*\\*${escapedLabel}:\\*\\*\\s*(.+)`));
  return match?.[1]?.trim() ?? "";
}

function extractBody(block: string) {
  const bodyMarker = "**Full body:**";
  const start = block.indexOf(bodyMarker);

  if (start === -1) {
    return [];
  }

  return block
    .slice(start + bodyMarker.length)
    .trim()
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

function extractNotes(block: string) {
  const notesMarker = "**Suggested footnotes/citations:**";
  const bodyMarker = "**Full body:**";
  const notesStart = block.indexOf(notesMarker);
  const bodyStart = block.indexOf(bodyMarker);

  if (notesStart === -1 || bodyStart === -1 || bodyStart <= notesStart) {
    return [];
  }

  const notesBlock = block
    .slice(notesStart + notesMarker.length, bodyStart)
    .trim();

  if (!notesBlock) {
    return [];
  }

  const lines = notesBlock
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    const cleaned = line.replace(/^\d+\.\s*/, "").trim();
    return {
      id: index + 1,
      text: cleaned,
    };
  });
}

function splitEntries(section: string) {
  return section
    .split(/^## /m)
    .slice(1)
    .map((entry) => {
      const [titleLine, ...rest] = entry.split("\n");
      return {
        title: titleLine.trim(),
        block: rest.join("\n").trim(),
      };
    });
}

function parseLaunchContent() {
  const launchPath = path.join(process.cwd(), "launch-content.md");

  if (!existsSync(launchPath)) {
    return null;
  }

  const content = readFileSync(launchPath, "utf8");

  const flagshipBlock = extractSectionBlock(content, "# Flagship Essay", "# Essays");
  const essayBlock = extractSectionBlock(content, "# Essays", "# Letters");
  const letterBlock = extractSectionBlock(content, "# Letters", "# Notebook");
  const notebookBlock = extractSectionBlock(content, "# Notebook", "# Source Notes");

  const flagshipEntries = splitEntries(flagshipBlock);
  const essayEntries = splitEntries(essayBlock);
  const letterEntries = splitEntries(letterBlock);
  const notebookEntries = splitEntries(notebookBlock);

  const parsedEssays: Essay[] = [...flagshipEntries, ...essayEntries].map(
    ({ title, block }, index) => {
      const actualTitle = extractField(block, "Final title") || title;
      const body = extractBody(block);
      return {
        slug: slugify(actualTitle),
        title: actualTitle,
        dek: extractField(block, "Dek"),
        byline: extractField(block, "Byline") || "Karim Salam",
        date: extractField(block, "Publication date"),
        readTime: extractField(block, "Estimated reading time").replace("minutes", "min read"),
        category: index === 0 ? "Featured Essay" : "Essay",
        excerpt: extractField(block, "Excerpt") || body[0] || "",
        pullQuote:
          extractField(block, "Pull quote").replace(/^"|"$/g, "") ||
          body[1] ||
          body[0] ||
          "",
        tags: extractField(block, "Topic tags")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        relatedSlugs: [],
        notes: extractNotes(block),
        sections: [
          {
            paragraphs: body,
          },
        ],
        heroStyle: index === 0 ? "art" : "image",
      };
    },
  );

  parsedEssays.forEach((essay, index) => {
    essay.relatedSlugs = parsedEssays
      .filter((_, innerIndex) => innerIndex !== index)
      .slice(0, 3)
      .map((candidate) => candidate.slug);
  });

  const parsedLetters: Letter[] = letterEntries.map(({ title, block }) => ({
    slug: slugify(title),
    title,
    location: extractField(block, "Location"),
    date: extractField(block, "Date"),
    readTime: extractField(block, "Estimated reading time").replace(
      "minutes",
      "min read",
    ),
    excerpt: extractField(block, "Excerpt"),
    body: extractBody(block),
  }));

  const parsedNotebookEntries: NotebookEntry[] = notebookEntries.map(
    ({ title, block }, index) => ({
      slug: slugify(title),
      title,
      date: extractField(block, "Date"),
      excerpt: extractField(block, "Short excerpt"),
      body: extractBody(block),
      size: index === 0 ? "large" : index < 3 ? "medium" : "small",
    }),
  );

  return {
    essays: parsedEssays,
    letters: parsedLetters,
    notebookEntries: parsedNotebookEntries,
  };
}

const parsedLaunchContent = parseLaunchContent();

export const essays = parsedLaunchContent?.essays.length
  ? parsedLaunchContent.essays
  : fallbackEssays;

export const letters = parsedLaunchContent?.letters.length
  ? parsedLaunchContent.letters
  : fallbackLetters;

export const notebookEntries = parsedLaunchContent?.notebookEntries.length
  ? parsedLaunchContent.notebookEntries
  : fallbackNotebookEntries;

function listEditorialImages() {
  const editorialDir = path.join(process.cwd(), "public", "editorial");

  if (!existsSync(editorialDir)) {
    return [];
  }

  function walk(directory: string, urlPrefix: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);
      const urlPath = `${urlPrefix}/${entry.name}`;

      if (entry.isDirectory()) {
        return walk(fullPath, urlPath);
      }

      if (editorialImageExtensions.has(path.extname(entry.name).toLowerCase())) {
        return [urlPath];
      }

      return [];
    });
  }

  return walk(editorialDir, "/editorial").sort((a, b) =>
    a.localeCompare(b, "en"),
  );
}

export const editorialImagePaths = listEditorialImages();

const claimedEditorialImages = new Set<string>();

function claimEditorialImage(keywords: string[], fallbackIndex: number) {
  if (!editorialImagePaths.length) {
    return undefined;
  }

  const normalizedKeywords = keywords.map(slugify).filter(Boolean);
  const availableImages = editorialImagePaths.filter(
    (imagePath) => !claimedEditorialImages.has(imagePath),
  );
  const keywordMatch = availableImages.find((imagePath) => {
    const basename = slugify(path.basename(imagePath, path.extname(imagePath)));
    return normalizedKeywords.some((keyword) => basename.includes(keyword));
  });

  const selected =
    keywordMatch ??
    availableImages[fallbackIndex % Math.max(availableImages.length, 1)] ??
    editorialImagePaths[fallbackIndex % editorialImagePaths.length];

  if (selected) {
    claimedEditorialImages.add(selected);
  }

  return selected;
}

function titleKeywords(title: string) {
  return slugify(title)
    .split("-")
    .filter((word) => word.length > 3);
}

const homeHeroImage = claimEditorialImage(
  ["home", "hero", "flagship", "beirut", "coast"],
  0,
);

const essayImages = Object.fromEntries(
  essays.map((essay, index) => [
    essay.slug,
    claimEditorialImage([essay.slug, ...titleKeywords(essay.title)], index),
  ]),
);

const letterImages = Object.fromEntries(
  letters.map((letter, index) => [
    letter.slug,
    claimEditorialImage(
      [
        letter.slug,
        "letter",
        "postmark",
        "paper",
        "archive",
        ...titleKeywords(letter.title),
      ],
      index,
    ),
  ]),
);

const notebookImages = Object.fromEntries(
  notebookEntries.map((entry, index) => [
    entry.slug,
    claimEditorialImage(
      [
        entry.slug,
        "notebook",
        "map",
        "paper",
        "archive",
        ...titleKeywords(entry.title),
      ],
      index,
    ),
  ]),
);

export const editorialImageMap = {
  homeHero: homeHeroImage ?? essayImages[essays[0]?.slug],
  authorMark: "/brand/la-editors-mark.png",
  essays: essayImages,
  letters: letterImages,
  notebook: notebookImages,
};

export function getEssay(slug: string) {
  return essays.find((essay) => essay.slug === slug);
}

export function getRelatedEssays(essay: Essay) {
  return essay.relatedSlugs
    .map((slug) => getEssay(slug))
    .filter((value): value is Essay => Boolean(value));
}
