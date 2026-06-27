from __future__ import annotations

import random
import re
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
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)
from PIL import Image as PILImage


BASE = Path("research/makdisi-culture-of-sectarianism")
IMG = BASE / "images"
OUT_PDF = BASE / "makdisi-culture-of-sectarianism-abridged-book.pdf"
OUT_SOURCE = BASE / "makdisi-culture-of-sectarianism-abridged-book.md"


MAPS = {
    "map_syria": {
        "path": IMG / "map_01_syria.png",
        "caption": "Map 1. Syria. Makdisi places Mount Lebanon inside Syria and the Ottoman world before it becomes the smaller political object later called Lebanon.",
    },
    "map_syria_palestine": {
        "path": IMG / "map_02_syria_palestine_1782.png",
        "caption": "Map 2. Syria and Palestine in an eighteenth-century European atlas. The map belongs to the chapter on European imagination, where geography arrives already filtered through travel, Scripture, and power.",
    },
    "map_old_regime": {
        "path": IMG / "map_03_old_regime_mount_lebanon.png",
        "caption": "Map 3. Old-regime Mount Lebanon. The map matters because the old order was organized through districts, families, roads, ports, rivers, and lordship, before sect became the main administrative grammar.",
    },
    "map_druze_district": {
        "path": IMG / "map_04_druze_district_of_lebanon.png",
        "caption": "Map 4. The Druze District of Lebanon. The partition of 1842 tried to make a sectarian map out of a mixed social world.",
    },
    "map_terre_sainte": {
        "path": IMG / "map_05_terre_sainte_1849.png",
        "caption": "Map 5. La Terre Sainte in 1849. The Holy Land map belongs to the European habit of seeing Mount Lebanon through sacred history and Christian recovery.",
    },
}


DOCUMENT = [
    {
        "type": "title",
        "title": "The Culture of Sectarianism",
        "subtitle": "A Full Abridged Reading Book",
        "byline": "After Ussama Makdisi, rewritten from the local 2000 PDF",
    },
    {
        "type": "section",
        "title": "How To Read This",
        "paras": [
            "This is a shortened version of Makdisi's book, not a replacement for the original. The aim is to carry the whole argument in a readable form, with the important people, places, decrees, maps, and turns preserved. The original text was extracted into the research folder, chapter by chapter, so the PDF you are holding has a source trail behind it.",
            "Makdisi's book is about Mount Lebanon in the nineteenth century, but it is really about how a society learns to see itself through categories that later pretend to be ancient. The old explanation says Druzes and Maronites fought because sectarian hatred was buried in the mountain. Makdisi grants the violence, the terror, and the memory. Then he shows the machinery. European travelers, Ottoman reformers, Maronite bishops, Druze shaykhs, missionaries, consuls, muleteers, villagers, and governors all helped make sectarianism into public life.",
            "The strongest thing in the book is its refusal to let anyone keep clean hands. Sectarianism was not simply European conspiracy, Ottoman divide-and-rule, Maronite clerical ambition, Druze revenge, peasant anger, missionary arrogance, or ancient fear. It was made from all of them, in a specific order, under specific pressures, on specific roads between Beirut, Dayr al-Qamar, Bkirke, Ghazir, Kisrawan, the Shuf, Zahla, Hasbayya, Rashayya, Damascus, Istanbul, Paris, and London.",
        ],
    },
    {
        "type": "section",
        "title": "The Whole Book In One Movement",
        "paras": [
            "Makdisi begins after the Lebanese civil war and returns to Mount Lebanon before the Lebanese state. He wants to know why sectarianism feels so old when so much evidence shows it was made in the nineteenth century. His answer is that sectarianism became modern precisely by presenting itself as ancient. It was born when religion became the public language through which reform, equality, protection, property, and political representation had to speak.",
            "Before the crisis, Mount Lebanon was hierarchical and violent, but its politics were not organized mainly through sect. The Shihabs, Janbulats, Khazins, Arslans, Abilam's, Abu Nakads, Talhuqs, Hamadas, and Hubayshes ruled through rank, family, district, tax, land, and relation to the Ottoman state. Religion mattered, sometimes deeply, but it lived inside a wider order of obedience and privilege. A Maronite villager could live under a Druze lord. A Druze notable could endow a Christian monastery. A Shihab emir could be legible to several communities at once.",
            "European travelers disturbed that world before European armies and administrators did. Volney, Lamartine, Churchill, Lady Hester Stanhope, Jesuits, and American missionaries looked at Mount Lebanon and saw a biblical refuge, a Christian remnant, a land of tribes, a place where Europe could rescue the Orient from Islam and despotism. Their writings did not invent Maronites and Druzes out of nothing. They hardened living communities into separate types, then circulated those types through books, reports, schools, missions, and consular protection.",
            "The Egyptian occupation under Ibrahim Pasha from 1831 to 1840 broke the old order with conscription, taxation, disarmament, and military centralization. The revolt of 1840 against Egypt briefly united Druze, Maronite, Sunni, and Shi'a villagers, but the victory over Egypt opened a larger problem. When Ottoman rule returned, everyone claimed the restoration meant something different. Druze notables wanted their lands and authority restored. Maronite villagers wanted release from Druze domination. The Maronite Church wanted a Christian political future. European agents had promised too much to too many people.",
            "The Tanzimat reforms gave the conflict its modern language. Equality before the law could mean imperial Ottoman order in Istanbul, Christian protection in Paris, restored privilege for Druze lords, or social liberation for Maronite peasants in Kisrawan. That is why Makdisi keeps returning to the same word from different angles. Reform did not arrive as a neat program. It arrived as a contested promise.",
            "After the violence of 1841 in Dayr al-Qamar, the European and Ottoman answer was partition. In 1842, Mount Lebanon was divided into a Christian north and a Druze south, even though the southern district contained many Christian villages. This administrative act made sectarian geography official. Sekib Efendi's regulations of 1845 tried to calm the mountain through sectarian balance, councils, representatives, and judges. The cure trained society to think of itself through the categories that had broken it.",
            "Missionary schools and local histories deepened the change. Bishop Nicolas Murad wrote a French history of the Maronite nation tied to France and Catholic Europe. Jesuit schools in Ghazir taught sons of local elites to admire France and distrust their Muslim and Druze surroundings. American Protestant missionaries worked through other channels, often with Druze protection and British association. Education, medicine, print, etiquette, and furniture became part of the sectarian order. Even chairs and forks entered the argument.",
            "Then the people entered. In 1858 and 1859, Tanyus Shahin, a muleteer from Rayfun, led Maronite villagers in Kisrawan against the Khazin shaykhs. The villagers demanded relief from dues, humiliations, taxes, and landlord power. They invoked the Tanzimat as equality and freedom. They elected representatives. They expelled the Khazins. The old elites called them juhhal, ignorant ones, but the rebels claimed knowledge for themselves. They said the ahali could speak.",
            "Shahin's movement exposed the contradiction inside elite sectarianism. If the Maronite Church and Maronite notables claimed to speak for a Maronite people, what happened when ordinary Maronites spoke against Maronite lords? If sectarian politics created a Christian community, could that community be used to demand social equality inside Christianity? Shahin answered yes. The Maronite Church, the Khazins, Ottoman officials, and even foreign consuls recoiled.",
            "The crisis spread into the mixed districts in 1860. Christian shabab claimed to defend Christians under Druze rule. Druze fighters feared Christian liberation as a threat to their land and survival. Local killings, rumors, ambushes, mutilations, and revenge attacks drew new boundaries of fear. The war culminated in Druze victories and massacres at places such as Dayr al-Qamar, Zahla, Hasbayya, and Rashayya. Makdisi does not soften the slaughter of Christians. He also refuses to reduce it to timeless hatred. The violence tried to force a mixed world into clean communal territory.",
            "After the massacres, Fuad Pasha arrived to restore Ottoman order before Europe could claim the task fully. He punished Damascus, prosecuted Druze notables, exiled officials, crushed Kisrawan, and helped create the Mutasarrifiyya in 1861. The new order promised equality and abolished old muqata'ji privilege on paper, but it made sect the official grammar of public life. Notable society survived in new form. The ahali were sent back to obedience.",
            "Makdisi's final claim is simple and severe. Sectarianism was produced, so it can be changed. But change requires another rupture as deep as the one that created it. A Lebanon that only celebrates coexistence while administering citizens by sect has not escaped 1860. It has learned to live inside its categories.",
        ],
    },
    {
        "type": "image",
        "key": "map_syria",
    },
    {
        "type": "section",
        "title": "Cast Of Forces",
        "paras": [
            "The Ottoman state enters the book in several forms: Sultan Abdülmecid, the Tanzimat decrees, provincial governors such as Abdullah Pasha and Hursid Pasha, reformers such as Sekib Efendi and Fuad Pasha, and the army that claims modern discipline while using terror. Istanbul wants equality before the law and obedience before the Sultan. Those two desires never fully agree.",
            "European power enters through France, Britain, Austria, Russia, Prussia, consuls, missionaries, ambassadors, and writers. France claims Maronite protection and Catholic memory. Britain courts Druzes and Ottoman reform. Missionaries claim souls, schools, medicine, and civilization. None of these powers fully controls events, but all of them reshape the language in which local people understand events.",
            "Local elites carry the old world into the new one. The Shihabs, Janbulats, Khazins, Abu Nakads, Arslans, Abilam's, Talhuqs, and others hold land, rank, and the right to speak. They adjust to sectarian politics because it offers survival. They also fear it because it gives ordinary villagers a language that can turn against them.",
            "The Maronite Church is both spiritual authority and political actor. The Patriarch, bishops such as Nicolas Murad and Tubiyya Awn, village priests, Jesuit allies, Bkirke, and the monasteries all shape the Maronite communal claim. The Church speaks for the Maronite people, yet Kisrawan proves that many Maronites do not want to be spoken for if the speaker protects Khazin privilege.",
            "The ahali are the book's buried force. Ordinary villagers, muleteers, silk workers, sharecroppers, shabab, widows, refugees, and debtors appear first as subjects of elite history. In Kisrawan and 1860 they enter politics directly. Makdisi's argument depends on seeing them as actors, even when their actions are violent, contradictory, or morally ugly.",
        ],
    },
    {
        "type": "section",
        "title": "Preface And Acknowledgments",
        "paras": [
            "Makdisi's preface begins from a sentence with a blade in it: the war in Lebanon is over, sectarianism is not. In 2000, that was a postwar sentence. It also reaches backward into the nineteenth century, because Makdisi wants to show that the word sectarianism does not name an eternal Lebanese essence. It names a historical formation.",
            "The preface frames the book as a study of modernity. Sectarianism, Makdisi says, grew where European colonial power met Ottoman reform. It was not the refusal of the modern. It was one of modernity's expressions. This is the claim that drives every chapter. The mountain is not outside the modern world. The mountain is one of the places where modern categories were tested, fought over, and made painful.",
            "The acknowledgments matter because they show the archive behind the argument: Jesuit archives in Beirut, Bkirke, Khinshara, Jafet Library at the American University of Beirut, the Ottoman archives in Istanbul, the Public Record Office in London, the Quai d'Orsay in France, and family archives. Makdisi is reading across the places that helped make sectarianism: monastery, patriarchate, empire, consulate, university, and home.",
        ],
    },
    {
        "type": "section",
        "title": "Chapter 1. Religion As The Site Of The Colonial Encounter",
        "paras": [
            "The book opens in the dark at Dayr al-Qamar in June 1860. Salim Shawish tries to keep a Druze notable inside his house by serving coffee, offering food, and giving valuables. Outside, Christians are being killed. Inside, old gestures of protection still have meaning, or at least Salim hopes they do. The scene is devastating because the old etiquette has not vanished; it is still being performed while the world it belongs to collapses.",
            "Makdisi sets this scene beside Charles Churchill's account of Sitt Naaify looking at corpses in the serail. Churchill's prose is vivid and accusatory, and it turns the massacre into a theater of Oriental cruelty. Makdisi does not deny the dead. He refuses the conclusion drawn from them. The violence of 1860 cannot be explained by saying Druzes and Maronites had always hated each other. It has to be placed inside reform, imperial pressure, local ambition, and the new political use of religion.",
            "The chapter defines sectarianism as both practice and discourse. As practice, it is the use of religious identity as the main basis for political claims in a modernizing Ottoman world. As discourse, it is the language that describes this process while pretending it is the opposite of modernity. This double definition matters. Sectarianism is something people do, and it is also something people say about what has been done.",
            "Makdisi challenges European and Ottoman explanations together. European writers such as Lord Dufferin and French Jesuits called the violence tribal, fanatical, and ancient. Ottoman reformers such as Fuad Pasha also had reasons to call it old and primitive, because that protected the image of Istanbul as modern and rational. Later nationalist writers, Turkish, Arab, and Lebanese, often treated sectarianism as a stain on the nation. Each account removes the violence from history in a different way.",
            "The Tanzimat gives Makdisi his frame. The 1839 Gülhane decree promised equality before the law, regardless of religion, while keeping the Sultan as the source of order. European powers read that promise as a mandate to protect Ottoman Christians. Local actors read it through their own needs. The same reform could mean Ottoman sovereignty, European intervention, Maronite privilege, Druze restoration, or peasant equality.",
            "Makdisi also explains why he reads so many kinds of sources together. European texts are not simply false. Local texts are not simply pure. Ottoman documents are not simply state propaganda. Each has its own blindness, and each helps produce the world it describes. Churchill, Bkirke, Istanbul, London, and local Arabic chronicles must be read side by side because sectarianism was made across those archives.",
            "The chapter ends by giving the book its path: Egyptian invasion in 1831, revolt against the Egyptians in 1839 and 1840, Ottoman restoration, partition in 1842, Kisrawan rebellion in 1858 and 1859, war in 1860, and postwar settlement. Makdisi is not retelling everything. He is tracking one line through the story: how religion became a political site under modern pressure.",
        ],
        "remember": [
            "Sectarianism is modern in Makdisi's argument, even when it claims ancient roots.",
            "The violence of 1860 happened between communities and inside communities.",
            "The Tanzimat opened meanings that neither Istanbul nor Europe could fully control.",
            "The chapter teaches you to distrust any explanation that calls Lebanon timeless.",
        ],
    },
    {
        "type": "image",
        "key": "map_syria",
    },
    {
        "type": "section",
        "title": "Chapter 2. The Gentle Crusade",
        "paras": [
            "Chapter 2 begins with Europeans looking at Mount Lebanon before they understand it. Nerval sees biblical origins. Lamartine sees Sannin and the Holy Land. Volney sees liberty trapped under Ottoman despotism. Churchill sees highland freemen. Jesuits see corrupted Christians waiting to be purified. The mountain becomes a screen for European desire.",
            "Makdisi calls this presence a gentle crusade. It is gentle because it comes through travel, print, schools, medicine, and spiritual care rather than conquest. It is a crusade because it divides the world into Christian progress and Islamic despotism, then appoints Europe as judge and redeemer. The phrase is careful. Pens and classrooms can reorganize a society before soldiers arrive.",
            "Volney gives the early structure. He travels between 1783 and 1785 and reads the Ottoman East through despotism, Islam, stagnation, and the absence of public good. Mount Lebanon interests him because he imagines its Christians and Druzes as freer than the surrounding Muslim world. He admires them and patronizes them at once. They are close enough to Europe to redeem, far enough to be classified.",
            "Lamartine adds romance and Christian longing. In 1832, he approaches Beirut with Scripture in his eyes. The Maronites become, in his telling, almost a European colony cast into Asia. Lady Hester Stanhope makes the European fantasy stranger. She lives as a self-made Eastern queen, performs Oriental authority, and becomes for Lamartine one of the marvels he came to see. The local people are nearby, but Europe keeps finding Europe.",
            "The chapter then turns to the invention of tribes. European writers made tables of Maronites, Druzes, Greek Orthodox, Greek Catholics, Shi'a, Sunnis, and others. They described traits, customs, supposed origins, and political destiny. Druzes became Scottish Highlanders in British imagination, noble, warlike, secretive, and free. Maronites became natural clients of France and Catholic Europe. These types were repeated until they sounded like facts.",
            "Makdisi does not say that the communities were imaginary. Maronites and Druzes existed, prayed, married, inherited, fought, and remembered. His point is that European writing made religious community appear as separate tribe, race, and political destiny, even where daily life was mixed. A Druze and a Maronite might live in the same village, share customs, serve the same lord, and use the same roads. The European text separated them before the administration did.",
            "The Jesuits carry the chapter into the household. Riccadonna, Planchet, and Henze arrive in the 1830s expecting to find Eastern Christianity ready for Catholic reform. Instead, they find Christians whose clothes, language, manners, and neighborly life resemble those of Muslims and Druzes. Their horror is revealing. Local Christianity is not absent. It is too local. It has to be remade.",
            "Missionaries therefore begin to purify. They want schools, medicine, discipline, language, new manners, new morals, and separation from Muslim and Druze habits. American Protestants and Jesuits fight each other, but they share the belief that they carry superior knowledge. The gentle crusade creates the cultural conditions under which later sectarian politics can feel natural.",
        ],
        "remember": [
            "European travel writing made Mount Lebanon legible as a land of separate religious peoples.",
            "Missionary disgust with local mixture helped turn coexistence into a problem.",
            "The chapter shows the cultural work that came before formal political division.",
            "Europe's Lebanon was often a fantasy, but fantasies can become administrative facts.",
        ],
    },
    {
        "type": "image",
        "key": "map_syria_palestine",
    },
    {
        "type": "section",
        "title": "Chapter 3. Knowledge And Ignorance",
        "paras": [
            "Chapter 3 returns from European fantasy to the old order of Mount Lebanon. Halil Pasha visits Bashir Shihab in exile and asks how he ruled so long. Bashir answers without liberal ornament. He killed, hanged, imprisoned, and beat people into submission. Then he tells the story of Abu Far, the bird that sees its shadow and imagines it can hunt a camel, only to settle for mice when the sun rises higher. The proverb is about ambition meeting limits.",
            "Makdisi's first correction is against nostalgia. Pre-1860 Mount Lebanon was not a tolerant paradise. It was hierarchical, violent, and unequal. But its dominant public order was not sectarian in the later sense. Rank mattered more than sect in elite politics. The great line divided those who claimed knowledge from those treated as ignorant.",
            "The chapter maps the social geography of the old regime. Mount Lebanon was tied to Tripoli, Damascus, Sayda, Beirut, Acre, the Bekaa, and the Hawran. Wheat came from outside the mountain. Silk and other goods moved through towns such as Dayr al-Qamar. Muleteers connected villages to markets. The mountain was not a sealed refuge from the Ottoman world.",
            "Families organized power. The Shihabs, Janbulats, Arslans, Abilam's, Abu Nakads, Talhuqs, Khazins, Hubayshes, and Hamadas held districts, collected taxes, dispensed hospitality, punished villagers, and negotiated with Ottoman governors. The map of rule was genealogical and regional. It was not a clean map of Maronite here and Druze there.",
            "Religion still mattered. Maronites had their patriarchate, monasteries, churches, saints, and links to Rome. Druzes had their own sacred boundaries and leaders. Conversion could be seen as treachery. Yet religious difference was embedded in other loyalties. Druze notables could protect Christian institutions. Christian merchants could finance a mosque. Shihab branches could cross religious lines. Bashir Shihab could preserve public ambiguity about his faith because rank shielded him from the rules that would crush an ordinary convert.",
            "The language of ta'ifa had not yet hardened into the modern political sect. It could refer to a family of rank. A religious community existed, but it was not always the primary public political unit. The old regime accepted sacred difference while organizing power through a nonsectarian elite culture.",
            "Knowledge belonged to notables, clerics, qadis, chroniclers, mudabbirs, and Ottoman officials. They wrote history, issued orders, kept accounts, judged disputes, and explained society to itself. The ahali worked land, paid taxes, joined village processions, fought when called, presented gifts, and depended on shaykhs for protection. They appeared in chronicles as crowds, rebels, followers, or subjects. They were not supposed to interpret politics.",
            "Punishment made the hierarchy visible. Notables were strangled, blinded, muted, exiled, or restored according to elite codes. Commoners were beaten, hanged, billeted, and disciplined. When villagers rebelled against Bashir Shihab's taxes in 1821, Abdullah Pasha described them as weak subjects seduced by corrupt instigators. Their minds were not political. Their disobedience was ignorance.",
            "The chapter ends with old Ottoman time. A rebellion could be punished and then forgiven. A family could be obliterated and later rehabilitated. Aman, pardon, could restore the past. This cyclical time depended on a world where hierarchy could be violated and then repaired. Reform would make repair harder, because European progressive time and Ottoman modernization would change the meaning of return.",
        ],
        "remember": [
            "Old Mount Lebanon was unequal and violent, but not yet sectarian in the modern political sense.",
            "Religion was serious, but rank, family, district, and obedience organized public power.",
            "The ahali were treated as ignorant, which made their later political speech explosive.",
            "The old order could forgive rebellion by returning people to their place. The modern order could not restore that world so easily.",
        ],
    },
    {
        "type": "image",
        "key": "map_old_regime",
    },
    {
        "type": "section",
        "title": "Chapter 4. The Faces Of Reform",
        "paras": [
            "Chapter 4 begins with Ibrahim Pasha's invasion of Syria and Mount Lebanon in 1831. Mehmed Ali's Egyptian state arrives with a modern army, conscription, fiscal demand, and a new level of central pressure. Bashir Shihab survives by submitting to Ibrahim. Some Druze notables go into exile. The old regime remains visible, but its joints are under strain.",
            "Ibrahim Pasha's rule is modern in army and method, yet old in its demand for obedience. He wants taxes, soldiers, disarmament, labor, and resources. He treats Syria as a place to be organized for Cairo. His language toward rebellion still sounds like older Ottoman punishment: submit and receive mercy, resist and be crushed. The modern and the old work together.",
            "The Druze rebellion in the Hawran in 1837 and 1838 shows this mixture. Ibrahim Pasha uses Christian villagers and Shihab allies against Druze rebels, then frames the Druzes as heretics because they rebelled. Makdisi pauses here because historians often treat the arming of Christians against Druzes as the beginning of sectarian war. He argues that the meaning was more limited at the time. Christians were armed as loyal subjects. Druzes were condemned as rebels. Once they submitted, Ibrahim granted aman and expected the old order to return.",
            "The Gülhane decree of 1839 changes the field. It promises equality of Muslim and non-Muslim subjects before the law, while claiming continuity with Ottoman Islamic tradition. European powers hear an opening for intervention. Local elites hear opportunity. Ordinary villagers will later hear rights. Reform enters Mount Lebanon as a phrase with several masters.",
            "In 1840, revolt against Egyptian rule brings Druze, Maronite, Sunni, and Shi'a villagers together at Antilyas. They declare themselves one mind and one voice. The Maronite Patriarch supports the uprising against Egyptian tyranny. European agents such as Richard Wood supply promises and weapons. The Ottomans return with British and allied help. Bashir Shihab falls.",
            "The restoration immediately becomes a conflict over what has been restored. Druze notables return from exile and demand property, tax rights, and rank. Maronite villagers of Dayr al-Qamar refuse to go back under Druze lordship. The Maronite Church wants a Christian Shihab ruler and claims Maronite majority. British promises of ancient franchises hang in the air, vague and dangerous.",
            "The 1841 violence at Dayr al-Qamar begins with a hunting dispute near B'aqlin and expands into fighting, siege, and the humiliation of Bashir Qasim. The Druze Nakads claim legitimate rights. Maronite villagers claim protection and equality. Land, tax, and memory become religiously marked. A conflict over property and authority is now spoken as a Druze-Maronite conflict.",
            "Makdisi insists on the layers. At one level, Druze notables fight Bashir Qasim over land and taxation. At another, Maronite commoners reject Druze notable hegemony. At another, the relationship between religion and politics changes. The old regime kept religion as part of social order. Restoration politics makes religious identity the starting point for claims.",
            "Even after 1841, there is room for old ties. Maronite clergy do not cut all contact with Druze elites. Christian villagers remain under Druze shaykhs. The Janbulats keep Christian teachers and advisors. But the political grammar has changed. The future will be argued through sect.",
        ],
        "remember": [
            "Egyptian rule exposes Mount Lebanon to a harsher centralized state.",
            "The Tanzimat turns equality into a contested language.",
            "The 1840 restoration breaks open the question of whose past will return.",
            "Dayr al-Qamar in 1841 begins the age of sectarian politics because land, rank, tax, and religion fuse in public conflict.",
        ],
    },
    {
        "type": "section",
        "title": "Chapter 5. Reinventing Mount Lebanon",
        "paras": [
            "Chapter 5 is where the map itself is remade. After 1841, European diplomats, Ottoman officials, Druze shaykhs, Maronite bishops, missionaries, and chroniclers all claim to know Mount Lebanon's ancient custom. The problem is that each side needs custom to say something different.",
            "The European and Ottoman search for order after Dayr al-Qamar produces the partition of 1842. British diplomats push for separate Christian and Druze districts. Ottoman officials object that the population is too mixed. The European answer treats mixed villages as an inconvenience to be solved. In that sentence, a lived society becomes an administrative difficulty.",
            "The partition creates a Christian kaymakamate in the north and a Druze kaymakamate in the south. The southern district contains many Christians, and that fact will trouble everything. The Maronite Church still wants a Maronite or Christian rule over all Mount Lebanon. Druze notables insist that many villages were built by their ancestors and belong under their authority. The map satisfies no one, yet it trains everyone.",
            "Local elites now learn to present themselves as leaders of sectarian communities. Druze notables appeal to Britain and the Ottoman Sultan as Muslims, proprietors, and protectors of a Druze people. Maronite leaders appeal to France, Austria, Rome, and Istanbul as representatives of a Maronite people. Each side claims loyalty to the Sultan while cultivating informal subjecthood to Europe.",
            "Bishop Nicolas Murad's 1844 Notice historique is one of the chapter's main texts. Written in French and addressed to Louis-Philippe, it presents the Maronites as a Catholic nation tied to France, loyal to Crusader memory, and rightful heirs of Mount Lebanon. Druzes appear as outsiders, lazy, fanatical, dependent on Christians, and unfit for rule. Makdisi cares about Murad's errors, and even more about the form of the claim: genealogy, population tables, French language, historical narrative, and political petition joined together.",
            "Sekib Efendi's 1845 regulations try to stabilize the partition. He keeps the two kaymakams and creates councils with judges and advisors from recognized sects. He adds wakils where populations and notables differ by sect. The aim is balance. The result is a social lesson: disputes, offices, authority, representation, and justice must now pass through communal categories.",
            "Sekib wants Ottoman nationalism, equality, and obedience. He calls the notables compatriots, but he also threatens punishment and expects the ahali to return to work and taxes. He believes Druzes and Maronites are ancient rival sects, even as he creates new rules around that belief. His regulations make race, sect, and community blur into one another.",
            "Missionaries do cultural work that administrators cannot. Jesuits and American Protestants bring medicine, schools, books, manners, chairs, tables, and languages. Local elites want worldly education for their sons. Missionaries want spiritual reform. The compromise is modern education along sectarian lines.",
            "Ghazir becomes one of the chapter's most revealing places. Jesuit students there salute France, speak of progress, and learn to see Europe as the source of science and civilization. They also learn to see Muslim and Druze proximity as danger. A new Maronite elite is being trained to feel both modern and sectarian.",
            "The chapter closes by naming the instability beneath the new order. No single group sectarianized Mount Lebanon. Each group helped. The Maronite Church, Druze notables, Jesuits, Protestants, consuls, Ottoman officials, and local writers all dismantled the old community of knowledge and built separate sectarian communities of knowledge. Then a dangerous question appears: if a community is now a political people, can ordinary members speak for it?",
        ],
        "remember": [
            "The 1842 partition made sectarian geography official.",
            "Murad's Maronite history turned old ecclesiastical identity into modern national claim.",
            "Sekib Efendi's balance system trained people to use sect as administrative identity.",
            "Missionary education made modernity feel sectarian and European.",
            "The chapter prepares the rise of Tanyus Shahin by opening the question of popular representation.",
        ],
    },
    {
        "type": "image",
        "key": "map_druze_district",
    },
    {
        "type": "image",
        "key": "map_terre_sainte",
    },
    {
        "type": "section",
        "title": "Chapter 6. The Return Of The Juhhal",
        "paras": [
            "Chapter 6 belongs to Tanyus Shahin of Rayfun. In 1858 and 1859, this muleteer becomes the leader of a Maronite peasant rebellion in Kisrawan against the Khazin shaykhs. The chapter title gives the elite insult: juhhal, ignorant ones. Makdisi's point is that the so-called ignorant returned with claims, petitions, seals, representatives, and a reading of reform.",
            "The revolt begins with local grievances. Villagers complain about excessive gifts, marriage taxes, humiliating forms of address, beatings, shaykh taxes passed onto the ahali, common grazing lands, debt, and compensation owed from earlier mobilizations. These are not abstractions. They are the everyday material of lordship: soap, coffee, honey, tobacco, harvests, trees, silk, permissions, insults, and money.",
            "The villagers demand representation. Some ask for wakils chosen by the ahali. Some say the station of the shaykhs should be equal to theirs. Some demand that no shaykh be an official over them. In Kisrawan, the Tanzimat becomes social equality inside a Maronite district. That was not what Istanbul intended, and it was not what the Maronite Church wanted.",
            "The Khazins understand the revolt as excitement, sedition, and manipulated ignorance. They cannot imagine the ahali acting politically on their own. Some suspect bishops. Some suspect the Patriarch. Some suspect hidden agents. The old order has no language for a peasant who claims knowledge except conspiracy.",
            "Patriarch Bulus Mas'ad is trapped. Bkirke wants to speak for the Maronite nation, but the revolt is happening in the Maronite heartland against Maronite lords. The Church owns land and values hierarchy. It also cannot ignore the grievances of its flock. The Patriarch pushes calm, offers mediation, and sometimes addresses abuses. He cannot bless the overthrow of property.",
            "Shahin's letters shock the elites because he writes as a man with authority. He warns Emir Yusuf Ali Murad that Christians have united and that any Christian who sides with Druzes and notables has betrayed religion. He uses blunt language. He signs as general representative of Kisrawan, and later as representative of the Christians. A muleteer is writing to emirs as if the right to interpret the Tanzimat has moved from palace to village.",
            "Shahin's movement is deeply religious and deeply social. He prays, keeps ties to priests, sends notices through churches, tries to regulate drinking, and speaks of Christian rights. He also redistributes goods, attacks notables, pressures villages, and claims popular sovereignty. Makdisi rejects the idea that class struggle was corrupted by sectarianism. In Kisrawan, class and sect are braided together from the start.",
            "The rebellion grows more dangerous when it moves beyond Kisrawan. Christian villagers in Hammana cite Kisrawan when refusing Druze authority. Shahin's followers attack Shi'a villagers in Jbayl, and some Shi'a reportedly face coerced conversion. Shahin becomes a defender of Christians in popular imagination. His movement, born against Maronite landlords, begins to look like a Christian campaign beyond Kisrawan.",
            "The Bayt Miri clash of August 1859 spreads fear into the mixed districts. Bishop Awn describes a trivial fight becoming battle as the devil plays with the minds of the ignorant on both sides. Christian villagers call Shahin and the shabab of Kisrawan for help. The old Maronite hierarchy feels its flock slipping toward a popular leader it cannot command.",
            "At Mdayrij, Druze and Christian notables try to become one hand against the commoners. They see that the uprising has diminished their station. They plan to march on Kisrawan to discipline the ahali and return the Khazins. But Christian villagers refuse to march under the notables against Kisrawan. Elite solidarity fails.",
            "The chapter ends by refusing clean categories. Shahin is not a pure democrat. He becomes a bek, uses coercion, attacks non-Christians, and fuses personal ambition with the jumhur. The Khazins are not simply old villains; they are defending a world that every official structure had taught them was legitimate. The real crisis is representation. Who speaks for a sect when the poor of the sect turn against its lords?",
        ],
        "remember": [
            "Kisrawan is the return of the ahali as political actors.",
            "The Tanzimat becomes a popular language of equality far beyond Ottoman intention.",
            "The Maronite Church cannot reconcile communal leadership with defense of hierarchy.",
            "Shahin's movement shows that sectarian identity contains social conflict inside it.",
            "The revolt frightens all elites because it breaks the monopoly on knowledge.",
        ],
    },
    {
        "type": "section",
        "title": "Chapter 7. The Devil's Work",
        "paras": [
            "Chapter 7 is the war chapter. In May and June 1860, the unrest of Kisrawan moves into the mixed districts and becomes catastrophe. Random murders, retaliations, rumors, mobilizations, shabab militias, and fear create the conditions for full war. Druze forces eventually defeat Christian centers and massacre Christians in Dayr al-Qamar, Zahla, Hasbayya, and Rashayya.",
            "Makdisi concedes the scale of Christian suffering. Churches and convents were destroyed. Villages were emptied. Thousands were killed. The Druzes carried the battlefield. Yet the chapter does not read violence as proof of ancient hatred. It reads violence as an attempt to resolve contradictions created by reform: who owns land, who speaks for a community, who protects whom, who may travel, who may remain, and who has the right to use force.",
            "The march from Kisrawan toward Nahr al-Kalb and Antilyas shows the Christian camp in disorder. Shahin's men claim to defend Christians in the south, but local Christians sometimes ask them to leave because their presence may provoke the Druzes. Bishop Awn negotiates in Beirut with Hursid Pasha as if he can control the Maronites. He cannot. The Maronite Patriarch sends letters, orders, and pleas. The crowd moves under its own pressure.",
            "The Jesuits in Ghazir watch the dream of a Maronite nation fail. Letters arrive calling villagers to fight. Bells ring. Sermons urge courage. Yusuf Karam arrives with men from the north. But the unified Christian army does not appear. Some men take rations and refuse to march. The Maronite ta'ifa is invoked everywhere and present nowhere as a disciplined whole.",
            "Localized violence redraws the world before armies do. A Druze man killed on a road, a Christian priest murdered after rumor, ears cut from survivors, ambushes near Khan al-Warwar, retaliations at Ramlat al-Hajr, and panic in village squares all make new geographies of danger. A killing is no longer only family revenge. It becomes communal warning.",
            "Makdisi keeps acts of protection inside the story. Sa'id Janbulat protects some Christians. Sitt Nayfa protects women. Druze homes shelter Christian fugitives. Christian intermediaries help Druzes escape. These acts are not decorative. They prove that the older mixed world still exists. They also show how weak it has become under the pressure of communal fear.",
            "The shabab are central. Christian young men organize into militias, wear distinctive clothing, and call themselves defenders of village and faith. The figure of the shaykh al-shabab challenges Druze notables and cautious Christian elites. In a society where senior men and notables were supposed to lead, armed youth claim the right to act because elders have failed.",
            "Druze violence, when it comes, is both military and social. Christian villages are burned, monasteries attacked, priests killed, Catholic institutions destroyed, and property seized. The destruction of Catholic spaces is tied to Druze fear of a Maronite-French-Jesuit project that threatens Druze land and survival. Protestant and American sites are sometimes spared because they carry a different political meaning.",
            "The killing of Muslim Shihab emirs in Hasbayya is one of the chapter's hardest pieces of evidence. Druze fighters kill Muslim notables because they are associated with Christian defense. That act breaks any simple Muslim-Christian story. It also breaks the old rule protecting elite rank. Sectarian war allows a common Druze fighter to kill an emir in the name of communal survival.",
            "After Druze victory, Christian dreams of liberation collapse. Refugees move toward safer areas. Some Christians take refuge again under Druze notables, the very kind of protection that Shahin's world had tried to transcend. Salim Shawish's testimony from Dayr al-Qamar returns: coffee, gifts, jewels, fear, protection, and death in the same house.",
            "Hursid Pasha's July 1860 peace treaty is the first restoration of elite order. It orders everyone back to their place, condemns seducers and ignorant mobs, and tells the ahali to submit to notables. Druze and Christian elites seal a peace that erases popular politics. They disagree over memory and guilt, but they agree that the masses must be silenced.",
        ],
        "remember": [
            "1860 was an attempt to make mixed territory into sectarian territory.",
            "The violence broke older rules of rank as well as religious coexistence.",
            "Christian unity failed, which exposed the fragility of Maronite nationalist claims.",
            "Druze victory did not restore the old order by itself; Ottoman and elite peace-making had to write the ahali out of politics.",
            "Makdisi reads violence as evidence, not as an excuse to stop thinking.",
        ],
    },
    {
        "type": "section",
        "title": "Chapter 8. A Very Old Thing",
        "paras": [
            "Chapter 8 begins after the massacres in Mount Lebanon and Damascus. Bab Tuma is attacked in July 1860. Christians are slaughtered. Consuls and missionaries are killed. Europe is outraged. Sultan Abdülmecid is shamed. Fuad Pasha arrives to restore order and protect the Ottoman claim to civilized sovereignty.",
            "Fuad's mission is punishment and performance. He must punish the guilty, calm Europe, contain the French expedition, discipline the province, and show that the Ottoman Empire can protect Christians without surrendering its sovereignty. His language joins the Sultan's sorrow to the Tanzimat's promise of equal protection. The army becomes the hand of justice.",
            "Makdisi's hardest contrast is between two kinds of violence. Popular sectarian violence is described as savage, ancient, tribal, and irrational. Ottoman state violence, executions, exile, conscription, confiscation, military occupation, and coercive trials, is described as modern, legal, and necessary. The chapter asks who gets to call violence civilization.",
            "In Damascus, hundreds are executed or punished. In Mount Lebanon, Druze notables are arrested and prosecuted. Sa'id Janbulat becomes the symbolic guilty man. Evidence against him is weak, and some testimony is contradictory, but his rank makes him responsible. In Fuad's logic, a notable who fails to restrain his people has already failed as a notable.",
            "The trials depend on the assumption that ordinary villagers could not have acted politically. Someone higher must have incited them. The British, Ottoman, and other commissioners look for ringleaders because they cannot imagine popular agency except as manipulation. The ahali become instruments again. Their actions are either brigandage or seduction.",
            "This is how knowledge is produced. By calling sectarian violence a very old thing, Fuad Pasha, Lord Dufferin, and other officials avoid the full history of reform, partition, missionary work, consular protection, land conflict, and popular claims. Blaming old tribal passions absolves the modern powers that helped create the field in which those passions were organized.",
            "Kisrawan is ended inside this same operation. Shahin's movement is renamed anarchy and excitement. The Maronite Patriarch, now backed by Ottoman and European force, threatens excommunication against villagers who refuse to restore Khazin property. Yusuf Karam marches on Rayfun in March 1861, loots Shahin's home, and forces the rebel leader into submission. Shahin has to ask a French general for help. The man who had claimed to speak for the people becomes dependent on the powers he once used.",
            "The Mutasarrifiyya of 1861 is the settlement. The 1842 partition is abolished. Mount Lebanon becomes an autonomous province ruled by a non-Lebanese Christian governor, answerable to the Sublime Porte and approved under European eyes. The Règlement Organique promises equality before the law, rational taxation, police reform, and the end of muqata'ji privilege. On paper, it breaks with the old regime.",
            "Makdisi shows the continuity beneath the rupture. Notable society survives by becoming sectarian. Offices, courts, councils, taxes, and representation now pass through sect leaders and notables. The census is to be carried out place by place and sect by sect. The old nonsectarian elite order is replaced by an elite sectarian order. The ahali are again passive subjects.",
            "The chapter ends with the culture of sectarianism. Public life now assumes coherent communities that can be balanced. Private life carries fear, memory, aspiration, and refusal. Butrus al-Bustani's Nafir Suriyya offers one answer: secular education against sectarian socialization. Mikhayil Mishaqa preserves memories of Muslims saving Christians in Damascus. Others preserve stories of betrayal and inherited danger. The culture is never pure. It lives through contradiction.",
        ],
        "remember": [
            "Fuad Pasha turned Ottoman punishment into a performance of modern civilization.",
            "The trials blamed elites because officials refused to see ordinary people as political actors.",
            "Shahin's defeat marks the defeat of popular reform.",
            "The Mutasarrifiyya brought peace by making sect the official grammar of government.",
            "Sectarianism became a culture because it entered law, administration, memory, schooling, fear, and representation.",
        ],
    },
    {
        "type": "section",
        "title": "Epilogue. The Allegory Of 1860",
        "paras": [
            "The epilogue brings Makdisi back to modern Lebanon. Sectarianism, ta'ifiyya, is usually treated as the opposite of national coexistence, ta'ayush. The Lebanese state condemns sectarianism as backward and divisive while organizing politics through sectarian representation. That contradiction is not an accident. It is the inheritance of 1860 and 1861.",
            "Makdisi repeats the book's central claim: sectarianism was produced. It emerged in an in-between time, after the old regime had collapsed and before an independent national society had formed. It was a culture of elites defending privilege. It was also a language through which ordinary people imagined liberation. The war of 1860, often seen as the triumph of monolithic sectarianism, was also the failure of any single sectarian identity to control the world it claimed.",
            "European accounts after 1860 blamed Ottoman barbarism, Druze fanaticism, Muslim plots, or native savagery. Churchill and Poujoulat wrote with sympathy for Christian victims, but their explanations denied local agency and erased European responsibility for the partition and the political culture that preceded the war. Later French writing used 1860 to justify France's mandate over Lebanon and Syria.",
            "Ottoman and Turkish accounts made a mirror error. They blamed European intrigue and defended the Ottoman state, while still accepting that Druze-Maronite hostility was ancient. Mount Lebanon became a stage on which empire and Europe fought over modernity. Its inhabitants became pawns. Makdisi refuses both erasures.",
            "Local Arabic histories are closer to the wound. Bishops, priests, Mikhayil Mishaqa, Yusuf Karam, Iskandar Abkarius, and others write from proximity rather than distance. They know the villages and the terror. Yet many still explain 1860 through plots, divine punishment, and the ignorance of the masses. They preserve memory while also restoring elite order by writing the ahali out of history.",
            "The postwar narratives of Maronites and Druzes often accuse each other of planned extermination. Each side needs the other to appear as a coherent guilty community because each side wants to appear as a coherent innocent community. That is the trap of sectarian history. Enemies validate each other's categories even while fighting over guilt.",
            "Nationalist histories later turned 1860 into an allegory. For early Lebanese and Arab nationalist writers such as Philip Hitti, George Antonius, Asad Rustum, and Kamal Salibi, sectarianism becomes the dark interruption before national awakening. After the civil war began in 1975, that confidence cracked. Albert Hourani's sense that something had been left out captures the failure of the old nationalist story to account for Lebanon's collapse.",
            "Makdisi's last move is to reject the question that asks why the Middle East failed to secularize like Europe. That question already assumes the answer. The better question is how religion became the site of a colonial encounter and why religious violence became part of national expression. Mount Lebanon is not outside modernity. It is one of the places where modernity made religion carry the weight of citizenship.",
            "The closing argument is demanding. If sectarianism was made, it can be unmade. But it will not be unmade by nostalgia for old coexistence or by official amnesia after civil war. It requires another vision of modern political life, one as radical in its break with sectarianism as sectarianism was in its break with the old regime.",
        ],
        "remember": [
            "Sectarianism is not ancient destiny. It is historical production.",
            "Colonial, Ottoman, nationalist, and local histories each hid parts of the story.",
            "Local memory preserved pain, but often through conspiracy and elite restoration.",
            "Lebanon inherited both the myth of coexistence and the machinery of sectarian representation.",
            "Makdisi ends by asking for a different modernity, not a return to a clean past.",
        ],
    },
    {
        "type": "section",
        "title": "Timeline",
        "paras": [
            "1516. Ottoman armies enter Syria. Mount Lebanon becomes part of an Ottoman world that governs largely through local notables and provincial authority.",
            "1697. The Shihabs rise to rule Mount Lebanon with Ottoman blessing, eventually becoming the main ruling house of the old regime.",
            "1711. The battle of Ayn Dara helps consolidate Shihab power and weaken rival elite lines.",
            "1783 to 1785. Volney travels through Egypt, Syria, and Mount Lebanon, producing one of the major European descriptions of the region.",
            "1788 to 1840. Bashir Shihab rules Mount Lebanon for most of this period, strengthening his own power while weakening rival notable houses.",
            "1831. Ibrahim Pasha invades Syria and Mount Lebanon for Mehmed Ali of Egypt.",
            "1837 to 1838. Druze rebellion in the Hawran against Egyptian conscription is crushed with the help of Bashir Shihab and Christian villagers.",
            "1839. The Gülhane decree opens the Tanzimat and promises equality before the law.",
            "1840. Revolt against Egyptian rule unites several communities at Antilyas; British and Ottoman power expel Ibrahim Pasha; Bashir Shihab falls.",
            "1841. Violence erupts at Dayr al-Qamar between Christian villagers and Druze notables, marking the beginning of sectarian politics in Makdisi's account.",
            "1842. European and Ottoman diplomacy partitions Mount Lebanon into Christian and Druze kaymakamates.",
            "1844. Nicolas Murad writes his French Notice historique, presenting a Maronite national claim tied to France.",
            "1845. Sekib Efendi reorganizes Mount Lebanon through sectarian councils, wakils, and administrative balance.",
            "1856. The Hatt-i Hümayun renews Tanzimat reform and deepens the language of equality.",
            "1858 to 1859. Tanyus Shahin leads the Kisrawan rebellion against the Khazin shaykhs.",
            "1859. The Bayt Miri clash intensifies fear in the mixed districts and spreads Shahin's reputation.",
            "May to June 1860. Violence spreads through the mixed districts; Druze forces defeat Christian centers and massacre Christians at Dayr al-Qamar, Zahla, Hasbayya, and Rashayya.",
            "July 1860. Damascus violence devastates Bab Tuma and shocks Istanbul and Europe.",
            "1860 to 1861. Fuad Pasha restores order through punishment, trials, executions, exile, and the crushing of popular unrest.",
            "9 June 1861. The Mutasarrifiyya of Mount Lebanon is created.",
            "18 July 1861. Fuad Pasha presents the new order of Mount Lebanon in a public ceremony before local notables and European representatives.",
            "1943 and 1989. Makdisi reads the National Pact and the Taif Accord as later Lebanese arrangements that renew the problem of sectarian representation.",
        ],
    },
    {
        "type": "section",
        "title": "Concepts To Keep",
        "paras": [
            "Ahali. The ordinary people of villages and districts. In old-regime writing, the ahali are often passive subjects. In Kisrawan, they become political actors.",
            "Juhhal. The ignorant ones. Elites use the word to delegitimize commoners. Makdisi turns the term into evidence of class power and political fear.",
            "Tanzimat. Ottoman reforms beginning in 1839. In Istanbul, the reforms promise ordered equality under the Sultan. In Mount Lebanon, they become a field of argument over sect, property, representation, and social equality.",
            "Ta'ifa. A community or sect. The word did not always carry the modern political meaning. Makdisi tracks how it hardens into public identity.",
            "Muqata'ji. A district notable or tax-farming lord. The old regime depended on these families. The Mutasarrifiyya formally abolishes their privilege, while notable power survives through sectarian form.",
            "Wakil. Representative. In Sekib Efendi's system, wakils help administer sectarian balance. In Kisrawan, villagers use representation in a more radical way.",
            "Mada ma mada. Let bygones be bygones. Ottoman and elite settlements use this phrase to restore social order and erase the political meaning of rebellion.",
            "Culture of sectarianism. The public and private world after 1860 in which sect becomes the main political identity, while fear, memory, law, education, and administration keep reproducing it.",
        ],
    },
    {
        "type": "section",
        "title": "What The Notes Add",
        "paras": [
            "The notes in Makdisi's book do more than store citations. They show the argument's archive: British Foreign Office papers, Ottoman documents, French diplomatic sources, Jesuit records, local Arabic chronicles, missionary periodicals, and later Lebanese historiography. The notes are where the fight over evidence becomes visible.",
            "The most important thing the notes add is source discipline. Makdisi does not build the book from one camp's memory. He reads Churchill against local chronicles, Ottoman decrees against Maronite petitions, missionary records against British consular reports, and later historians against the nineteenth-century documents they inherited.",
            "For the research archive here, I saved the full notes text separately. I did not reproduce them inside this abridged book because that would make the reading object heavy in the wrong way. But they are preserved in the folder so you can return to the evidentiary layer whenever an argument needs checking.",
        ],
    },
    {
        "type": "section",
        "title": "Final Image",
        "paras": [
            "At the end of Makdisi's story, the most telling object is not a battlefield. It is a census table waiting to be filled place by place and sect by sect. The old mountain of roads, families, monasteries, shaykhs, muleteers, silk, coffee, and punishment has been translated into columns. Everyone has a public name now. The page is clean. That is the danger.",
        ],
    },
]


def register_fonts():
    font_dir = Path("/System/Library/Fonts/Supplemental")
    pdfmetrics.registerFont(TTFont("Georgia", str(font_dir / "Georgia.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", str(font_dir / "Georgia Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Georgia-Italic", str(font_dir / "Georgia Italic.ttf")))
    pdfmetrics.registerFont(TTFont("Baskerville", str(font_dir / "Baskerville.ttc")))


class PaperDoc(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A5,
            leftMargin=17 * mm,
            rightMargin=17 * mm,
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
    canvas.setFillColor(colors.HexColor("#efe1c3"))
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    random.seed(doc.page * 13)
    for _ in range(1250):
        x = random.random() * width
        y = random.random() * height
        shade = random.choice(["#d3bc8f", "#f6ead2", "#c8ad7c", "#ead5ad"])
        canvas.setFillColor(colors.HexColor(shade), alpha=random.uniform(0.025, 0.085))
        canvas.circle(x, y, random.uniform(0.06, 0.28), stroke=0, fill=1)
    canvas.setFillColor(colors.Color(0.93, 0.82, 0.60, alpha=0.055))
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.restoreState()


def draw_page(canvas, doc):
    draw_paper(canvas, doc)
    width, height = A5
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#7f542d"))
    canvas.setLineWidth(0.35)
    canvas.line(15 * mm, height - 13 * mm, width - 15 * mm, height - 13 * mm)
    canvas.line(15 * mm, 14 * mm, width - 15 * mm, 14 * mm)
    if doc.page > 2:
        canvas.setFillColor(colors.HexColor("#62401f"))
        canvas.setFont("Georgia", 7)
        canvas.drawString(17 * mm, height - 10 * mm, "Makdisi Abridged Book")
        canvas.drawRightString(width - 17 * mm, 10 * mm, str(doc.page))
    canvas.restoreState()


def get_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=base["Title"],
            fontName="Baskerville",
            fontSize=26,
            leading=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#331f10"),
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base["Normal"],
            fontName="Georgia-Italic",
            fontSize=10.5,
            leading=14,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#6d4724"),
            spaceAfter=16,
        ),
        "section": ParagraphStyle(
            "section",
            parent=base["Heading1"],
            fontName="Baskerville",
            fontSize=17,
            leading=21,
            textColor=colors.HexColor("#382111"),
            spaceBefore=0,
            spaceAfter=9,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Georgia",
            fontSize=8.7,
            leading=13.2,
            alignment=TA_JUSTIFY,
            firstLineIndent=4 * mm,
            textColor=colors.HexColor("#2b2117"),
            spaceAfter=5.2,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["BodyText"],
            fontName="Georgia",
            fontSize=8.45,
            leading=12.4,
            alignment=TA_LEFT,
            leftIndent=5 * mm,
            firstLineIndent=-3 * mm,
            textColor=colors.HexColor("#2b2117"),
            spaceAfter=3.2,
        ),
        "remember": ParagraphStyle(
            "remember",
            parent=base["Heading2"],
            fontName="Georgia-Bold",
            fontSize=9.8,
            leading=12,
            textColor=colors.HexColor("#4b2d16"),
            spaceBefore=7,
            spaceAfter=4,
        ),
        "caption": ParagraphStyle(
            "caption",
            parent=base["BodyText"],
            fontName="Georgia-Italic",
            fontSize=7.3,
            leading=10,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#654624"),
            spaceBefore=4,
            spaceAfter=8,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["BodyText"],
            fontName="Georgia-Italic",
            fontSize=7.2,
            leading=10,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#755232"),
        ),
    }


def escape(text: str) -> str:
    return text.replace("&", "&amp;")


def image_flowable(path: Path, max_width: float, max_height: float):
    with PILImage.open(path) as im:
        w, h = im.size
    scale = min(max_width / w, max_height / h)
    return Image(str(path), width=w * scale, height=h * scale)


def build_source() -> str:
    lines = []
    for item in DOCUMENT:
        if item["type"] == "title":
            lines.extend([f"# {item['title']}", item["subtitle"], item["byline"], ""])
        elif item["type"] == "section":
            lines.extend([f"## {item['title']}", ""])
            for para in item.get("paras", []):
                lines.extend([para, ""])
            if item.get("remember"):
                lines.extend(["Remember:", ""])
                for bullet in item["remember"]:
                    lines.append(f"- {bullet}")
                lines.append("")
        elif item["type"] == "image":
            m = MAPS[item["key"]]
            lines.extend([f"![{m['caption']}]({m['path']})", ""])
    return "\n".join(lines)


def build_pdf():
    register_fonts()
    st = get_styles()
    story = []
    for item in DOCUMENT:
        if item["type"] == "title":
            story.append(Spacer(1, 31 * mm))
            story.append(Paragraph(escape(item["title"]), st["title"]))
            story.append(Paragraph(escape(item["subtitle"]), st["subtitle"]))
            story.append(Spacer(1, 3 * mm))
            story.append(Paragraph(escape(item["byline"]), st["subtitle"]))
            story.append(Spacer(1, 82 * mm))
            story.append(Paragraph("Private research abridgment. Original PDF remains untouched.", st["small"]))
            story.append(PageBreak())
        elif item["type"] == "section":
            if story and item["title"].startswith(("Chapter ", "Epilogue", "Timeline", "Concepts", "What The Notes", "Final Image")):
                story.append(PageBreak())
            story.append(Paragraph(escape(item["title"]), st["section"]))
            for para in item.get("paras", []):
                story.append(Paragraph(escape(para), st["body"]))
            if item.get("remember"):
                block = [Paragraph("Remember", st["remember"])]
                for bullet in item["remember"]:
                    block.append(Paragraph("- " + escape(bullet), st["bullet"]))
                story.append(KeepTogether(block[:2]))
                story.extend(block[2:])
            story.append(Spacer(1, 2 * mm))
        elif item["type"] == "image":
            m = MAPS[item["key"]]
            story.append(PageBreak())
            story.append(image_flowable(m["path"], max_width=125 * mm, max_height=158 * mm))
            story.append(Paragraph(escape(m["caption"]), st["caption"]))

    doc = PaperDoc(str(OUT_PDF))
    doc.build(story)


def quality_text_check(text: str):
    banned = [
        "delve", "underscore", "pivotal", "intricate", "tapestry", "robust", "seamless",
        "resonates", "foster", "vibrant", "profound", "journey", "embark", "harness",
        "leverage", "unlock", "unleash", "paradigm", "ecosystem", "testament",
        "indelible", "enduring", "crucial", "emphasizing", "highlighting",
        "showcasing", "reflecting", "contributing to", "encompassing", "multifaceted",
        "holistic", "it is worth noting", "in today's rapidly evolving", "in an era where",
        "not only", "not just", "stands as", "serves as", "represents", "marks a",
    ]
    hits = []
    low = text.lower()
    for word in banned:
        if word in low:
            hits.append(word)
    if "—" in text or "–" in text:
        hits.append("dash")
    if hits:
        raise SystemExit("Banned prose hits: " + ", ".join(sorted(set(hits))))


if __name__ == "__main__":
    md = build_source()
    quality_text_check(md)
    OUT_SOURCE.write_text(md, encoding="utf-8")
    build_pdf()
    print(OUT_SOURCE)
    print(OUT_PDF)
