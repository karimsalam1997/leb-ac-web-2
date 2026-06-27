from __future__ import annotations

import random
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A5
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)


OUT_DIR = Path("output/pdf")
OUT_DIR.mkdir(parents=True, exist_ok=True)
PDF_PATH = OUT_DIR / "makdisi-culture-of-sectarianism-reading-companion.pdf"
SOURCE_PATH = OUT_DIR / "makdisi-culture-of-sectarianism-reading-companion.txt"


TITLE = "The Culture of Sectarianism"
SUBTITLE = "A Chapter-by-Chapter Reading Companion"
AUTHOR = "After Ussama Makdisi"


CHAPTERS = [
    {
        "title": "Opening Note",
        "pages": "Preface and method",
        "sections": [
            (
                "Reader's Prelude",
                [
                    "Ussama Makdisi begins with Mount Lebanon after the war, and that matters. The book was published in 2000, after the Lebanese civil war had ended, yet the thing called sectarianism had not gone home. His question is simple enough to be dangerous: what if sectarianism is not the old disease that kept Lebanon from becoming modern, but one of the ways modernity itself arrived in the mountain?",
                    "The old answer, heard in Beirut drawing rooms, French archives, Ottoman memoranda, and later Lebanese schoolbook prose, is that Druzes and Maronites were trapped by ancient hatreds. Makdisi concedes why that answer has power. The massacres of 1860 were real, Dayr al-Qamar and Zahla were devastated, and thousands of Christians were killed. But the answer fails because it treats blood as evidence of timeless identity, when the book shows blood being organized by new institutions, new foreign patrons, new claims to equality, and new fears about who had the right to speak for a community.",
                    "This companion follows the book chapter by chapter. It does not replace Makdisi's prose. It gives you the spine of the argument, the people who carry it, and the historical machinery behind it, so that when you return to the original pages, you are not lost inside names and decrees. You can see the whole machine moving.",
                ],
            )
        ],
    },
    {
        "title": "1. Religion as the Site of the Colonial Encounter",
        "pages": "Original book pages 1-14",
        "sections": [
            (
                "The Scene",
                [
                    "Makdisi opens in Dayr al-Qamar in June 1860 with Salim Shawish trying to keep a Druze notable inside his house. Coffee is served. Gifts are offered. Outside, Christians are being killed and the old rules of protection are falling apart. The scene matters because it holds two worlds in the same room: the older world of hospitality, rank, and negotiated safety, and the newer world of sectarian war, where a neighbor can become a communal enemy before sunset.",
                    "Charles Churchill's grisly description of Sitt Naaify and the corpses gives Makdisi a second opening, a European text already turning Mount Lebanon into a spectacle of native savagery. Makdisi does not deny the horror. He concedes the massacre. Then he asks what Churchill's language hides. The violence of 1860 included a Druze attack on Christians, and it also carried a struggle inside Maronite and Druze society over representation, authority, status, and the meaning of religion in public life.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "The chapter lays out the book's central argument. Sectarianism, for Makdisi, is a modern practice and a modern language. It emerged from the meeting of European colonial pressure, Ottoman reform, missionary activity, local elite rivalry, and popular claims to rights. Religion had always mattered in Mount Lebanon, but the nineteenth century changed what religion was asked to do. It became the main public badge through which communities made political claims, demanded protection, claimed equality, and fought over land.",
                    "Makdisi pushes against two familiar stories. The first is the colonial story, heard from Lord Dufferin, Karl Marx, French Jesuits, and British observers, that Mount Lebanon's violence came from wild tribes and old religious passions. The second is the nationalist story, Ottoman, Arab, Turkish, and Lebanese in different forms, that sectarian violence was an ugly stain on an otherwise tolerant national past. In Beirut or Istanbul, that second story can sound comforting. Makdisi's point is sharper: both stories make sectarianism seem external to modern history, either as primitive survival or foreign contamination.",
                    "The Tanzimat reforms beginning in 1839 form the chapter's pressure point. The Ottoman state declared legal equality among subjects, including Muslims and Christians, while trying to preserve imperial sovereignty and social hierarchy. European diplomats interpreted the reforms as permission to intervene on behalf of Christians. Local Maronite and Druze elites saw new openings. Ordinary villagers later saw openings too. The same language of equality could mean imperial order in Istanbul, Christian protection in Paris, restored privilege for Druze notables, or liberation from lords for Maronite peasants in Kisrawan.",
                    "The chapter also defines Makdisi's method. He refuses to read colonial sources such as Churchill only as lies, and he refuses to read local sources only as authentic corrections. Instead, he reads European, Ottoman, and local Lebanese materials together. That is why the chapter moves from Dayr al-Qamar to Istanbul, from Damascus to London, from missionary print to Ottoman decree. The aim is to show how knowledge about sectarianism was made, circulated, and then mistaken for a description of something timeless.",
                ],
            ),
            (
                "Argument Map",
                [
                    "1860 is Makdisi's wound and his archive: Dayr al-Qamar, Zahla, Hasbayya, Rashayya, and Damascus reveal a new kind of violence that cannot be explained by old formulas alone.",
                    "Sectarianism is not a synonym for religion. In Makdisi's usage, it is the modern political use of religious heritage as the main basis for public identity.",
                    "European power and Ottoman reform did not simply impose sectarianism from outside. Local elites and commoners participated, argued, hoped, feared, and acted.",
                    "The book is a history of construction. It studies how people learned to see Mount Lebanon through sectarian categories, then fought as if those categories had always been there.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "For Lebanon, this chapter is a warning against the lazy sentence heard after every crisis from Beirut to Baabda: this is how we have always been. Makdisi's answer is colder. No. This is how a specific historical order was made, with names, dates, decrees, schools, consuls, bishops, governors, shaykhs, muleteers, and frightened villagers.",
                ],
            ),
        ],
    },
    {
        "title": "2. The Gentle Crusade",
        "pages": "Original book pages 15-27",
        "sections": [
            (
                "The Scene",
                [
                    "Alphonse de Lamartine looks at Sannin in 1832 and sees a sacred mountain floating above fog. Gerard de Nerval, Volney, Charles Churchill, Lady Hester Stanhope, Jesuit priests, and American missionaries all arrive with different temperaments, yet they share one habit: they look at Mount Lebanon and see a place waiting to be explained by Europe.",
                    "Makdisi calls this a gentle crusade because it came with pens, maps, schools, medicine, and sermons rather than armies. He concedes its gentleness in form. Then he cuts into the word crusade. These travelers and missionaries did not merely describe Mount Lebanon. They claimed the right to redeem it, classify it, rescue it from Ottoman Islam, and return it to a Christian or European time.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "The chapter follows the European invention of Mount Lebanon as a biblical refuge and a theater of reform. Volney, writing after his 1783 to 1785 travels, gives the early grammar: the Ottoman East is stagnant because of despotism and Islam, while Mount Lebanon contains a ray of liberty because of its Christians and its mountains. His Lebanon is already divided into communities with fixed traits. Maronites are survivors of a Christian refuge. Druzes are free mountaineers. Muslims belong to the world of despotism.",
                    "Lamartine adds a romantic and spiritual layer. In 1832, he enters the region through Scripture, longing, and a Europe he sees as exhausted. For Lamartine, the Maronites are almost a European colony stranded in Asia, capable of renewing Christian spirit. Lady Hester Stanhope, living in her own self-made Orient, makes the fantasy absurd and revealing. She is a British aristocrat acting as an Eastern queen, then telling Lamartine that the Orient is his true homeland. The local people are present, but the European imagination keeps speaking over them.",
                    "Makdisi then turns to the invention of tribes. European writers classified Maronites, Druzes, Greek Orthodox, Greek Catholics, Shi'a, and Sunnis into separate types, even when villagers shared customs, lands, patrons, and daily life. British and American writers found in the Druzes a kind of Scottish Highland romance, noble, warlike, free, and secretive. French Catholic writers increasingly saw the Maronites as natural clients of France. These descriptions borrowed from one another until they created a self-reinforcing archive.",
                    "The missionaries make the chapter more intimate. The Jesuits arrive in Beirut in the 1830s expecting an Orient that belongs to Catholic memory, then recoil when local Christians look, dress, speak, and live too much like their Muslim and Druze neighbors. Riccadonna's horror is not that Christianity is absent. His horror is that Christianity exists in a form he cannot control. The gentle crusade therefore becomes a project of purification: to separate Christians from the habits, festivals, languages, and neighborly life that made them local.",
                ],
            ),
            (
                "Argument Map",
                [
                    "European travelers turned Mount Lebanon into a biblical refuge before they understood it as a living society.",
                    "Missionaries treated local Christianity as corrupted because it was too close to Muslim and Druze daily life.",
                    "The classification of communities into separate tribes prepared later political and administrative divisions.",
                    "The chapter shows colonial imagination before colonial administration, the gaze before the decree.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "This chapter helps explain why later sectarian claims sounded so natural to foreign powers. By the time Ottoman officials and European diplomats discussed reform in the 1840s, the European reading public had already been taught to see Mount Lebanon as a land of separate religious peoples, waiting for France, Britain, Rome, or Protestant America to speak on their behalf.",
                ],
            ),
        ],
    },
    {
        "title": "3. Knowledge and Ignorance",
        "pages": "Original book pages 28-50",
        "sections": [
            (
                "The Scene",
                [
                    "The chapter begins with Bashir Shihab in exile, still receiving Halil Pasha with coffee, sherbet, and sweets. Asked how he ruled Mount Lebanon from 1788 to 1840, Bashir answers with force and a proverb about Abu Far, the bird that sees its morning shadow and imagines it can hunt a camel, then settles for mice by noon. It is a cruel little fable about ambition, scale, and limits.",
                    "Makdisi uses Bashir's answer to open the old regime. This was not a paradise of tolerance, and Makdisi is careful about that. There was violence, hierarchy, tax pressure, punishment, and humiliation. But the violence of that earlier world was not organized primarily through sectarian identity. It was organized through rank, family, land, obedience, and the distinction between those who claimed knowledge and those dismissed as ignorant.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "The chapter maps old-regime Mount Lebanon before the full arrival of reform. The region was not yet Lebanon as a nation. It sat across Ottoman provincial worlds, tied to Tripoli, Damascus, Sayda, Beirut, Acre, the Bekaa, and the Hawran. Dayr al-Qamar was a small but important artisanal town, full of looms, merchants, scribes, and links to Aleppo and Damascus. The mountain was connected, not sealed.",
                    "Power belonged to notable families. The Shihabs stood above the Abilam's, Arslans, Janbulats, Abu Nakads, Talhuqs, Khazins, Hubayshes, Hamadas, and others. The social order was genealogical. Districts were known through families and obligations, not through clean religious borders. A Maronite villager might live under a Druze lord. A Druze notable might endow a Christian monastery. The Shihab family itself crossed religious lines, and Bashir Shihab could appear Muslim to Muslims, Christian to Christians, and Druze to Druzes.",
                    "Makdisi does not pretend that religion was weak. Sacred boundaries mattered. Conversion could be treated as betrayal. Churches, monasteries, shrines, oaths, feasts, and clerical authority shaped everyday life. Yet religion was woven into a wider social order rather than standing alone as the basis of politics. The word ta'ifa could even refer to a family of rank as much as a religious sect. Public identity was thick and layered.",
                    "The chapter's title comes from the old division between knowledge and ignorance. The community of knowledge included notables, clerics, chroniclers, qadis, mudabbirs, and Ottoman officials. The ahali, ordinary villagers, were expected to work, pay, obey, and return to order after moments of unrest. Chroniclers recorded elite moves with detail and drama, while commoners appeared as crowds, rebels, subjects, or followers. They entered history when they disturbed it.",
                    "Punishment reveals the order most clearly. Notables were strangled, blinded, or mutilated in ways that destroyed their ability to appear as public men. Commoners were hanged, beaten, taxed, billeted, and disciplined. When villagers rebelled in 1821 against Bashir Shihab's levies, Abdullah Pasha treated them as weak subjects misled by seducers, not as political thinkers. Their rebellion was ignorance, not knowledge.",
                    "The old order also had its own time. Exile could end. A family name could be destroyed and later restored. Aman, pardon, could return people to the domain of obedience. Politics moved through cycles of rebellion, punishment, supplication, and restored rank. Makdisi ends the chapter by showing that European time, with its language of progress, would break into this older rhythm and make return far harder.",
                ],
            ),
            (
                "Argument Map",
                [
                    "Old-regime Mount Lebanon was hierarchical before it was sectarian in the modern political sense.",
                    "Rank mattered more than religion in elite politics, even while religious life remained serious and bounded.",
                    "The ahali were treated as politically ignorant, which made later popular claims to knowledge so alarming.",
                    "Sectarianism would mark a break in time, because it made religious identity a public political category that older society had not used in the same way.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "For any Lebanese reader, the chapter is useful because it breaks the nostalgia trap. The old order was not innocent. A peasant in Kisrawan or the Shuf did not live in some gentle mountain republic. But the old order's brutality worked through hierarchy and lordship, not through the later fiction that every person had to appear first as Maronite, Druze, Sunni, Shi'a, Greek Orthodox, or Greek Catholic.",
                ],
            ),
        ],
    },
    {
        "title": "4. The Faces of Reform",
        "pages": "Original book pages 51-66",
        "sections": [
            (
                "The Scene",
                [
                    "In 1831, Mehmed Ali's son Ibrahim Pasha marched into Syria and Mount Lebanon. By 1840, British, Ottoman, and Austrian power had expelled him, Bashir Shihab's long rule had fallen, and the old regime had lost the ruler who held much of its violence together. Reform came to Mount Lebanon with soldiers, consuls, promises, rifles, and arguments about rights.",
                    "The strongest opposing argument is that Egyptian rule and the Tanzimat merely disturbed older Druze-Maronite tensions. Makdisi grants that Egyptian conscription, disarmament, taxation, and the arming of Christians against Druzes mattered. But he refuses the deeper assumption. The sectarian order after 1840 was not simply reaction. It was produced by contradictory meanings of reform.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "Ibrahim Pasha's occupation centralized power with a severity Mount Lebanon had not known in the same way. He improved sanitation and security in some areas, but his regime demanded taxes, labor, disarmament, timber, minerals, and soldiers. His army treated Syria as a resource for Cairo. When Druzes in the Hawran rebelled against conscription in 1837 and 1838, Ibrahim used Christian villagers and Shihab allies against them, then punished the rebels with old Ottoman language dressed in modern military power.",
                    "The arming of Christians against Druzes has often been treated as the seed of later sectarian war. Makdisi's reading is more precise. Ibrahim did use religious difference, but within an older logic of loyalty and rebellion. Christians were armed because they were loyal in that moment. Druzes were called heretics because they rebelled. Once the rebellion ended, Ibrahim expected the old order to return. He granted aman, told Bashir Shihab to let bygones be bygones, and then tried to disarm the Christians. The religious distinction was meant to be tactical and temporary.",
                    "The Tanzimat changed that calculation. The Gülhane decree of 1839 declared equality before the law, while European powers treated that equality as an opening for intervention on behalf of Christians. Mount Lebanon became a test site for Ottoman modernity and European protection. The same words, legitimacy, liberty, equality, restoration, tradition, meant different things to every actor in the room.",
                    "The revolt of 1840 against Ibrahim united Druze, Maronite, Sunni, and Shi'a villagers at Antilyas, where rebels declared themselves of one mind and one voice. The Maronite Patriarch supported the popular uprising against Egyptian tyranny. Yet when the Egyptians fell and Bashir Shihab was removed, unity dissolved. Druze notables expected restoration of their lands and authority. Maronite villagers of Dayr al-Qamar believed the new age freed them from returning to Druze lordship. The Maronite Church wanted a Christian Shihab ruler. British agents such as Richard Wood had promised ancient privileges without defining whose privileges counted.",
                    "The violence of 1841 in Dayr al-Qamar is the chapter's decisive event. A hunting dispute on B'aqlin land widened into village combat, siege, and the beating of Bashir Qasim. Druze Nakad shaykhs killed Christians who had served them. Maronite villagers refused to become subjects of Druze lords again. Land, tax, memory, equality, and religion fused. For Makdisi, this is where the social, political, and religious fields become openly antagonistic.",
                    "Still, Makdisi refuses inevitability. After 1841, Maronite clergy and Druze notables still spoke, negotiated, and invoked older bonds. Families remained entangled. Christian villagers continued under Druze lords in many places. What changed was that compromise now had to pass through a new religious vocabulary. Restoration politics gave way to sectarian politics.",
                ],
            ),
            (
                "Argument Map",
                [
                    "Egyptian rule broke old arrangements by centralizing power and arming some villagers against others.",
                    "The Tanzimat made equality a political language, but no one agreed what equality meant in Mount Lebanon.",
                    "Druze notables understood restoration as the return of property and rank. Maronite villagers understood reform as release from subordination.",
                    "Dayr al-Qamar in 1841 marks the start of sectarian politics because religion, land, and social status became fused in public conflict.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "This chapter gives you one of Makdisi's most useful lessons for Lebanon: reform is never just a decree. In 1840, a word spoken in Istanbul could become a British promise, a Maronite demand, a Druze property claim, and a peasant refusal in Dayr al-Qamar. The same law could open four different futures.",
                ],
            ),
        ],
    },
    {
        "title": "5. Reinventing Mount Lebanon",
        "pages": "Original book pages 67-95",
        "sections": [
            (
                "The Scene",
                [
                    "After 1841, everyone claimed tradition. The Maronite Patriarch, Druze notables, British consuls, French diplomats, Ottoman officials, Jesuits in Ghazir, and American missionaries in Bhamdun all spoke as if they knew what Mount Lebanon really was. The trouble was that each of them needed a different past.",
                    "Makdisi concedes that order had to be restored after Dayr al-Qamar. But the cure became part of the illness. In December 1842, European pressure pushed the Ottoman state into partitioning Mount Lebanon into a Christian north and a Druze south, even though Christians lived in large numbers in the southern district and daily life had never fit the map they were drawing.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "The chapter studies how Mount Lebanon was politically and culturally remade after 1841. The central shift is from older elite geographies, based on families and districts, to a new sectarian geography, based on communities imagined as separate political peoples. European diplomats described the conflict as ancient tribal hostility. Ottoman officials also began to treat Druzes and Maronites as backward sects that needed discipline. Local elites learned to use that language for their own survival.",
                    "British officials such as Canning and Aberdeen argued for partition, while Ottoman officials warned that the population was too mixed. The British answer was revealing: mixed villages were an inconvenience to be managed. That word gives away the violence of the map. A lived society became an administrative problem. In 1842, Mount Lebanon was cut into two districts, a Christian kaymakamate and a Druze kaymakamate, with the southern district containing many Christian villages under a Druze label.",
                    "Local elites adapted. Druze notables presented themselves as spokesmen of a Druze community and defenders of old rights. The Maronite Church spoke in the name of the Maronite people, even though Greek Orthodox, Greek Catholics, secular Christian notables, and ordinary villagers did not always accept Maronite clerical leadership. Both sides claimed loyalty to the Sultan while courting European patrons. France became the second homeland of many Maronite arguments. Britain became a channel for Druze protection.",
                    "Bishop Nicolas Murad is the chapter's main author of sectarian imagination. His 1844 French text presented the Maronites as a Catholic nation, historically tied to France and destined to rule Mount Lebanon. Druzes appear in his account as latecomers, outsiders, backward, and dependent on Christians. Makdisi is not interested only in proving Murad wrong. He wants to show how Murad's style of argument, with genealogies, statistics, appendices, and French address, made a sectarian claim look modern, factual, and political.",
                    "Sekib Efendi's 1845 regulations tried to contain violence through a balance of communities. He kept the kaymakamates and added councils, judges, advisors, and representatives for recognized sects. He hoped to make Druzes and Maronites equal before the Ottoman order. Instead, he strengthened the idea that sect, people, and political identity were one. Even petty disputes were routed through communal categories. The state tried to stabilize the problem by teaching everyone to speak its language.",
                    "Missionaries deepened the change. Jesuits and American Protestants provided medicine, schooling, books, furniture, and access to European power. Parents wanted worldly education for their sons, and missionaries wanted spiritual reform. The compromise created modern education along sectarian lines. Maronite elites leaned toward Jesuit schools and France. Druze elites often worked with Protestant missionaries and British channels. Ghazir became a powerful symbol: students learned to admire France, fear Islamic surroundings, and see local mixed life as backward.",
                    "By the end of the chapter, Makdisi has shown that no single actor created sectarianism. European diplomats drew the map, Ottoman officials regularized it, Maronite and Druze elites used it, missionaries educated it, and local society absorbed it unevenly. The old community of knowledge split into separate sectarian communities of knowledge. The question left hanging is explosive: if elites now claim to speak for whole religious peoples, what happens when ordinary people decide to speak for those peoples themselves?",
                ],
            ),
            (
                "Argument Map",
                [
                    "The 1842 partition made sectarian geography official, even though the social geography of Mount Lebanon was mixed.",
                    "Murad's Maronite history and Druze counterclaims invented usable pasts for modern political demands.",
                    "Sekib Efendi's regulations sought peace through balance, but balance made sect the main administrative fact.",
                    "Missionary education produced new elites who linked progress to religious separation and European patronage.",
                    "The chapter ends by preparing the rise of Tanyus Shahin, because sectarian claims could no longer remain an elite monopoly.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "This chapter is the bridge between map and mind. It shows how a category becomes real: first a traveler writes it, then a consul repeats it, then a bishop arms it with history, then a regulation gives it office, then a school teaches children to desire it. By 1860, the sectarian order is still unstable, but it has acquired rooms, roads, seals, sermons, and exams.",
                ],
            ),
        ],
    },
    {
        "title": "6. The Return of the Juhhal",
        "pages": "Original book pages 96-117",
        "sections": [
            (
                "The Scene",
                [
                    "In December 1858, Tanyus Shahin, a muleteer from Rayfun, took command of a Maronite peasant rebellion in Kisrawan. His movement evicted the Khazin shaykhs, challenged the authority of the Maronite Patriarch, frightened the Ottoman governor Hursid Pasha, and made every notable in Mount Lebanon look again at the people they had long called ignorant.",
                    "Makdisi does not turn Shahin into a clean hero. He concedes the violence, coercion, looting, sectarian aggression, and personal ambition around the uprising. But he also refuses to let elite sources dismiss it as mere disorder. The Kisrawan revolt was a popular interpretation of the Tanzimat, and that made it dangerous.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "The chapter opens with a crisis of representation. The Khazin shaykhs insisted that they represented Kisrawan because their family had long ruled it. Shahin and the villagers insisted that the ahali had rights, interests, representatives, and a collective will. This was a direct attack on the old division between knowledge and ignorance. The juhhal, the so-called ignorant, were now writing petitions, choosing wakils, issuing threats, redistributing goods, and using the language of law.",
                    "The rebellion began in specific grievances: excessive dues, marriage taxes, humiliating gifts, beatings, the passing of shaykh tax burdens onto villagers, disputes over common grazing land, and compensation for money paid toward reforms that never arrived. Villagers demanded an end to old obligations and asked for representatives elected by the ahali. In one demand, they said the station of the shaykhs should be equal to theirs. That sentence terrified the old order.",
                    "The Khazins read the revolt as excitement, sedition, and manipulated ignorance. They could not accept that ordinary villagers had acted politically on their own. Some blamed bishops. Some blamed conspirators. The Maronite Patriarch Bulus Mas'ad was trapped. The Church wanted to present itself as the representative of a modern Maronite nation, but it was also a landowning institution tied to hierarchy and property. It could mediate, soften some abuses, and speak of rights, yet it could not bless a peasant assault on property and rank.",
                    "Shahin understood the opening that reform created. He signed as general representative of Kisrawan and later as representative of the Christians. He invoked the Tanzimat as freedom from bondage. He wrote to elites in blunt dialect, warning Emir Yusuf Ali Murad not to betray Christianity by siding with Druzes and notables. His letters offended because of their content and their tone. A muleteer was addressing emirs as if he knew the meaning of reform better than they did.",
                    "The revolt became more sectarian as it spread beyond Kisrawan. In Hammana, Christian villagers rejected the imposition of a Druze notable by pointing to the example of Ghazir and Kisrawan. In Jbayl, Shahin's followers attacked Shi'a villagers, and some Shi'a were reportedly forced toward conversion to be spared. Shahin's reputation as defender of Christian rights grew even as his movement crossed from social rebellion into religious aggression.",
                    "The Bayt Miri clash of August 1859 widened the fear. Bishop Awn reported how a small fight between a Druze and a Christian boy turned into armed confrontation. Elites on both sides tried to restrain their communities, but ordinary Christians appealed to Shahin and the shabab of Kisrawan for help. At Mdayrij, Druze and Christian notables tried to become one hand against the rebellious ahali, but Christian villagers refused to march against Kisrawan. The old elite solidarity could not simply be restored.",
                    "The chapter ends with a hard judgment. Shahin's populism was neither pure class politics nor simple religious fanaticism. It fused social equality, Christian protection, Tanzimat rights, anti-notable anger, and personal authority. It revealed the contradiction inside elite sectarianism: once leaders claimed to speak for a Christian or Druze community, they could no longer guarantee that villagers would accept elite control over the meaning of that community.",
                ],
            ),
            (
                "Argument Map",
                [
                    "Kisrawan turns the ahali from object into actor.",
                    "The Tanzimat language of equality becomes a weapon against Maronite notables and against religious inequality.",
                    "The Maronite Church is caught between communal leadership and defense of property.",
                    "Shahin's movement shows that sectarian identity contained class struggle rather than replacing it.",
                    "The title juhhal is reversed: those dismissed as ignorant now claim knowledge, law, and representation.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "This is one of the strongest chapters in the book because it makes Lebanese sectarianism social. It shows that a sect is never only a sect. Inside the Maronite name in Kisrawan were landlords, muleteers, priests, widows, merchants, bishops, hungry peasants, French flags, Lazarist papers, and a man from Rayfun who decided that reform had finally given the village a mouth.",
                ],
            ),
        ],
    },
    {
        "title": "7. The Devil's Work",
        "pages": "Original book pages 118-145",
        "sections": [
            (
                "The Scene",
                [
                    "In May and June 1860, the unrest of Kisrawan moved south toward the mixed districts, and fear became massacre. Christians marched from Kisrawan toward the Shuf. Druze fighters mobilized. Villages burned. Dayr al-Qamar, Zahla, Hasbayya, and Rashayya entered the archive as places of rout, killing, betrayal, and impossible testimony.",
                    "Makdisi concedes the horror with no romance. Druze forces killed thousands of Christians and destroyed Christian villages, churches, convents, and homes. Yet he refuses the old explanation that this was tribal hatred bursting through a thin surface. The violence itself must be read. It shows new boundaries being made by force.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "The chapter begins by naming the war's transgressive character. Earlier violence in Mount Lebanon had often been bounded by rank, family rivalry, and rituals of punishment. In 1860, those limits cracked. Common villagers acted without waiting for notables. Christian shabab formed militias and claimed to defend land and faith. Druze fighters killed Christians and Muslim Shihab emirs associated with Christian protection. The war did not simply express sectarian identity. It tried to create a pure version of it.",
                    "Before full war began, isolated killings worked like signals of a new geography. A Druze muleteer killed on a road, a Christian left alive with ears cut off, a rumor about molesting children, an ambush near Khan al-Warwar, each event taught people where they could no longer safely travel. Makdisi shows that fear moved faster than command. Sa'id Janbulat and Bishop Bustani might try to restrain their people, but every rumor weakened their authority.",
                    "The march of the Kisrawanites toward Nahr al-Kalb and Antilyas exposed the disorder inside the Christian camp. Shahin claimed to defend Christians of the mixed districts, but local Christians sometimes begged his men to go home, fearing that their arrival would provoke Druze expulsion. The Jesuits in Ghazir watched with despair as the Maronite nation they had imagined failed to appear. Church bells rang, appeals went out, Yusuf Karam arrived with men from the north, but the unified Christian ta'ifa remained more fantasy than army.",
                    "The Christian shabab matter because they turn social youth into political force. Wearing distinctive clothing and led by shaykh al-shababs, they claimed the right to defend village honor. Their masculinity challenged both Druze landowners and cautious Christian elites. Shahin's own followers pressed him to mobilize or be mocked. Honor, faith, fear, and reform all passed through the body of the armed young man.",
                    "The Druze victory brought another kind of purification. In conquered areas, Druze fighters burned Christian villages, looted homes, killed priests, destroyed Catholic institutions, and emptied mixed districts of Christians. Makdisi pays close attention to why Catholic spaces were attacked with such force. France, Jesuit schools, Maronite nationalism, and Christian mobilization had become linked in Druze fear. Protestant spaces and American missionaries were sometimes spared because they did not carry the same political meaning in Druze eyes.",
                    "The murder of Muslim Shihab emirs in Hasbayya is one of the chapter's most important moments. The Druze fighters killed them because they were associated with Christian defense. That act cannot be explained by simple Muslim-Christian categories. It was a strike against the old notable order. A Druze villager could now kill a Muslim emir because sectarian war had loosened the older protections of rank.",
                    "Makdisi does not erase moments of protection. Sa'id Janbulat protected some Christians. Sitt Nayfa protected women of the Shihab household. Druze families sheltered Christians, and Christians sheltered Druzes. These acts matter because they show that the old world had not vanished completely. But they could not stop the general movement toward segregation, because after each killing, safety seemed to require the absence of the other community.",
                    "The chapter ends with the restoration of social order after the Druze victory. Hursid Pasha, the Ottoman governor, framed the war as native savagery and pushed notables into a peace agreement based on letting bygones be bygones. Druze and Christian elites sealed a document that wrote the ahali out of history. The same ordinary people who had seized political action in Kisrawan and the mixed districts were ordered back to their place. The notables could disagree over almost everything except the need to silence the masses.",
                ],
            ),
            (
                "Argument Map",
                [
                    "1860 was a war over boundaries: social, religious, geographic, and moral.",
                    "Violence made new sectarian space by making travel, residence, and property dangerous across communal lines.",
                    "Christian unity failed to materialize, which exposed the fragility of Maronite communal claims.",
                    "Druze violence against Muslim Shihab emirs shows that sectarian war also broke the old hierarchy of rank.",
                    "The peace treaty restored elite control by treating popular action as ignorance and sedition.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "The chapter is hard to read because it does not allow comfort. It will not let the reader hide behind conspiracy, ancient hatred, or pure victimhood. In 1860, people made decisions in fear, ambition, vengeance, loyalty, faith, hunger, and panic. The horror was modern because it tried to turn mixed life into clean territory.",
                ],
            ),
        ],
    },
    {
        "title": "8. A Very Old Thing",
        "pages": "Original book pages 146-165",
        "sections": [
            (
                "The Scene",
                [
                    "After Mount Lebanon burned, Damascus exploded in July 1860. Bab Tuma was attacked, Christians were slaughtered, houses were plundered, and the shock reached Istanbul, Paris, London, and Rome. Fuad Pasha arrived as the face of Ottoman modernity, carrying punishment, law, and the Sultan's wounded honor.",
                    "The opposing argument is strong: after massacre, punishment was necessary. Makdisi grants the demand for accountability. Then he asks why one kind of violence was called barbaric while another, mass executions, exile, torture, confiscation, martial law, and the crushing of Kisrawan, was called civilized.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "The chapter studies how official knowledge of sectarianism was produced after the war. Fuad Pasha and the European commissioners treated the violence of Druzes, Maronites, and Damascenes as a very old thing, an eruption of tribal fanaticism from outside modern history. By contrast, Fuad's terror was presented as law, civilization, and imperial justice. The state reclaimed the monopoly over legitimate violence.",
                    "Fuad's mission had two audiences. In Syria, he had to discipline the population and restore Ottoman control. In Europe, he had to show that the Ottoman Empire belonged among civilized powers and could protect Christians. His proclamations joined the Sultan's traditional authority to the Tanzimat language of equal subjecthood. Soldiers became the hand of the Sultan, and the Sultan's hand became justice.",
                    "The punishments in Damascus and Mount Lebanon were severe. Hundreds were executed in Damascus, others exiled or fined. Druze notables were imprisoned, tried, sentenced, or hunted. Sa'id Janbulat, the leading Druze notable, became the symbolic guilty man. The evidence against him was weak and often contradictory, but his rank made him responsible. In Fuad's logic, a notable who could not restrain the masses had failed in his duty by definition.",
                    "The trials depended on a fiction. European commissioners and Ottoman officials assumed that ordinary peasants could not have acted politically on their own. Someone must have incited them. That assumption made local elites and provincial officials the scapegoats for a disaster produced by a much wider history, including the European-Ottoman partition of 1842 and the contradictory reforms that followed. The ahali were treated as primitive instruments. Their political agency disappeared again.",
                    "Kisrawan was crushed in the same movement. Tanyus Shahin's name was almost erased by Fuad, who described the revolt as anarchy and excitement. The Maronite Patriarch, backed by Ottoman and European power, threatened excommunication against villagers who would not restore Khazin property. Yusuf Karam marched on Rayfun in March 1861, looted Shahin's house, and forced the old rebel into submission. Shahin, once the bek of the people, had to ask a French general for help.",
                    "The new order came with the Mutasarrifiyya in June 1861. The old partition was abolished, and Mount Lebanon became an autonomous province ruled by a non-Lebanese Christian governor appointed by the Ottoman state with European approval. The Règlement Organique promised equality before the law, administrative rationalization, police reform, and the end of muqata'ji privilege. On paper, it broke with the old regime.",
                    "Makdisi's deeper point is that notable society survived by changing clothes. The Mutasarrifiyya made sect the official public identity. Offices, courts, councils, taxation, administration, and census categories were tied to sect. Members of assemblies were to be chosen through sect leaders and notables. Popular participation was excluded. The old nonsectarian elite culture was replaced by an elite sectarian culture.",
                    "The chapter closes by defining the culture of sectarianism. Public life now depended on the myth of coherent communities and balanced representation. Private life carried fear, memory, resentment, desire, and refusal. Butrus al-Bustani's Nafir Suriyya appears as an alternative voice, calling for secular education and refusing the idea that human beings are sectarian by nature. Mikhayil Mishaqa preserved memories of Muslims saving Christians in Damascus. Against them stood memories of betrayal, massacre, and inherited fear.",
                ],
            ),
            (
                "Argument Map",
                [
                    "Fuad Pasha turned state violence into modern justice and popular violence into primitive fanaticism.",
                    "Trials after 1860 blamed notables because officials refused to imagine ordinary people as political actors.",
                    "The end of Shahin's movement marked the defeat of popular interpretations of reform.",
                    "The Mutasarrifiyya created peace by making sect the official language of public life.",
                    "Sectarianism became a culture because it entered administration, memory, fear, education, law, and daily political expectation.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "This chapter is the hinge between nineteenth-century Mount Lebanon and modern Lebanon. It shows how a state can claim to cure violence while preserving the categories that made violence legible. The Mutasarrifiyya brought peace, yes. But it also taught Lebanon to govern itself through the wound.",
                ],
            ),
        ],
    },
    {
        "title": "Epilogue",
        "pages": "Original book pages 166-174",
        "sections": [
            (
                "The Scene",
                [
                    "Makdisi ends with Marx's line about tragedy and farce, then turns to twentieth-century Lebanon. Sectarianism, ta'ifiyya, became the negative image of national coexistence, ta'ayush. The Lebanese state could condemn sectarianism as a backward disease while building politics around sectarian representation.",
                    "The epilogue grants why nationalism needed that story. After 1860, after 1943, after 1975, after Taif in 1989, Lebanon needed narratives of coexistence. But Makdisi's point is that coexistence becomes fragile when it survives by pretending that sectarianism is ancient, accidental, or already overcome.",
                ],
            ),
            (
                "Detailed Summary",
                [
                    "The epilogue gathers the book's argument into one claim: sectarianism belongs to modernity. It was born in an in-between era, after the old regime had collapsed and before a national society had formed. It was made through local, Ottoman, and European interaction. It was an elite culture of preserved privilege, and it was also a popular language of future possibility.",
                    "Makdisi reviews European accounts of 1860, including Churchill and Jesuit writers, and shows how they denied local agency. They blamed Ottoman Muslim plots, Druze barbarism, or Turkish rule, while ignoring European participation in the conditions that made sectarian politics possible. French later writing used 1860 to justify mandate rule, presenting France as the rational Christian power destined to repair Ottoman failure.",
                    "Ottoman and Turkish historiography, in Makdisi's reading, often made the mirror error. It blamed European intrigue and defended the Ottoman state, while reducing Mount Lebanon's inhabitants to pawns. Cevdet Pasha and later writers could condemn European interference while still accepting the idea that Druze-Maronite hostility was ancient. Colonial and imperial knowledge met each other in the same refusal: neither wanted to see local people making history.",
                    "Local Arabic accounts are more immediate and more painful. Bishops, priests, Mikhayil Mishaqa, Yusuf Karam, and other writers tried to explain a calamity that had broken the known rules of society. Many retreated into the language of plot, divine punishment, and the ignorance of the masses. Even when they resisted colonial explanations, they often wrote the ahali back out of history by making them instruments of hidden forces.",
                    "Maronite and Druze postwar narratives accused each other of premeditated destruction. Each side needed the other to be a coherent, guilty community because each side also wanted to present itself as a coherent, innocent community. This is one of Makdisi's hardest insights: sectarian enemies can depend on each other's categories. Each validates the other's claim to speak as a single ta'ifa.",
                    "The meaning of 1860 changed again in nationalist writing. Scholars such as Philip Hitti, George Antonius, Asad Rustum, Kamal Salibi, Leila Fawaz, Albert Hourani, and Georges Corm appear in Makdisi's closing discussion as part of a long debate over how to fit sectarian violence into national history. Earlier nationalist confidence treated sectarianism as a dark interruption before awakening. The civil war beginning in 1975 made that confidence harder to sustain.",
                    "Makdisi ends against the idea that sectarianism is a Middle Eastern failure to modernize or secularize. That question already assumes Europe as the only measure of modern life. The better question is how religion became the site of a colonial encounter, and why religious violence became part of national expression. Mount Lebanon is not an exception outside modernity. It is one version of modernity's own damage.",
                ],
            ),
            (
                "Argument Map",
                [
                    "Sectarianism is produced, so it can be changed.",
                    "European, Ottoman, nationalist, and local histories each hid parts of the story in different ways.",
                    "Local writers preserved pain, but often restored elite order by blaming plots and ignorance.",
                    "The Lebanese national story inherited both the myth of coexistence and the fear of sectarian relapse.",
                    "The book closes by asking for another vision of modernity, not a return to an imagined past.",
                ],
            ),
            (
                "Why It Matters",
                [
                    "The epilogue is Makdisi speaking directly to Lebanon after 1975 and after Taif. He is saying that the problem is not memory itself. The problem is official memory that wants forgiveness without history, coexistence without power, and peace without asking how the political machine keeps producing the same sectarian citizen.",
                ],
            ),
        ],
    },
]


def register_fonts() -> dict[str, str]:
    font_dir = Path("/System/Library/Fonts/Supplemental")
    fonts = {
        "body": "Georgia",
        "body_bold": "Georgia-Bold",
        "body_italic": "Georgia-Italic",
        "display": "Baskerville",
    }
    pdfmetrics.registerFont(TTFont("Georgia", str(font_dir / "Georgia.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", str(font_dir / "Georgia Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia-Italic", str(font_dir / "Georgia Italic.ttf")))
    # ReportLab can read TTC collections; Baskerville gives the chapter openings a bookish face.
    pdfmetrics.registerFont(TTFont("Baskerville", str(font_dir / "Baskerville.ttc")))
    return fonts


class PaperDoc(BaseDocTemplate):
    def __init__(self, filename: str):
        self.allowSplitting = 1
        super().__init__(
            filename,
            pagesize=A5,
            leftMargin=18 * mm,
            rightMargin=18 * mm,
            topMargin=18 * mm,
            bottomMargin=20 * mm,
        )
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="main",
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )
        self.addPageTemplates([PageTemplate(id="paper", frames=[frame], onPage=draw_page)])


def draw_paper(canvas, doc):
    width, height = A5
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#efe3c8"))
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    random.seed(doc.page)
    for _ in range(1050):
        x = random.random() * width
        y = random.random() * height
        shade = random.choice(["#d8c7a5", "#f7edda", "#ccb891", "#e6d6b6"])
        canvas.setFillColor(colors.HexColor(shade), alpha=random.uniform(0.035, 0.11))
        canvas.circle(x, y, random.uniform(0.08, 0.34), stroke=0, fill=1)
    canvas.setFillColor(colors.Color(0.95, 0.86, 0.66, alpha=0.08))
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.restoreState()


def draw_page(canvas, doc):
    draw_paper(canvas, doc)
    width, height = A5
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#8a5a2b"))
    canvas.setLineWidth(0.4)
    canvas.line(16 * mm, height - 13 * mm, width - 16 * mm, height - 13 * mm)
    canvas.line(16 * mm, 14 * mm, width - 16 * mm, 14 * mm)
    canvas.setFillColor(colors.HexColor("#6b4524"))
    canvas.setFont("Georgia", 7)
    if doc.page > 2:
        canvas.drawString(18 * mm, height - 10 * mm, "Makdisi Reading Companion")
        canvas.drawRightString(width - 18 * mm, 10 * mm, str(doc.page))
    canvas.restoreState()


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="Baskerville",
            fontSize=26,
            leading=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#3b2414"),
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["Normal"],
            fontName="Georgia-Italic",
            fontSize=11,
            leading=15,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#6f4a27"),
            spaceAfter=22,
        ),
        "chapter": ParagraphStyle(
            "chapter",
            parent=base["Heading1"],
            fontName="Baskerville",
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#3c2412"),
            spaceBefore=0,
            spaceAfter=6,
        ),
        "pages": ParagraphStyle(
            "pages",
            parent=base["Normal"],
            fontName="Georgia-Italic",
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#7a5834"),
            spaceAfter=12,
        ),
        "section": ParagraphStyle(
            "section",
            parent=base["Heading2"],
            fontName="Georgia-Bold",
            fontSize=10.8,
            leading=14,
            textColor=colors.HexColor("#4c2e18"),
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Georgia",
            fontSize=9.2,
            leading=14.2,
            alignment=TA_JUSTIFY,
            firstLineIndent=4 * mm,
            textColor=colors.HexColor("#2e2419"),
            spaceAfter=5,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["BodyText"],
            fontName="Georgia",
            fontSize=8.8,
            leading=13.2,
            leftIndent=5 * mm,
            firstLineIndent=-3 * mm,
            textColor=colors.HexColor("#2e2419"),
            spaceAfter=3.5,
        ),
        "toc": ParagraphStyle(
            "toc",
            parent=base["BodyText"],
            fontName="Georgia",
            fontSize=9.2,
            leading=14,
            textColor=colors.HexColor("#3d2a1a"),
            spaceAfter=4,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Georgia-Italic",
            fontSize=7.4,
            leading=10,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#755437"),
        ),
    }


def clean(text: str) -> str:
    replacements = {
        " - ": " - ",
        "&": "&amp;",
    }
    out = text
    for old, new in replacements.items():
        out = out.replace(old, new)
    return out


def build_source() -> str:
    lines = [TITLE, SUBTITLE, AUTHOR, ""]
    for chapter in CHAPTERS:
        lines.append(chapter["title"])
        lines.append(chapter["pages"])
        lines.append("")
        for heading, paras in chapter["sections"]:
            lines.append(heading)
            for para in paras:
                lines.append(para)
                lines.append("")
        lines.append("")
    return "\n".join(lines)


def build_pdf():
    register_fonts()
    st = styles()
    story = []

    story.append(Spacer(1, 34 * mm))
    story.append(Paragraph(TITLE, st["title"]))
    story.append(Paragraph(SUBTITLE, st["subtitle"]))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph(AUTHOR, st["subtitle"]))
    story.append(Spacer(1, 76 * mm))
    story.append(
        Paragraph(
            "Prepared as a private reading companion from the local PDF of Ussama Makdisi's 2000 book.",
            st["small"],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("Contents", st["chapter"]))
    for i, chapter in enumerate(CHAPTERS):
        label = chapter["title"]
        if i == 0:
            label = "Opening Note"
        story.append(Paragraph(clean(label), st["toc"]))
    story.append(PageBreak())

    for index, chapter in enumerate(CHAPTERS):
        if index:
            story.append(PageBreak())
        story.append(Paragraph(clean(chapter["title"]), st["chapter"]))
        story.append(Paragraph(clean(chapter["pages"]), st["pages"]))
        for heading, paras in chapter["sections"]:
            block = [Paragraph(clean(heading), st["section"])]
            if heading == "Argument Map":
                for para in paras:
                    block.append(Paragraph("- " + clean(para), st["bullet"]))
            else:
                for para in paras:
                    block.append(Paragraph(clean(para), st["body"]))
            story.append(KeepTogether(block[:2]))
            story.extend(block[2:])
            story.append(Spacer(1, 1.5 * mm))

    doc = PaperDoc(str(PDF_PATH))
    doc.build(story)


if __name__ == "__main__":
    SOURCE_PATH.write_text(build_source(), encoding="utf-8")
    build_pdf()
    print(PDF_PATH)
    print(SOURCE_PATH)
